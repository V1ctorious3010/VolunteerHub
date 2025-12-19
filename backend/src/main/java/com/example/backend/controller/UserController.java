package com.example.backend.controller;
import com.example.backend.dto.UserAvatarDTO;
import com.example.backend.dto.UserStatusRequest;
import com.example.backend.entity.User;
import com.example.backend.repo.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.service.CloudinaryService;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@EnableMethodSecurity
public class UserController {
    private final UserService userService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private UserRepository userRepository;

    /**
     * Get all volunteers
     * GET /user/users
     * Auth: Public
     */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllVolunteers();
    }

    /**
     * Ban a user account
     * POST /user/ban
     * Role: ADMIN
     */
    @PostMapping("/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> banUser(@RequestBody @Valid UserStatusRequest request) {

        userService.banUser(request.getEmail());

        return ResponseEntity.ok()
            .body(Map.of("message", "Đã cấm tài khoản " + request.getEmail()));
    }

    /**
     * Unban a user account
     * POST /user/unban
     * Role: ADMIN
     */
    @PostMapping("/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unbanUser(@RequestBody @Valid UserStatusRequest request) {
        userService.unbanUser(request.getEmail());
        return ResponseEntity.ok()
            .body(Map.of("message", "Đã bỏ cấm tài khoản: " + request.getEmail()));
    }

    /**
     * Get Cloudinary signature for direct upload
     * GET /user/signature
     * Auth: Any authenticated user
     */
    @GetMapping("/signature")
    public ResponseEntity<?> getSignature() {
        return ResponseEntity.ok(cloudinaryService.getSignature());
    }
    /**
     * Update user avatar
     * POST /user/avatar
     * Auth: Any authenticated user
     */
    @PostMapping("/avatar")
    public ResponseEntity<?> updateAvatar(@RequestBody UserAvatarDTO request) {

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (currentUserEmail == null) {
            return ResponseEntity.status(401).body("Bạn chưa đăng nhập!");
        }
        User user = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + currentUserEmail));

        user.setAvatar(request.getAvatarUrl());
        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật thành công cho email: " + currentUserEmail);
    }

}
