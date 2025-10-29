package com.example.backend.repo;


import com.example.backend.entity.VolunteerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VolunteerRequestRepository extends JpaRepository<VolunteerRequest, Long> {

    // API: get-volunteer-request/:email (Lấy các request đã đăng ký)
    List<VolunteerRequest> findByVolunteerEmail(String email);
}