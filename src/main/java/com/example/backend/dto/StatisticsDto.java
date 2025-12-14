package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDto {
    private Long totalEvents;      // COMING + ONGOING + FINISHED
    private Long totalVolunteers;  // VOLUNTEER + EVENT_ORGANIZER (not locked)
    private Long totalPosts;       // Posts from approved events
}
