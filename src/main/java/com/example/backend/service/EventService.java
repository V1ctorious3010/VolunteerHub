package com.example.backend.service;

import com.example.backend.entity.Event;
import com.example.backend.repo.EventRepository;
import com.example.backend.dto.*;
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

    @Transactional(readOnly = true)
    public Page<EventDetailDto> getEvents(String keyword, String location, String start, int page, String sortBy) {
        int size = 24; // default page size or 24
        Sort sort = parseSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        LocalDateTime startAt = parseDate(start);

        Page<Event> result = eventRepository.searchEvents(keyword, location, startAt, pageable);
        return result.map(this::mapToDetailDto);
    }
    /**
     * Create new event
     * POST /api/events
     */
    @Transactional
    public EventDetailDto createEvent(CreateEventRequest request, String organizerEmail) {
        log.info("Creating event '{}' by organizer {}", request.getTitle(), organizerEmail);

        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found: " + organizerEmail));

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
     * Update existing event
     * PUT /api/events/{eventId}
     */
    @Transactional
    public EventDetailDto updateEvent(Long eventId, UpdateEventRequest request, String organizerEmail) {
        log.info("Updating event {} by organizer {}", eventId, organizerEmail);

        Event event = eventRepository.findByIdAndOrganizerEmail(eventId, organizerEmail)
                .orElseThrow(() -> new EventNotOwnedException(eventId, organizerEmail));

        if (event.getStatus() == Event.EventStatus.FINISHED ||
                event.getStatus() == Event.EventStatus.CANCELLED) {
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
     * Delete event
     * DELETE /api/events/{eventId}
     */
    @Transactional
    public void deleteEvent(Long eventId, String organizerEmail) {
        log.info("Deleting event {} by organizer {}", eventId, organizerEmail);

        Event event = eventRepository.findByIdAndOrganizerEmail(eventId, organizerEmail)
                .orElseThrow(() -> new EventNotOwnedException(eventId, organizerEmail));

        if (event.getStatus() != Event.EventStatus.PENDING) {
            throw new EventCannotBeModifiedException(
                    "Can only delete events with PENDING status. Current status: " + event.getStatus().name());
        }

        eventRepository.delete(event);
        log.info("Event {} deleted successfully", eventId);
    }

    /**
     * Get my events with filtering
     * GET /api/events/my-events
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
     * Get event detail
     * GET /api/events/{eventId}
     */
    @Transactional(readOnly = true)
    public EventDetailDto getEventDetail(Long eventId) {
        log.info("Fetching event detail for event {}", eventId);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        // Don't allow viewing PENDING events (not approved yet)
        if (event.getStatus() == Event.EventStatus.PENDING) {
            throw new EventNotFoundException("Event not found or not yet approved");
        }

        return mapToDetailDto(event);
    }

    /**
     * Get pending events for admin approval
     * GET /api/admin/events
     */
    @Transactional(readOnly = true)
    public Page<EventDetailDto> getPendingEventsForAdmin(int page, int size) {
        log.info("Fetching pending events for admin (page={}, size={})", page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Event> events = eventRepository.findByStatusOrderByCreatedAtAsc(Event.EventStatus.PENDING, pageable);

        return events.map(this::mapToDetailDto);
    }
    /**
     * Update event status (approve/reject)
     * PATCH /api/admin/events/{eventId}/status
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
                    "Can only approve/reject events with PENDING status. Current status: " + event.getStatus().name());
        }

        // 3. Parse and validate new status
        Event.EventStatus status;
        try {
            status = Event.EventStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidEventStatusException("Invalid status: " + newStatus);
        }

        if (status != Event.EventStatus.COMING && status != Event.EventStatus.REJECTED) {
            throw new InvalidEventStatusException("Admin can only set status to COMING or REJECTED");
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
     * Delete event by admin (any status allowed)
     * DELETE /api/admin/events/{eventId}
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