package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventRequest {

    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    private String thumbnail;

    @Min(value = 1, message = "At least 1 volunteer is needed")
    @Max(value = 10000, message = "Maximum 10000 volunteers allowed")
    private Integer noOfVolunteer;

    @Future(message = "Start time must be in the future")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime startTime;

    @Pattern(regexp = "^\\d+h(\\d+m)?$|^\\d+m$", message = "Duration format must be like '2h30m' or '90m'")
    private String duration;

    @Size(min = 20, max = 5000, message = "Description must be between 20 and 5000 characters")
    private String description;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category; // Optional
}