package com.example.backend.controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.Volunteer;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.service.AuthService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private static final String ACCESS_TOKEN_COOKIE = "accessToken";
    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    private static final String REFRESH_PATH = "/auth";

    private ResponseCookie createCookie(String name, String value, String path, Duration duration) {
        return ResponseCookie.from(name, value)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path(path)                 // cookie valid for all endpoints under path
            .maxAge(duration)
            .build();
    }
    private ResponseEntity<AuthResponse> buildAuthResponse(Volunteer v, String message) {
        String accessToken = authService.generateAccessToken(v);
        String refreshToken = authService.generateRefreshToken(v);

        ResponseCookie accessCookie = createCookie(ACCESS_TOKEN_COOKIE, accessToken, "/", Duration.ofMinutes(15));
        ResponseCookie refreshCookie = createCookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_PATH, Duration.ofDays(14));

        AuthResponse resp = new AuthResponse(message, v.getName(), v.getEmail(), v.getRole());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Validated LoginRequest req) {
        Volunteer v = authService.loginAndGetUser(req);
        return buildAuthResponse(v, "You have logged in successfully.");
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Validated RegisterRequest req) {
        Volunteer v = authService.register(req);
        return buildAuthResponse(v, "You have registered successfully and have been logged in automatically.");
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
        @CookieValue(name = "refreshToken", required = false) String refreshToken // auto find refresh token from request cookies
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new BadCredentialsAppException("Refresh token is missing or empty.");
        }

        Map<String, String> tokens = authService.refreshAccessToken(refreshToken);
        ResponseCookie newAccessCookie = createCookie("accessToken", tokens.get("accessToken"), "/", Duration.ofMinutes(15));
        ResponseCookie newRefreshCookie = createCookie("refreshToken", tokens.get("refreshToken"), "/auth", Duration.ofDays(14));

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, newAccessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, newRefreshCookie.toString())
            .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        ResponseCookie accessCookie = createCookie("accessToken", "", "/", Duration.ZERO);
        ResponseCookie refreshCookie = createCookie("refreshToken", "", "/auth", Duration.ZERO);
        AuthResponse resp = new AuthResponse(
            "You have logged out successfully.",
            null,
            null, null
        );
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(resp);
    }
}
