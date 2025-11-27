package com.example.backend.dto;

import com.example.backend.entity.Volunteer.Role;

public class AuthResponse {
    private String message;
    private String name;
    private String email;
    private Role role;

    public AuthResponse(String message, String name, String email, Role role) {
        this.message = message;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }


}
