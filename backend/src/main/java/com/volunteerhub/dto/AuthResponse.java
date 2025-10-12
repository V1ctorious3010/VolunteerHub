package com.volunteerhub.dto;

public class AuthResponse {
    
    private String token;
    private String refreshToken;
    private UserResponse user;
    private String message;
    
    public AuthResponse() {
    }
    
    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
        this.message = "Authentication successful";
    }

    public AuthResponse(String token, String refreshToken, UserResponse user, String message) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
        this.message = message;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}