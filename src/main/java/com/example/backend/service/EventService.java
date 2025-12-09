package com.example.backend.service;

import com.example.backend.dto.EventDto;
import com.example.backend.entity.Event;
import com.example.backend.repo.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Transactional(readOnly = true)
    public Page<EventDto> getEvents(String keyword, String location, String start, int page, String sortBy) {
        int size = 20; // default page size or 24
        Sort sort = parseSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        LocalDateTime startAt = parseDate(start);

        Page<Event> result = eventRepository.searchEvents(keyword, location, startAt, pageable);
        return result.map(event -> {
            EventDto dto = new EventDto();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setLocation(event.getLocation());
            dto.setThumbnail(event.getThumbnail());
            dto.setNoOfVolunteer(event.getNoOfVolunteer());
            dto.setRemaining(event.getRemaining());
            dto.setStartTime(event.getStartTime());
            dto.setDuration(event.getDuration());
            dto.setDescription(event.getDescription());
            dto.setStatus(event.getStatus().name());
            dto.setManagerName(event.getManager() != null ? event.getManager().getName() : null);
            dto.setManagerEmail(event.getManager() != null ? event.getManager().getEmail() : null);

            return dto;
        });
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
}