package com.example.backend.controller;

import com.example.backend.dto.EventDetailDto;
import com.example.backend.dto.EventStatusRequest;
import com.example.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminEventController {

    private final EventService eventService;

    /**
     * Get events for admin (with optional status filter)
     * GET /admin/events?status=PENDING (or null for all events)
     * Role: ADMIN
     */
    @GetMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EventDetailDto>> getEvents(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        log.info("Admin GET /admin/events (status={}, page={}, size={})", status, page, size);

        Page<EventDetailDto> events = eventService.getEventsForAdmin(status, page, size);
        return ResponseEntity.ok(events);
    }

    /**
     * Approve or reject event
     * PATCH /admin/events/{eventId}/status
     * Role: ADMIN
     */
    @PatchMapping("/events/{eventId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventDetailDto> updateEventStatus(
            @PathVariable Long eventId,
            @Valid @RequestBody EventStatusRequest request) {

        log.info("Admin PATCH /admin/events/{}/status to {}", eventId, request.getStatus());

        EventDetailDto event = eventService.updateEventStatus(eventId, request.getStatus());
        return ResponseEntity.ok(event);
    }

    /**
     * Delete event (any status)
     * DELETE /admin/events/{eventId}
     * Role: ADMIN
     */
    @DeleteMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long eventId) {

        log.info("Admin DELETE /admin/events/{}", eventId);

        eventService.deleteEventByAdmin(eventId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Quản trị viên đã xóa sự kiện thành công");
        response.put("eventId", eventId.toString());

        return ResponseEntity.ok(response);
    }

    /**
     * Export all events as JSON
     * GET /admin/events/export
     * Role: ADMIN
     */
    @GetMapping("/events/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventDetailDto>> exportEvents() {
        log.info("Admin GET /admin/events/export");

        List<EventDetailDto> events = eventService.exportAllEvents();
        return ResponseEntity.ok(events);
    }
}