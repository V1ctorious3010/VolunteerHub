package com.example.backend.service;

import com.example.backend.entity.Event;
import com.example.backend.repo.EventRepository;
import com.example.backend.dto.*;
import com.example.backend.dto.EventReportDto;
import com.example.backend.dto.VolunteerReportDto;
import com.example.backend.entity.*;
import com.example.backend.exception.*;
import com.example.backend.repo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    /**
     * Get public events with search and pagination
     * GET /events
     * Returns only COMING, ONGOING, FINISHED events
     * Supports keyword, category, startTime filter and sorting
     */
    @Transactional(readOnly = true)
    public Page<EventDetailDto> getEvents(String keyword, String category, String start, int page, String sortBy) {
        int size = 9; // default page size or 9
        Sort sort = parseSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        LocalDateTime startAt = parseDate(start);

        Page<Event> result = eventRepository.searchEvents(keyword, category, startAt, pageable);
        return result.map(this::mapToDetailDto);
    }
    /**
     * Create new event with PENDING status
     * POST /events
     * Sets remaining = noOfVolunteer initially
     */
    @Transactional
    public EventDetailDto createEvent(CreateEventRequest request, String organizerEmail) {
        log.info("Creating event '{}' by organizer {}", request.getTitle(), organizerEmail);

        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new UserNotFoundException(organizerEmail));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setLocation(request.getLocation());
        event.setThumbnail(request.getThumbnail());
        event.setNoOfVolunteer(request.getNoOfVolunteer());
        event.setRemaining(request.getNoOfVolunteer());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setStatus(Event.EventStatus.PENDING);
        event.setOrganizer(organizer);
        event.setCreatedAt(LocalDateTime.now());
        event.setApprovedAt(null);

        Event saved = eventRepository.save(event);

        log.info("Event created successfully with ID: {}", saved.getId());
        return mapToDetailDto(saved);
    }

    /**
     * Update existing event (only by organizer)
     * PUT /events/{eventId}
     * Cannot update ONGOING or FINISHED events
     * Can adjust noOfVolunteer if >= approved count
     */
    @Transactional
    public EventDetailDto updateEvent(Long eventId, UpdateEventRequest request, String organizerEmail) {
        log.info("Updating event {} by organizer {}", eventId, organizerEmail);

        Event event = eventRepository.findByIdAndOrganizerEmail(eventId, organizerEmail)
                .orElseThrow(() -> new EventNotOwnedException(eventId, organizerEmail));

        if (event.getStatus() == Event.EventStatus.FINISHED ||
                event.getStatus() == Event.EventStatus.ONGOING) {
            throw new EventCannotBeModifiedException("Cannot modify event with status: " + event.getStatus().name());
        }

        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }
        if (request.getThumbnail() != null) {
            event.setThumbnail(request.getThumbnail());
        }
        if (request.getEndTime() != null) {
            event.setEndTime(request.getEndTime());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getStartTime() != null) {
            event.setStartTime(request.getStartTime());
        }

        // Handle noOfVolunteer update
        if (request.getNoOfVolunteer() != null) {
            int currentApproved = (int) registrationRepository
                    .countByEventIdAndStatus(eventId, Registration.RequestStatus.APPROVED);

            if (request.getNoOfVolunteer() < currentApproved) {
                throw new EventCannotBeModifiedException(
                        "Cannot reduce volunteer slots below approved count: " + currentApproved);
            }

            // Update remaining based on new total
            int difference = request.getNoOfVolunteer() - event.getNoOfVolunteer();
            event.setNoOfVolunteer(request.getNoOfVolunteer());
            event.setRemaining(event.getRemaining() + difference);
        }

        if (request.getCategory() != null) {
            event.setCategory(request.getCategory());
        }

        Event updated = eventRepository.save(event);
        log.info("Event {} updated successfully", eventId);
        return mapToDetailDto(updated);
    }

    /**
     * Delete event by organizer
     * DELETE /events/{eventId}
     * Only allows deleting PENDING or COMING status events
     */
    @Transactional
    public void deleteEvent(Long eventId, String organizerEmail) {
        log.info("Deleting event {} by organizer {}", eventId, organizerEmail);

        Event event = eventRepository.findByIdAndOrganizerEmail(eventId, organizerEmail)
                .orElseThrow(() -> new EventNotOwnedException(eventId, organizerEmail));

        if (event.getStatus() != Event.EventStatus.PENDING && 
                event.getStatus() != Event.EventStatus.COMING) {
            throw new EventCannotBeModifiedException(
                    "Can only delete events with PENDING or COMING status. Current status: " + event.getStatus().name());
        }

        eventRepository.delete(event);
        log.info("Event {} deleted successfully", eventId);
    }

    /**
     * Get organizer's own events with optional status filter
     * GET /events/my-events?status=PENDING
     * Returns all events created by organizer
     */
    @Transactional(readOnly = true)
    public Page<EventDetailDto> getMyEvents(String organizerEmail, String status, int page, int size) {
        log.info("Fetching my events for organizer {} with status filter: {}", organizerEmail, status);

        Event.EventStatus eventStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                eventStatus = Event.EventStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status filter: {}", status);
            }
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Event> events = eventRepository.findMyEvents(organizerEmail, eventStatus, pageable);

        return events.map(this::mapToDetailDto);
    }

    /**
     * Get event detail with role-based access control
     * GET /events/{eventId}
     * - Public/Volunteer: Only COMING, ONGOING, FINISHED
     * - Organizer: Own events (all statuses)
     * - Admin: All events (all statuses)
     */
    @Transactional(readOnly = true)
    public EventDetailDto getEventDetail(Long eventId, String userEmail) {
        log.info("Fetching event detail for event {} by user {}", eventId, userEmail);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            
            // Admin can view all events
            if (user != null && user.getRole() == User.Role.ADMIN) {
                log.debug("Admin {} viewing event {}", userEmail, eventId);
                return mapToDetailDto(event);
            }
            
            // Organizer can view their own events (all status)
            if (event.getOrganizer() != null && event.getOrganizer().getEmail().equals(userEmail)) {
                log.debug("Organizer {} viewing own event {}", userEmail, eventId);
                return mapToDetailDto(event);
            }
        }
        
        // Public/Volunteer: Only approved events
        if (event.getStatus() == Event.EventStatus.PENDING ||
            event.getStatus() == Event.EventStatus.REJECTED) {
            throw new EventNotFoundException("Event not found or not available");
        }

        return mapToDetailDto(event);
    }

    /**
     * Get events for admin with optional status filter
     * GET /api/admin/events?status=PENDING (null for all events)
     */
    @Transactional(readOnly = true)
    public Page<EventDetailDto> getEventsForAdmin(String status, int page, int size) {
        log.info("Fetching events for admin (status={}, page={}, size={})", status, page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Event> events;
        
        if (status == null || status.trim().isEmpty()) {
            // Get all events
            events = eventRepository.findAll(pageable);
        } else {
            // Filter by specific status
            Event.EventStatus eventStatus = Event.EventStatus.valueOf(status.toUpperCase());
            events = eventRepository.findByStatusOrderByCreatedAtAsc(eventStatus, pageable);
        }

        return events.map(this::mapToDetailDto);
    }
    /**
     * Admin approves or rejects pending event
     * PATCH /admin/events/{eventId}/status
     * Only PENDING events can be approved/rejected
     * Sets approvedAt timestamp when status changed to COMING
     */
    @Transactional
    public EventDetailDto updateEventStatus(Long eventId, String newStatus) {
        log.info("Admin updating event {} status to {}", eventId, newStatus);

        // 1. Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        // 2. Validate current status is PENDING
        if (event.getStatus() != Event.EventStatus.PENDING) {
            throw new InvalidEventStatusException(
                    "Chỉ có thể duyệt/từ chối sự kiện ở trạng thái PENDING. Trạng thái hiện tại: " + event.getStatus().name());
        }

        // 3. Parse and validate new status
        Event.EventStatus status;
        try {
            status = Event.EventStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidEventStatusException("Trạng thái không hợp lệ: " + newStatus);
        }

        if (status != Event.EventStatus.COMING && status != Event.EventStatus.REJECTED) {
            throw new InvalidEventStatusException("Quản trị viên chỉ có thể đặt trạng thái COMING hoặc REJECTED");
        }

        // 4. Update status
        event.setStatus(status);

        // 5. Set approvedAt if approved
        if (status == Event.EventStatus.COMING) {
            event.setApprovedAt(LocalDateTime.now());
            log.info("Event {} approved at {}", eventId, event.getApprovedAt());
        }

        // 6. Save and return
        Event updated = eventRepository.save(event);
        log.info("Event {} status updated to {}", eventId, status);
        return mapToDetailDto(updated);
    }

    /**
     * Admin deletes event (any status allowed)
     * DELETE /admin/events/{eventId}
     * No status restrictions for admin deletion
     */
    @Transactional
    public void deleteEventByAdmin(Long eventId) {
        log.info("Admin deleting event {}", eventId);

        // 1. Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        // 2. Delete event (admin has full permission, no status check)
        eventRepository.delete(event);
        log.info("Event {} deleted successfully by admin", eventId);
    }

    /**
     * Get event report with volunteer list (organizer only)
     * GET /events/{eventId}/report
     * Returns registration statistics and paginated volunteer list
     * Can filter by registration status (default: APPROVED)
     */
    @Transactional(readOnly = true)
    public EventReportDto getEventReport(
            Long eventId,
            String organizerEmail,
            Registration.RequestStatus status,
            int page,
            int size
    ) {
        log.info("Getting event report for event {}, organizer {}, status {}", eventId, organizerEmail, status);

        // 1. Find event and verify ownership
        Event event = eventRepository.findByIdAndOrganizerEmail(eventId, organizerEmail)
                .orElseThrow(() -> new EventNotOwnedException());

        // 2. Calculate statistics
        Long totalRegistrations = registrationRepository.countByEventId(eventId);
        Long approvedCount = registrationRepository.countByEventIdAndStatus(eventId, Registration.RequestStatus.APPROVED);
        Long completedCount = registrationRepository.countByEventIdAndStatus(eventId, Registration.RequestStatus.COMPLETED);
        Long pendingCount = registrationRepository.countByEventIdAndStatus(eventId, Registration.RequestStatus.PENDING);
        Long rejectedCount = registrationRepository.countByEventIdAndStatus(eventId, Registration.RequestStatus.REJECTED);

        // 3. Get paginated volunteers filtered by status (default APPROVED)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Registration> registrationPage = registrationRepository.findByEventIdAndStatus(eventId, status, pageable);

        // 4. Map to VolunteerReportDto
        Page<VolunteerReportDto> volunteerPage = registrationPage.map(registration -> {
            User user = registration.getUser();
            return VolunteerReportDto.builder()
                    .userEmail(user.getEmail())
                    .name(user.getName())
                    .email(user.getEmail())
                    .avatar(user.getAvatar())
                    .registeredAt(registration.getCreatedAt())
                    .status(registration.getStatus().toString())
                    .build();
        });

        // 5. Build EventReportDto
        return EventReportDto.builder()
                .totalRegistrations(totalRegistrations)
                .approvedCount(approvedCount)
                .completedCount(completedCount)
                .pendingCount(pendingCount)
                .rejectedCount(rejectedCount)
                .volunteers(volunteerPage)
                .build();
    }

    /**
     * Export all events as EventDetailDto list
     * GET /admin/events/export
     */
    @Transactional(readOnly = true)
    public List<EventDetailDto> exportAllEvents() {
        log.info("Exporting all events");
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::mapToDetailDto)
                .toList();
    }

    /**
     * Get events with recent posts
     * GET /events/recent-activity
     * Returns events that have at least one post
     * Ordered by most recent post activity
     */
    @Transactional(readOnly = true)
    public Page<EventDetailDto> getRecentActivityEvents(int page, int size) {
        log.info("Getting events with recent activity (page={}, size={})", page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> events = eventRepository.findEventsWithRecentPosts(pageable);
        
        return events.map(this::mapToDetailDto);
    }

    /**
     * Get featured events sorted by engagement
     * GET /events/featured
     * Counts posts, comments, likes from last 3 days
     * Includes COMING, ONGOING, FINISHED events
     */
    @Transactional(readOnly = true)
    public Page<EventDetailDto> getFeaturedEvents(int page, int size) {
        log.info("Getting featured events (page={}, size={})", page, size);
        
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> events = eventRepository.findFeaturedEvents(threeDaysAgo, pageable);
        
        return events.map(this::mapToDetailDto);
    }

    private Sort parseSort(String sortBy) {
        String field = "startTime";//if reuse
        Sort.Direction dir = Sort.Direction.ASC;

        if (sortBy != null && !sortBy.isBlank()) {
            String[] parts = sortBy.split(",");
            if (!parts[0].isBlank()) field = parts[0].trim();
            if (parts.length > 1) {
                try { dir = Sort.Direction.fromString(parts[1].trim()); }
                catch (Exception ignored) {}
            }
        }
        return Sort.by(dir, field);
    }

    private LocalDateTime parseDate(String input) {
        if (input == null || input.isBlank()) return null;
        try {
            return LocalDateTime.parse(input, DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        } catch (Exception e) {
            try {
                return LocalDate.parse(input, DateTimeFormatter.ofPattern("dd/MM/yyyy")).atStartOfDay();
            } catch (Exception ignored) {
                return null;
            }
        }
    }


    private EventDetailDto mapToDetailDto(Event event) {
        EventDetailDto dto = new EventDetailDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setLocation(event.getLocation());
        dto.setThumbnail(event.getThumbnail());
        dto.setNoOfVolunteer(event.getNoOfVolunteer());
        dto.setRemaining(event.getRemaining());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setDescription(event.getDescription());
        dto.setStatus(event.getStatus().name());
        dto.setOrgName(event.getOrganizer() != null ? event.getOrganizer().getName() : null);
        dto.setOrgEmail(event.getOrganizer() != null ? event.getOrganizer().getEmail() : null);
        dto.setCreatedAt(event.getCreatedAt());
        dto.setApprovedAt(event.getApprovedAt());
        dto.setCategory(event.getCategory());

        // Get registration statistics
        List<Registration> registrations = registrationRepository.findByEventId(event.getId());
//        dto.setTotalRegistrations(registrations.size());
//        dto.setApprovedCount((int) registrations.stream()
//                .filter(r -> r.getStatus() == Registration.RequestStatus.APPROVED).count());
        dto.setPendingCount((int) registrations.stream()
                .filter(r -> r.getStatus() == Registration.RequestStatus.PENDING).count());
//        dto.setRejectedCount((int) registrations.stream()
//                .filter(r -> r.getStatus() == Registration.RequestStatus.REJECTED).count());
//        dto.setCompletedCount((int) registrations.stream()
//                .filter(r -> r.getStatus() == Registration.RequestStatus.COMPLETED).count());

        return dto;
    }
}