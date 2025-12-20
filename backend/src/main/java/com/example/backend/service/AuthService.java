package com.example.backend.service;

import com.example.backend.dto.User.LoginRequest;
import com.example.backend.dto.User.RegisterRequest;
import com.example.backend.entity.User;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.repo.UserRepository;
import com.example.backend.security.JwtService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationProducer notificationProducer;
    @Autowired
    private UserService userService;
    /**
     * Register a new user
     * @param req the registration request containing email, password, name, and role
     * @return the registered User entity
     * @throws BadCredentialsAppException if email already exists
     */
    @Transactional
    public User register(RegisterRequest req) {
        userRepository.findByEmail(req.getEmail())
            .ifPresent(v -> {
                throw new BadCredentialsAppException("Email đã được sử dụng.");
            });

        User v = new User();
        v.setEmail(req.getEmail());
        v.setPassword(passwordEncoder.encode(req.getPassword()));
        v.setName(req.getName());
        v.setRole(req.getRole());
        v.setLocked(false);
        User saved = userRepository.save(v);

        return saved;
    }

    /**
     * Login and return the User entity if successful
     * @param req the login request containing email and password
     * @return the User entity
     * @throws BadCredentialsAppException if email does not exist, password is incorrect, or account is locked
     */
    @Transactional(readOnly = true)
    public User loginAndGetUser(LoginRequest req) {
        User v = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new BadCredentialsAppException("Email không tồn tại."));
        if (!passwordEncoder.matches(req.getPassword(), v.getPassword())) {
            throw new BadCredentialsAppException("Mật khẩu không đúng.");
        }
        if (v.isLocked()) {
            throw new BadCredentialsAppException("Tài khoản đã bị cấm. Hãy liên hệ quản trị viên qua email \"admin@gmail.com\".");
        }
        return v;
    }

    /**
     * Generate access token for user
     */
    @Transactional(readOnly = true)
    public String generateAccessToken(User v) {
        return jwtService.generateAccessToken(v);
    }

    /**
     * Generate refresh token for user
     */
    @Transactional(readOnly = true)
    public String generateRefreshToken(User v) {
        return jwtService.generateRefreshToken(v);
    }

    /**
     * Refresh access token using refresh token
     * @param refreshToken the refresh token
     * @return a map containing the new access token and refresh token
     */
    @Transactional(readOnly = true)
    public Map<String, String> refreshAccessToken(String refreshToken) {
        User v = jwtService.validateRefreshAndLoadUser(refreshToken);
        if (v == null) {
            throw new BadCredentialsAppException("Không thể xác thực token làm mới.");
        }
        if (v.isLocked()) {
            throw new BadCredentialsAppException("Tài khoản đã bị cấm.");
        }
        String newAccess = jwtService.generateAccessToken(v);
        String newRefresh = jwtService.generateRefreshToken(v);
        return Map.of(
            "accessToken", newAccess,
            "refreshToken", newRefresh
        );
    }
}
