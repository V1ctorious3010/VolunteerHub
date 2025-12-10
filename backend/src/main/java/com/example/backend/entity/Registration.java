package com.example.backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registration") // Bảng mới cho Request
@Data
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One tới Bài đăng
    @ManyToOne(fetch = FetchType.LAZY) // Tải dữ liệu bài đăng khi cần
    @JoinColumn(name = "eventId", nullable = false) // Tên cột khóa ngoại trong DB
    @JsonIgnore
    private Event event;

    // THAY THẾ: volunteerEmail (String) bằng Entity AppUser
    // Many-to-One tới Người dùng/Tình nguyện viên
    // Giả sử tên Entity User của bạn là AppUser
    @ManyToOne(fetch = FetchType.LAZY) // Tải dữ liệu user khi cần
    @JoinColumn(name = "userEmail", nullable = false) // Tên cột khóa ngoại trong DB
    @JsonIgnore
    private User user;

    @Column(name = "createdAt")
    private LocalDateTime createdAt = LocalDateTime.now(); // Thời gian request

    @Column(name = "status")
    private String status = "Pending"; // Trạng thái của request (Pending, Approved, Rejected)
}