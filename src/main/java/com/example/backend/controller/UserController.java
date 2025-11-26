package com.example.backend.controller;
import com.example.backend.dto.UserStatusRequest;
import com.example.backend.entity.Volunteer;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@EnableMethodSecurity
public class UserController {
    private final UserService userService;

    @GetMapping("/users")
    public List<Volunteer> getAllUsers() {
        return userService.getAllVolunteers();
    }

    @PostMapping("/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> banUser(@RequestBody @Valid UserStatusRequest request) {

        userService.banUser(request.getEmail());

        return ResponseEntity.ok()
            .body(Map.of("message", "Đã khóa tài khoản " + request.getEmail()));
    }

    @PostMapping("/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unbanUser(@RequestBody @Valid UserStatusRequest request) {
        userService.unbanUser(request.getEmail());
        return ResponseEntity.ok()
            .body(Map.of("message", "Đã mở khóa tài khoản " + request.getEmail()));
    }

}
