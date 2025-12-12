package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDto {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private String eventThumbnail;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime eventStartTime;
    
    private String userName;
    private String userEmail;
    private String userAvatar;
    
    private String status; // PENDING, APPROVED, REJECTED, COMPLETED
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime createdAt;
}


