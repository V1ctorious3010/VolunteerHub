package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "COMING|REJECTED", message = "Status must be either COMING or REJECTED")
    private String status;
}