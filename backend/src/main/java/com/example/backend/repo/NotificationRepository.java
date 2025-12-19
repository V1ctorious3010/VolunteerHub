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

    /**
     * Get notifications for a specific user, ordered by creation date descending
     * @param email email of the user
     * @param pageable pagination information
     * @return paginated notifications
     */
    Page<Notification> findByUser_EmailOrderByCreatedAtDesc(String email, Pageable pageable);

    /**
     * Count unread notifications for a specific user
     * @param email email of the user
     * @return count of unread notifications
     */
    long countByUser_EmailAndIsReadFalse(String email);

    /**
     * Mark all notifications as read for a specific user
     * @param email email of the user
     */
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.email = :email")
    void markAllAsRead(String email);
}