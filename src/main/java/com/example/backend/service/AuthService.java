package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.Volunteer;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.repo.VolunteerRepository;
import com.example.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.webauthn.api.AuthenticatorResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

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
    @Transactional
    public AuthResponse login(@RequestBody LoginRequest req) {
        Volunteer v = volunteerRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new BadCredentialsAppException("Email không tồn tại hoặc sai"));

        if (!passwordEncoder.matches(req.getPassword(), v.getPassword())) {
            throw new BadCredentialsAppException("Mật khẩu không đúng");
        }
        return new AuthResponse("Đăng nhập thành công", v.getName(), v.getEmail());
    }
}