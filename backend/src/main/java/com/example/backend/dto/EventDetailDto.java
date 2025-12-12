package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDetailDto {
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
    private String orgName;
    private String orgEmail;
    
    private String category;
    
//    private Integer totalRegistrations;
//    private Integer approvedCount;
    private Integer pendingCount;
//    private Integer rejectedCount;
//    private Integer completedCount;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime approvedAt;
}
