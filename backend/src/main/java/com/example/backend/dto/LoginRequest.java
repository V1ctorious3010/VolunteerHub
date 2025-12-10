package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @Email(message = "Must be a valid email format.")
    @NotBlank(message = "Email must not be empty.")
    private String email;

    public LoginRequest(String password, String email) {
        this.password = password;
        this.email = email;
    }

    @NotBlank(message = "Password must not be empty.")
    private String password;

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
