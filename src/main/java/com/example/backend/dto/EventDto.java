package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDto {
    private Long id;
    private String title;
    private String location;
    private String thumbnail;
    private Integer noOfVolunteer;
    private Integer remaining;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime startTime;
    private String duration;
    private String description;
    private String status;
    private String orgEmail;
    private String orgName;
    private String category;
}