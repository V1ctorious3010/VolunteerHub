package com.example.backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_request") // Bảng mới cho Request
@Data
public class VolunteerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // THAY THẾ: postId (Long) bằng Entity VolunteerPost
    // Many-to-One tới Bài đăng
    @ManyToOne(fetch = FetchType.LAZY) // Tải dữ liệu bài đăng khi cần
    @JoinColumn(name = "postId", nullable = false) // Tên cột khóa ngoại trong DB
    @JsonIgnore
    private VolunteerPost volunteerPost;

    // THAY THẾ: volunteerEmail (String) bằng Entity AppUser
    // Many-to-One tới Người dùng/Tình nguyện viên
    // Giả sử tên Entity User của bạn là AppUser
    @ManyToOne(fetch = FetchType.LAZY) // Tải dữ liệu user khi cần
    @JoinColumn(name = "volunteerEmail", nullable = false) // Tên cột khóa ngoại trong DB
    @JsonIgnore
    private Volunteer volunteer;

    @Column(name = "requestDate")
    private LocalDateTime requestDate = LocalDateTime.now(); // Thời gian request

    @Column(name = "suggestion")
    private String suggestion; // Gợi ý hoặc lời nhắn từ tình nguyện viên

    @Column(name = "status")
    private String status = "Pending"; // Trạng thái của request (Pending, Approved, Rejected)
}