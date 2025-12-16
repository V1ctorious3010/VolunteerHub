package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userEmail", referencedColumnName = "Email")
    private User user;

    @Column(name = "actor_name")
    private String actorName;

    private String type;
    private String content;
    private String targetUrl;

    @Column(name = "is_read")
    private boolean isRead = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}