package com.example.backend.repo;

import com.example.backend.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    // Phương thức tìm kiếm Tình nguyện viên theo Email
    Optional<Volunteer> findByVolunteerEmail(String volunteerEmail);

}