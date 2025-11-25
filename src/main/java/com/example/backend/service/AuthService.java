package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.Volunteer;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.repo.VolunteerRepository;
import com.example.backend.security.JwtService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        volunteerRepository.findByEmail(req.getEmail())
            .ifPresent(v -> {
                throw new BadCredentialsAppException("Email đã tồn tại");
            });

        Volunteer v = new Volunteer();
        v.setEmail(req.getEmail());
        v.setPassword(passwordEncoder.encode(req.getPassword()));
        v.setName(req.getName());
        v.setRole(req.getRole());
        Volunteer saved = volunteerRepository.save(v);

        return new AuthResponse("Đăng kí tài khoản thành công", saved.getName(), saved.getEmail());
    }

    @Transactional(readOnly = true)
    public Volunteer loginAndGetUser(LoginRequest req) {
        Volunteer v = volunteerRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new BadCredentialsAppException("Email không tồn tại hoặc sai"));
        if (!passwordEncoder.matches(req.getPassword(), v.getPassword())) {
            throw new BadCredentialsAppException("Mật khẩu không đúng");
        }
        return v;
    }

    @Transactional(readOnly = true)
    public String generateAccessToken(Volunteer v) {
        return jwtService.generateAccessToken(v);
    }

    @Transactional(readOnly = true)
    public String generateRefreshToken(Volunteer v) {
        return jwtService.generateRefreshToken(v);
    }

    /**
     * Nhận refreshToken, validate, trả về accessToken mới
     */
    @Transactional(readOnly = true)
    public Map<String, String> refreshAccessToken(String refreshToken) {
        Volunteer v = jwtService.validateRefreshAndLoadUser(refreshToken);
        if (v == null) {
            throw new BadCredentialsAppException("Refresh token không hợp lệ hoặc đã hết hạn");
        }
        String newAccess = jwtService.generateAccessToken(v);
        String newRefresh = jwtService.generateRefreshToken(v);
        return Map.of(
            "accessToken", newAccess,
            "refreshToken", newRefresh
        );
    }
}
