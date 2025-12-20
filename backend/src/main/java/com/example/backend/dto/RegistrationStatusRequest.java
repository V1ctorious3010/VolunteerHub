package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationStatusRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private String status; // APPROVED, REJECTED, COMPLETED
}
