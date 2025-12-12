package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for volunteer to view their own registrations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyRegistrationDto {
    private Long registrationId;
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private String eventThumbnail;
    private String eventDuration;
    private String eventStatus; // COMING, ONGOING, FINISHED, CANCELLED
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime eventStartTime;
    
    private String organizerName;
    private String organizerEmail;
    
    private String registrationStatus; // PENDING, APPROVED, REJECTED, COMPLETED
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime registeredAt;
}

