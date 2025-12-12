package com.example.backend.dto;

import com.example.backend.entity.User.Role;

public class AuthResponse {
    private String message;
    private String name;
    private String email;
    private Role role;
    private String avatarUrl;

    public AuthResponse(String message, String name, String email, Role role, String avatarUrl) {
        this.message = message;
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl;
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
    public String getAvatarUrl() {
        return  avatarUrl;
    }
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }


}
