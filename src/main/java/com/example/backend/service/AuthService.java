package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
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

    @Transactional
    public User register(RegisterRequest req) {
        userRepository.findByEmail(req.getEmail())
            .ifPresent(v -> {
                throw new BadCredentialsAppException("This email already exists.");
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

    @Transactional(readOnly = true)
    public User loginAndGetUser(LoginRequest req) {
        User v = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new BadCredentialsAppException("Email does not exist or is incorrect."));
        if (!passwordEncoder.matches(req.getPassword(), v.getPassword())) {
            throw new BadCredentialsAppException("The password is incorrect.");
        }
        if (v.isLocked()) {
            throw new BadCredentialsAppException("This account has been locked.");
        }
        return v;
    }

    @Transactional(readOnly = true)
    public String generateAccessToken(User v) {
        return jwtService.generateAccessToken(v);
    }

    @Transactional(readOnly = true)
    public String generateRefreshToken(User v) {
        return jwtService.generateRefreshToken(v);
    }

    /**
     * Nhận refreshToken, validate, trả về accessToken mới
     */
    @Transactional(readOnly = true)
    public Map<String, String> refreshAccessToken(String refreshToken) {
        User v = jwtService.validateRefreshAndLoadUser(refreshToken);
        if (v == null) {
            throw new BadCredentialsAppException("The refresh token is invalid or has expired.");
        }
        if (v.isLocked()) {
            throw new BadCredentialsAppException("This account has been locked.");
        }
        String newAccess = jwtService.generateAccessToken(v);
        String newRefresh = jwtService.generateRefreshToken(v);
        return Map.of(
            "accessToken", newAccess,
            "refreshToken", newRefresh
        );
    }
}
