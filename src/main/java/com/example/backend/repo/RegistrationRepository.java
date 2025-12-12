package com.example.backend.repo;

import com.example.backend.entity.Registration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Find registration by event and user
    Optional<Registration> findByEventIdAndUserEmail(Long eventId, String userEmail);
    
    // Check if user already registered for event
    boolean existsByEventIdAndUserEmail(Long eventId, String userEmail);
    
    // Get all registrations for an event
    Page<Registration> findByEventId(Long eventId, Pageable pageable);
    
    // Get all registrations for an event (no pagination)
    List<Registration> findByEventId(Long eventId);
    
    // Get all registrations for a user with pagination and filtering
    @Query("""
        SELECT r FROM Registration r
        WHERE r.user.email = :userEmail
        AND (:status IS NULL OR r.status = :status)
        ORDER BY r.createdAt DESC
    """)
    Page<Registration> findByUserEmailAndStatus(
        @Param("userEmail") String userEmail,
        @Param("status") Registration.RequestStatus status,
        Pageable pageable
    );
    
    // Get all registrations for a user (simple version)
    List<Registration> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    
    // Count registrations by event and status
    long countByEventIdAndStatus(Long eventId, Registration.RequestStatus status);
    
    // Find registration by id and user email (for authorization check)
    Optional<Registration> findByIdAndUserEmail(Long id, String userEmail);
    
    // Find registrations for events organized by specific user
    @Query("""
        SELECT r FROM Registration r
        WHERE r.event.organizer.email = :organizerEmail
        AND r.event.id = :eventId
    """)
    Page<Registration> findByEventIdAndOrganizerEmail(
        @Param("eventId") Long eventId,
        @Param("organizerEmail") String organizerEmail,
        Pageable pageable
    );
}
