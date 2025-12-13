package com.example.backend.controller;


import com.example.backend.dto.CreateEventRequest;
import com.example.backend.dto.EventDetailDto;
import com.example.backend.dto.UpdateEventRequest;
import com.example.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;

    @GetMapping("/events")
    public ResponseEntity<Page<EventDetailDto>> getEvents(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "") String start,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "approvedAt,asc") String sortBy
    ) {
        log.info("GET /events (keyword={}, category={}, start={}, page={})",
                keyword, category, start, page);

        return ResponseEntity.ok(eventService.getEvents(keyword, category, start, page, sortBy));
    }

    /**
     * Get event detail
     * GET /events/{eventId}
     * Public: only COMING, ONGOING, FINISHED
     * Organizer: can view their own events (all status)
     * Admin: can view all events (all status)
     */
    @GetMapping("/events/{eventId}")
    public ResponseEntity<EventDetailDto> getEventDetail(
            @PathVariable Long eventId,
            Authentication authentication) {
        
        String userEmail = authentication != null ? authentication.getName() : null;
        log.info("GET /events/{} by user: {}", eventId, userEmail);

        EventDetailDto event = eventService.getEventDetail(eventId, userEmail);
        return ResponseEntity.ok(event);
    }

    /**
     * Create new event
     * POST /events
     * Role: EVENT_ORGANIZER
     */
    @PostMapping("/events")
    @PreAuthorize("hasAnyRole('EVENT_ORGANIZER')")
    public ResponseEntity<EventDetailDto> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            Authentication authentication) {

        String organizerEmail = authentication.getName();
        log.info("POST /events by {}", organizerEmail);

        EventDetailDto event = eventService.createEvent(request, organizerEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    /**
     * Update event
     * PUT /events/{eventId}
     * Role: EVENT_ORGANIZER
     */
    @PutMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('EVENT_ORGANIZER')")
    public ResponseEntity<EventDetailDto> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody UpdateEventRequest request,
            Authentication authentication) {

        String organizerEmail = authentication.getName();
        log.info("PUT /events/{} by {}", eventId, organizerEmail);

        EventDetailDto event = eventService.updateEvent(eventId, request, organizerEmail);
        return ResponseEntity.ok(event);
    }

    /**
     * Delete event (only PENDING status)
     * DELETE /events/{eventId}
     * Role: EVENT_ORGANIZER, ADMIN
     */
    @DeleteMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('EVENT_ORGANIZER')")
    public ResponseEntity<Map<String, String>> deleteEvent(
            @PathVariable Long eventId,
            Authentication authentication) {

        String organizerEmail = authentication.getName();
        log.info("DELETE /events/{} by {}", eventId, organizerEmail);

        eventService.deleteEvent(eventId, organizerEmail);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Event deleted successfully");
        response.put("eventId", eventId.toString());

        return ResponseEntity.ok(response);
    }

    /**
     * Get my events
     * GET /events/my-events
     * Role: EVENT_ORGANIZER
     */
    @GetMapping("/events/my-events")
    @PreAuthorize("hasAnyRole('EVENT_ORGANIZER')")
    public ResponseEntity<Page<EventDetailDto>> getMyEvents(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {

        String organizerEmail = authentication.getName();
        log.info("GET /events/my-events by {} (status={}, page={}, size={})",
                organizerEmail, status, page, size);

        Page<EventDetailDto> events = eventService.getMyEvents(organizerEmail, status, page, size);
        return ResponseEntity.ok(events);
    }
}