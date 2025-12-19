package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for volunteer information in event report
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerReportDto {
    private String userEmail;
    private String name;
    private String email;
    private String avatar;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime registeredAt;
    
    private String status;
}
