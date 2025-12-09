package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.repo.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    /**
     * Lấy danh sách tất cả volunteer (không phân trang)
     */
    @Transactional(readOnly = true)
    public List<User> getAllVolunteers() {
        return userRepository.findAll();
    }

    /**
     * Lấy danh sách volunteer có phân trang
     */
    @Transactional(readOnly = true)
    public Page<User> getVolunteers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    /**
     * Ban user
     */
    @Transactional
    public void banUser(String email) {
        User v = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsAppException("The user was not found."));
        v.setLocked(true);
        userRepository.save(v);
    }


    @Transactional
    public void unbanUser(String email) {
        User v = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsAppException("The user was not found."));
        v.setLocked(false);
        userRepository.save(v);
    }
}
