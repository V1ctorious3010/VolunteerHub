package com.example.backend.service;

import com.example.backend.entity.Volunteer;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.repo.VolunteerRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final VolunteerRepository volunteerRepository;
    /**
     * Lấy danh sách tất cả volunteer (không phân trang)
     */
    @Transactional(readOnly = true)
    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    /**
     * Lấy danh sách volunteer có phân trang
     */
    @Transactional(readOnly = true)
    public Page<Volunteer> getVolunteers(Pageable pageable) {
        return volunteerRepository.findAll(pageable);
    }

    /**
     * Ban user
     */
    @Transactional
    public void banUser(String email) {
        Volunteer v = volunteerRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsAppException("Không tìm thấy người dùng"));
        v.setLocked(true);
        volunteerRepository.save(v);
    }


    @Transactional
    public void unbanUser(String email) {
        Volunteer v = volunteerRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsAppException("Không tìm thấy người dùng"));
        v.setLocked(false);
        volunteerRepository.save(v);
    }
}
