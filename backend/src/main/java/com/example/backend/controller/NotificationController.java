package com.example.backend.controller;

import com.example.backend.entity.Notification;
import com.example.backend.entity.PushSubscription;
import com.example.backend.repo.NotificationRepository;
import com.example.backend.repo.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notiRepo;
    private final PushSubscriptionRepository subRepo;

    /**
     * 1. ĐĂNG KÝ NHẬN WEB PUSH
     * Frontend gọi API này ngay sau khi người dùng bấm "Allow Notification"
     */
    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(
        @RequestBody PushSubscription subscriptionRequest) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        // Kiểm tra xem trình duyệt này đã đăng ký chưa
        if (!subRepo.existsByEndpoint(subscriptionRequest.getEndpoint())) {
            subscriptionRequest.setUserEmail(currentUserEmail);
            subRepo.save(subscriptionRequest);
            return ResponseEntity.ok("Subscribed successfully");
        }
        return ResponseEntity.ok("Already subscribed");
    }

    /**
     * 2. LẤY LỊCH SỬ THÔNG BÁO
     * Dùng để hiển thị danh sách trong cái chuông
     */
    @GetMapping("/all")
    public ResponseEntity<Page<Notification>> getNotifications(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Page<Notification> result = notiRepo.findByUser_EmailOrderByCreatedAtDesc(
            currentUserEmail,
            PageRequest.of(page, size)
        );

        return ResponseEntity.ok(result);
    }

    /**
     * 3. LẤY SỐ LƯỢNG CHƯA ĐỌC
     * Để hiện số đỏ trên icon chuông
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(notiRepo.countByUser_EmailAndIsReadFalse(currentUserEmail));
    }
    /**
     * 4. ĐÁNH DẤU ĐÃ ĐỌC (MỘT CÁI)
     * Khi user click vào 1 thông báo cụ thể
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
        @PathVariable Long id) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        notiRepo.findById(id).ifPresent(notification -> {
            if (notification.getUser().getEmail().equals(currentUserEmail)) {
                notification.setRead(true);
                notiRepo.save(notification);
            }
        });
        return ResponseEntity.ok().build();
    }

    /**
     * 5. HỦY ĐĂNG KÝ (UNSUBSCRIBE)
     * Khi user vào setting tắt thông báo hoặc logout
     */
    @PostMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestBody PushSubscription subscriptionRequest) {
        if (subRepo.existsByEndpoint(subscriptionRequest.getEndpoint())) {
            subRepo.deleteByEndpoint(subscriptionRequest.getEndpoint());
        }
        return ResponseEntity.ok().build();
    }
}