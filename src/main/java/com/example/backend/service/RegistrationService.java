package com.example.backend.service;

import com.example.backend.dto.MyRegistrationDto;
import com.example.backend.dto.RegistrationDto;
import com.example.backend.dto.RegistrationStatusRequest;
import com.example.backend.entity.Event;
import com.example.backend.entity.Registration;
import com.example.backend.entity.User;
import com.example.backend.exception.*;
import com.example.backend.repo.EventRepository;
import com.example.backend.repo.RegistrationRepository;
import com.example.backend.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    /**
     * Volunteer registers for an event
     * POST /events/{eventId}/registration
     */
    @Transactional
    public RegistrationDto registerForEvent(Long eventId, String userEmail) {
        log.info("User {} attempting to register for event {}", userEmail, eventId);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        validateEventRegistration(event, eventId, userEmail);

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setStatus(Registration.RequestStatus.PENDING);
        registration.setCreatedAt(LocalDateTime.now());

        Registration saved = registrationRepository.save(registration);
        log.info("User {} successfully registered for event {} with registration ID {}", 
                userEmail, eventId, saved.getId());
        
        return mapToRegistrationDto(saved);
    }

    /**
     * Volunteer cancels their registration
     * DELETE /registrations/{registrationId}
     */
    @Transactional
    public void cancelRegistration(Long registrationId, String userEmail) {
        log.info("User {} attempting to cancel registration {}", userEmail, registrationId);
        
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RegistrationNotFoundException(registrationId));

        if (!registration.getUser().getEmail().equals(userEmail)) {
            log.warn("Unauthorized cancellation attempt by {} for registration {}", 
                    userEmail, registrationId);
            throw new UnauthorizedAccessException("You can only cancel your own registrations");
        }

        Event event = registration.getEvent();
        if (event.getStartTime().isBefore(LocalDateTime.now())) {
            throw new InvalidEventStatusException("Cannot cancel registration for event that has already started");
        }

        if (registration.getStatus() == Registration.RequestStatus.REJECTED ||
            registration.getStatus() == Registration.RequestStatus.COMPLETED) {
            throw new InvalidEventStatusException("Cannot cancel registration with status: " + 
                    registration.getStatus());
        }

        registrationRepository.delete(registration);
        log.info("Registration {} cancelled successfully by {}", registrationId, userEmail);
    }

    /**
     * Get volunteer's own registrations with filtering and pagination
     * GET /registrations?status=APPROVED&page=0&size=10
     */
    @Transactional(readOnly = true)
    public Page<MyRegistrationDto> getMyRegistrations(
            String userEmail, 
            String status, 
            int page, 
            int size) {
        
        log.info("Fetching registrations for user {} with status filter: {}", userEmail, status);
        
        Registration.RequestStatus requestStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                requestStatus = Registration.RequestStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status filter: {}", status);
            }
        }

        // Create pageable
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<Registration> registrations = registrationRepository.findByUserEmailAndStatus(
                userEmail, requestStatus, pageable);
        
        return registrations.map(this::mapToMyRegistrationDto);
    }

    /**
     * Get registrations for a specific event (for organizer)
     * GET /events/{eventId}/registrations
     */
    @Transactional(readOnly = true)
    public Page<RegistrationDto> getEventRegistrations(
            Long eventId, 
            String organizerEmail, 
            int page, 
            int size) {
        
        log.info("Fetching registrations for event {} by organizer {}", eventId, organizerEmail);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));
        
        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedAccessException("You can only view registrations for your own events");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Registration> registrations = registrationRepository.findByEventId(eventId, pageable);
        
        return registrations.map(this::mapToRegistrationDto);
    }

    /**
     * Update registration status (Approve/Reject/Complete)
     * PATCH /registrations/{registrationId}/status
     * For EVENT_ORGANIZER only
     */
    @Transactional
    public RegistrationDto updateRegistrationStatus(
            Long registrationId,
            RegistrationStatusRequest request,
            String organizerEmail) {
        
        log.info("Organizer {} updating registration {} to status {}", 
                organizerEmail, registrationId, request.getStatus());
        
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RegistrationNotFoundException(registrationId));

        Event event = registration.getEvent();
        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedAccessException("You can only manage registrations for your own events");
        }

        Registration.RequestStatus newStatus;
        try {
            newStatus = Registration.RequestStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidEventStatusException("Invalid status: " + request.getStatus());
        }

        // Validate status transition
        Registration.RequestStatus oldStatus = registration.getStatus();
        validateStatusTransition(oldStatus, newStatus, event);

        // Update remaining slots and handle auto-rejection if full
        updateEventRemainingSlots(event, oldStatus, newStatus);

        // Update status
        registration.setStatus(newStatus);
        Registration saved = registrationRepository.save(registration);
        
        // If approved and event is now full, auto-reject all other pending registrations
        if (newStatus == Registration.RequestStatus.APPROVED && event.getRemaining() == 0) {
            autoRejectPendingRegistrations(event.getId());
        }
        
        log.info("Registration {} updated from {} to {} by organizer {}", 
                registrationId, oldStatus, newStatus, organizerEmail);
        
        return mapToRegistrationDto(saved);
    }

    private void validateEventRegistration(Event event, Long eventId, String userEmail) {
        // Check event status - only allow registration for COMING events
        if (event.getStatus() != Event.EventStatus.COMING) {
            throw new InvalidEventStatusException(
                    "Cannot register for event with status: " + event.getStatus());
        }

        // Check if event has passed
        if (event.getStartTime().isBefore(LocalDateTime.now())) {
            throw new InvalidEventStatusException("Cannot register for past events");
        }

        // Check if already registered
        if (registrationRepository.existsByEventIdAndUserEmail(eventId, userEmail)) {
            throw new DuplicateRegistrationException();
        }
    }

    private void validateStatusTransition(
            Registration.RequestStatus oldStatus, 
            Registration.RequestStatus newStatus,
            Event event) {
        
        // Allow APPROVED -> COMPLETED even when event FINISHED
        boolean isMarkingCompleted = (oldStatus == Registration.RequestStatus.APPROVED && 
                                      newStatus == Registration.RequestStatus.COMPLETED);
        
        // Cannot change status if event has finished (except marking as COMPLETED)
        if (!isMarkingCompleted && 
            (event.getStatus() == Event.EventStatus.FINISHED || 
             event.getStatus() == Event.EventStatus.CANCELLED)) {
            throw new InvalidEventStatusException(
                    "Cannot update registration for event with status: " + event.getStatus());
        }

        // PENDING can go to APPROVED or REJECTED
        // APPROVED can go to REJECTED or COMPLETED
        // REJECTED cannot be changed
        // COMPLETED cannot be changed
        
        if (oldStatus == Registration.RequestStatus.REJECTED) {
            throw new InvalidEventStatusException("Cannot change status of rejected registration");
        }
        
        if (oldStatus == Registration.RequestStatus.COMPLETED) {
            throw new InvalidEventStatusException("Cannot change status of completed registration");
        }

        // Can only mark as COMPLETED if currently APPROVED and event is ONGOING or FINISHED
        if (newStatus == Registration.RequestStatus.COMPLETED) {
            if (oldStatus != Registration.RequestStatus.APPROVED) {
                throw new InvalidEventStatusException(
                        "Can only mark APPROVED registrations as COMPLETED");
            }
            if (event.getStatus() == Event.EventStatus.COMING) {
                throw new InvalidEventStatusException(
                        "Cannot mark registration as COMPLETED before event starts");
            }
        }
    }

    private void updateEventRemainingSlots(
            Event event,
            Registration.RequestStatus oldStatus,
            Registration.RequestStatus newStatus) {
        
        // PENDING -> APPROVED: decrease slot (consume slot when approved)
        // PENDING -> REJECTED: no change
        // APPROVED -> REJECTED: increase slot (give back the slot)
        // APPROVED -> COMPLETED: no change
        
        if (oldStatus == Registration.RequestStatus.PENDING && 
            newStatus == Registration.RequestStatus.APPROVED) {
            // Consume a slot when approving
            if (event.getRemaining() > 0) {
                event.setRemaining(event.getRemaining() - 1);
                eventRepository.save(event);
                log.info("Event {} remaining slots decreased to {} (approved registration)", 
                        event.getId(), event.getRemaining());
            } else {
                throw new EventFullException("Cannot approve registration, event is full");
            }
        } else if (oldStatus == Registration.RequestStatus.APPROVED && 
                   newStatus == Registration.RequestStatus.REJECTED) {
            // Give back slot when rejecting previously approved registration
            event.setRemaining(event.getRemaining() + 1);
            eventRepository.save(event);
            log.info("Event {} remaining slots increased to {} (rejected approved registration)", 
                    event.getId(), event.getRemaining());
        }
    }
    
    /**
     * Auto-reject all pending registrations when event is full
     */
    private void autoRejectPendingRegistrations(Long eventId) {
        List<Registration> pendingRegistrations = registrationRepository
                .findByEventId(eventId)
                .stream()
                .filter(r -> r.getStatus() == Registration.RequestStatus.PENDING)
                .toList();
        
        if (!pendingRegistrations.isEmpty()) {
            pendingRegistrations.forEach(r -> r.setStatus(Registration.RequestStatus.REJECTED));
            registrationRepository.saveAll(pendingRegistrations);
            log.info("Auto-rejected {} pending registrations for full event {}", 
                    pendingRegistrations.size(), eventId);
        }
    }

    private RegistrationDto mapToRegistrationDto(Registration registration) {
        RegistrationDto dto = new RegistrationDto();
        dto.setId(registration.getId());
        dto.setEventId(registration.getEvent().getId());
        dto.setEventTitle(registration.getEvent().getTitle());
        dto.setEventLocation(registration.getEvent().getLocation());
        dto.setEventThumbnail(registration.getEvent().getThumbnail());
        dto.setEventStartTime(registration.getEvent().getStartTime());
        dto.setUserName(registration.getUser().getName());
        dto.setUserEmail(registration.getUser().getEmail());
        dto.setUserAvatar(registration.getUser().getAvatar());
        dto.setStatus(registration.getStatus().name());
        dto.setCreatedAt(registration.getCreatedAt());
        return dto;
    }

    private MyRegistrationDto mapToMyRegistrationDto(Registration registration) {
        MyRegistrationDto dto = new MyRegistrationDto();
        dto.setRegistrationId(registration.getId());
        dto.setEventId(registration.getEvent().getId());
        dto.setEventTitle(registration.getEvent().getTitle());
        dto.setEventLocation(registration.getEvent().getLocation());
        dto.setEventThumbnail(registration.getEvent().getThumbnail());
        dto.setEventEndTime(registration.getEvent().getEndTime());
        dto.setEventStatus(registration.getEvent().getStatus().name());
        dto.setEventStartTime(registration.getEvent().getStartTime());
        dto.setOrganizerName(registration.getEvent().getOrganizer().getName());
        dto.setOrganizerEmail(registration.getEvent().getOrganizer().getEmail());
        dto.setRegistrationStatus(registration.getStatus().name());
        dto.setRegisteredAt(registration.getCreatedAt());
        return dto;
    }
}
