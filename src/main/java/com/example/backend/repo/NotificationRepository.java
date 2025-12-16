package com.example.backend.repo;

import com.example.backend.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Tìm thông báo theo Email user, sắp xếp mới nhất lên đầu
    // Complexity: O(log N + K) nhờ Index (user_email, created_at)
    Page<Notification> findByUser_EmailOrderByCreatedAtDesc(String email, Pageable pageable);

    // Đếm số thông báo chưa đọc (để hiển thị số trên quả chuông)
    long countByUser_EmailAndIsReadFalse(String email);

    // Đánh dấu tất cả là đã đọc (Optional)
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.email = :email")
    void markAllAsRead(String email);
}