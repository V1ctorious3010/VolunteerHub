package com.example.backend.controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.Volunteer;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        AuthResponse resp = authService.register(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        Volunteer v = authService.loginAndGetUser(req);

        String accessToken = authService.generateAccessToken(v);
        String refreshToken = authService.generateRefreshToken(v);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")  // neu FE khac domain -> doi thanh "None"
            .path("/")
            .maxAge(Duration.ofMinutes(15))
            .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/auth")
            .maxAge(Duration.ofDays(14))
            .build();

        AuthResponse resp = new AuthResponse(
            "Đăng nhập thành công",
            v.getName(),
            v.getEmail()
        );

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(resp);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
        @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        String newAccessToken = authService.refreshAccessToken(refreshToken);

        ResponseCookie newAccessCookie = ResponseCookie.from("accessToken", newAccessToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofMinutes(15))
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, newAccessCookie.toString())
            .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/auth")
            .maxAge(0)
            .build();
        AuthResponse resp = new AuthResponse(
            "Đăng xuất thành công",
            null,
            null
        );
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(resp);
    }
}
