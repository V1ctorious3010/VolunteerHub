package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDTO {
    private Long id;
    private String title;
    private String location;
    private String thumbnail;
    private Integer noOfVolunteer;
    private Integer remaining;
    private LocalDateTime startTime;
    private String duration;
    private String description;
    private String status;

    private String managerName;
}
