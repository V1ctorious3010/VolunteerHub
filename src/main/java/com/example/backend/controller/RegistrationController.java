package com.example.backend.controller;

import com.example.backend.dto.MyRegistrationDto;
import com.example.backend.dto.RegistrationDto;
import com.example.backend.dto.RegistrationStatusRequest;
import com.example.backend.service.RegistrationService;
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
public class RegistrationController {

    private final RegistrationService registrationService;

    /**
     * Volunteer registers for an event
     * POST /events/{eventId}/registration
     * Role: VOLUNTEER, EVENT_ORGANIZER, ADMIN
     */
    @PostMapping("/events/{eventId}/registration")
    @PreAuthorize("hasAnyRole('VOLUNTEER')")
    public ResponseEntity<RegistrationDto> registerForEvent(
            @PathVariable Long eventId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        log.info("POST /events/{}/registration by {}", eventId, userEmail);
        
        RegistrationDto registration = registrationService.registerForEvent(eventId, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(registration);
    }

    /**
     * Volunteer cancels their registration
     * DELETE /registrations/{registrationId}
     * Role: VOLUNTEER, EVENT_ORGANIZER, ADMIN
     */
    @DeleteMapping("/registrations/{registrationId}")
    @PreAuthorize("hasAnyRole('VOLUNTEER')")
    public ResponseEntity<Map<String, String>> cancelRegistration(
            @PathVariable Long registrationId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        log.info("DELETE /registrations/{} by {}", registrationId, userEmail);
        
        registrationService.cancelRegistration(registrationId, userEmail);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration cancelled successfully");
        response.put("registrationId", registrationId.toString());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get volunteer's own registrations with filtering
     * GET /registrations?status=APPROVED&page=0&size=12
     * Role: VOLUNTEER, EVENT_ORGANIZER, ADMIN
     */
    @GetMapping("/registrations")
    @PreAuthorize("hasAnyRole('VOLUNTEER')")
    public ResponseEntity<Page<MyRegistrationDto>> getMyRegistrations(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        log.info("GET /registrations by {} (status={}, page={}, size={})",
                userEmail, status, page, size);
        
        Page<MyRegistrationDto> registrations = registrationService.getMyRegistrations(
                userEmail, status, page, size);
        
        return ResponseEntity.ok(registrations);
    }

    /**
     * Get registrations for a specific event (for organizer)
     * GET /events/{eventId}/registrations?page=0&size=12
     * Role: EVENT_ORGANIZER, ADMIN
     */
    @GetMapping("/events/{eventId}/registrations")
    @PreAuthorize("hasAnyRole('EVENT_ORGANIZER')")
    public ResponseEntity<Page<RegistrationDto>> getEventRegistrations(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        
        String organizerEmail = authentication.getName();
        log.info("GET /events/{}/registrations by {} (page={}, size={})",
                eventId, organizerEmail, page, size);
        
        Page<RegistrationDto> registrations = registrationService.getEventRegistrations(
                eventId, organizerEmail, page, size);
        
        return ResponseEntity.ok(registrations);
    }

    /**
     * Update registration status (Approve/Reject/Complete)
     * PATCH /registrations/{registrationId}/status
     * Body: {"status": "APPROVED|REJECTED|COMPLETED"}
     * Role: EVENT_ORGANIZER, ADMIN
     */
    @PatchMapping("/registrations/{registrationId}/status")
    @PreAuthorize("hasAnyRole('EVENT_ORGANIZER')")
    public ResponseEntity<RegistrationDto> updateRegistrationStatus(
            @PathVariable Long registrationId,
            @Valid @RequestBody RegistrationStatusRequest request,
            Authentication authentication) {
        
        String organizerEmail = authentication.getName();
        log.info("PATCH /registrations/{}/status to {} by {}",
                registrationId, request.getStatus(), organizerEmail);
        
        RegistrationDto updated = registrationService.updateRegistrationStatus(
                registrationId, request, organizerEmail);
        
        return ResponseEntity.ok(updated);
    }
}
