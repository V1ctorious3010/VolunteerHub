package com.example.backend.repo;

import com.example.backend.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;


public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("""
        SELECT e FROM Event e
        WHERE (:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:startAt IS NULL OR e.startTime >= :startAt)
    """)
    Page<Event> searchEvents(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("startAt") LocalDateTime startAt,
            Pageable pageable
    );
}

