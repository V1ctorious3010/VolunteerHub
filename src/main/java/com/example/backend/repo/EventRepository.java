package com.example.backend.repo;

import com.example.backend.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("""
        SELECT e FROM Event e
        WHERE (:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:approvedAt IS NULL OR e.startTime >= :approvedAt)
          AND e.status IN ('COMING', 'ONGOING', 'FINISHED', 'CANCELLED')
    """)
    Page<Event> searchEvents(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("approvedAt") LocalDateTime approvedAt,
            Pageable pageable
    );

    // Find event by id and organizer email (for authorization)
    Optional<Event> findByIdAndOrganizerEmail(Long id, String organizerEmail);

    // Find events by organizer
    List<Event> findByOrganizerEmail(String organizerEmail);
    Page<Event> findByOrganizerEmailOrderByCreatedAtDesc(String organizerEmail, Pageable pageable);

    // Find my events with status filter
    @Query("""
        SELECT e FROM Event e
        WHERE e.organizer.email = :email
        AND (:status IS NULL OR e.status = :status)
        ORDER BY e.createdAt DESC
    """)
    Page<Event> findMyEvents(
            @Param("email") String email,
            @Param("status") Event.EventStatus status,
            Pageable pageable
    );

    // Find by status (for admin)
    Page<Event> findByStatusOrderByCreatedAtAsc(Event.EventStatus status, Pageable pageable);
    
    // For scheduler - auto update status
    List<Event> findByStatusAndStartTimeBefore(Event.EventStatus status, LocalDateTime time);
    List<Event> findByStatusAndEndTimeBefore(Event.EventStatus status, LocalDateTime time);
}