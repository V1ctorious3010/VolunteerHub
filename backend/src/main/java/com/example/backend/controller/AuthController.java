package com.example.backend.controller;

import com.example.backend.dto.User.AuthResponse;
import com.example.backend.dto.User.LoginRequest;
import com.example.backend.dto.User.RegisterRequest;
import com.example.backend.entity.User;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.repo.UserRepository;
import com.example.backend.service.AuthService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;

    /**
     * Create a secure HTTP-only cookie
     * @param name name of the cookie
     * @param value value of the cookie
     * @param path path where the cookie is valid
     * @param duration duration before the cookie expires
     * @return ResponseCookie
     */
    private ResponseCookie createCookie(String name, String value, String path, Duration duration) {
        return ResponseCookie.from(name, value)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path(path)                 // cookie valid for all endpoints under path
            .maxAge(duration)
            .build();
    }
    /**
     * Build authentication response with tokens in cookies
     * @param v authenticated user
     * @param message success message
     * @return ResponseEntity with AuthResponse body and cookies set
     */
    private ResponseEntity<AuthResponse> buildAuthResponse(User v, String message) {
        String accessToken = authService.generateAccessToken(v);
        String refreshToken = authService.generateRefreshToken(v);

        ResponseCookie accessCookie = createCookie(ACCESS_TOKEN_COOKIE, accessToken, "/", Duration.ofMinutes(15));
        ResponseCookie refreshCookie = createCookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_PATH, Duration.ofDays(14));

        AuthResponse resp = new AuthResponse(message, v.getName(), v.getEmail(), v.getRole(), v.getAvatar());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(resp);
    }

    /**
     * Login endpoint
     * @param req  login request body
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Validated LoginRequest req) {
        User v = authService.loginAndGetUser(req);
        return buildAuthResponse(v, "Bạn đã đăng nhập thành công.");
    }

    /**
     * Register endpoint
     * @param req register request body
     * @return
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Validated RegisterRequest req) {
        User v = authService.register(req);
        return buildAuthResponse(v, "Bạn đã đăng ký thành công và sẽ được đăng nhập ngay bây giờ.");
    }

    /**
     * Refresh access token using refresh token from cookies
     * @param refreshToken refresh token from cookies
     * @return ResponseEntity with new tokens in cookies
     */
    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
        @CookieValue(name = "refreshToken", required = false) String refreshToken // auto find refresh token from request cookies
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new BadCredentialsAppException("Không tìm thấy refresh token.");
        }

        Map<String, String> tokens = authService.refreshAccessToken(refreshToken);
        ResponseCookie newAccessCookie = createCookie("accessToken", tokens.get("accessToken"), "/", Duration.ofMinutes(15));
        ResponseCookie newRefreshCookie = createCookie("refreshToken", tokens.get("refreshToken"), "/auth", Duration.ofDays(14));

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, newAccessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, newRefreshCookie.toString())
            .build();
    }

    /**
     * Logout endpoint - clear the authentication cookies
     * @return ResponseEntity with cleared cookies
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        ResponseCookie accessCookie = createCookie("accessToken", "", "/", Duration.ZERO);
        ResponseCookie refreshCookie = createCookie("refreshToken", "", "/auth", Duration.ZERO);
        AuthResponse resp = new AuthResponse(
            "Bạn đã đăng xuất thành công.",
            null,
            null, null, null
        );
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(resp);
    }

    /**
     * Get current authenticated user's info
     * @param accessToken access token from cookies
     * @return AuthResponse with user info
     */
    @GetMapping("/me")
    public AuthResponse me(
        @CookieValue(name = ACCESS_TOKEN_COOKIE, required = false) String accessToken
    ) {
        if (accessToken == null || accessToken.isBlank()) {
            throw new BadCredentialsAppException("Không tìm thấy access token.");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User u = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsAppException("Không tìm thấy người dùng."));
        return new AuthResponse("INFO", u.getName(), u.getEmail(), u.getRole(), u.getAvatar());
    }
}
