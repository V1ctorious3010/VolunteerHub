package com.example.backend.repo;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// update: đổi tên thành UserRepository
public interface UserRepository extends JpaRepository<User, Long> {

    // Phương thức tìm kiếm Tình nguyện viên theo Email
    Optional<User> findByEmail(String email);

}