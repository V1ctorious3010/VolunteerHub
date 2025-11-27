package com.example.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserStatusRequest {
    @Email(message = "Must be a valid email format.")
    @NotBlank(message = "Email must not be empty.")
    private String email;
}