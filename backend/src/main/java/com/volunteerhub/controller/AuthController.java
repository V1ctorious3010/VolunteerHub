package com.volunteerhub.controller;

import com.volunteerhub.dto.AuthResponse;
import com.volunteerhub.dto.LoginRequest;
import com.volunteerhub.dto.RegisterRequest;
import com.volunteerhub.dto.UserResponse;
import com.volunteerhub.model.User;
import com.volunteerhub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);
            String token = authService.generateToken(user);
            
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setUser(convertToUserResponse(user));
            response.setMessage("User registered successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = authService.authenticate(request.getEmail(), request.getPassword());
            String token = authService.generateToken(user);
            
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setUser(convertToUserResponse(user));
            response.setMessage("Login successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        AuthResponse response = new AuthResponse();
        response.setMessage("Logout successful");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String email = authService.getEmailFromToken(token.replace("Bearer ", ""));
            User user = authService.findByEmail(email);
            return ResponseEntity.ok(convertToUserResponse(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        return response;
    }
}