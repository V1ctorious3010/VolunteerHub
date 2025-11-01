package com.example.backend.repo;


import com.example.backend.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // API: get-volunteer-request/:email (Lấy các request đã đăng ký)
    List<Registration> findByUserEmail(String email);
}
