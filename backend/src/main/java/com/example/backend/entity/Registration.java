package com.example.backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registration") // Bảng mới cho Request
@Data
public class Registration {

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED,
        COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Tải dữ liệu bài đăng khi cần
    @JoinColumn(name = "eventId", nullable = false) // Tên cột khóa ngoại trong DB
    private Event event;


    @ManyToOne(fetch = FetchType.LAZY) // Tải dữ liệu user khi cần
    @JoinColumn(name = "userEmail", nullable = false) // Tên cột khóa ngoại trong DB
    private User user;

    @Column(name = "createdAt")
    private LocalDateTime createdAt = LocalDateTime.now(); // Thời gian request

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING; // Trạng thái ban đầu là PENDING
}