package com.example.backend.service;

import com.example.backend.config.RabbitMQConfig;
import com.example.backend.dto.NotificationEventDTO;
import com.example.backend.entity.Notification;
import com.example.backend.entity.PushSubscription;
import com.example.backend.entity.User;
import com.example.backend.repo.NotificationRepository;
import com.example.backend.repo.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.PushService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.repo.PushSubscriptionRepository;
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationRepository notiRepo;
    private final PushSubscriptionRepository subRepo;
    private final UserRepository userRepo;
    private final PushService pushService;
    private final ObjectMapper objectMapper;

    /**
     * Handle incoming notification messages from RabbitMQ
     * @param msg NotificationEventDTO message
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    @Transactional
    public void handleNotification(NotificationEventDTO msg) {
        User user = userRepo.getReferenceById(msg.getRecipientEmail());

        Notification entity = Notification.builder()
            .user(user)
            .actorName(msg.getActorName())
            .type(msg.getType())
            .content(msg.getContent())
            .isRead(false)
            .build();
        notiRepo.save(entity);

        sendWebPushToAllDevices(msg);
    }

    /**
     * Send web push notifications to all devices of the user
     * @param msg NotificationEventDTO message
     */
    private void sendWebPushToAllDevices(NotificationEventDTO msg) {
        List<PushSubscription> subs = subRepo.findByUserEmail(msg.getRecipientEmail());

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("title", "Thông báo mới");
        payload.put("body", msg.getActorName() + ": " + msg.getContent());
        payload.put("type", "UPDATE_UI");

        for (PushSubscription sub : subs) {
            try {
                nl.martijndwars.webpush.Notification pushNoti = new nl.martijndwars.webpush.Notification(
                    sub.getEndpoint(), sub.getP256dh(), sub.getAuth(),
                    objectMapper.writeValueAsBytes(payload)
                );
                pushService.send(pushNoti);
            } catch (Exception e) {
                if (e.getMessage().contains("410") || e.getMessage().contains("404")) {
                    subRepo.delete(sub);
                }
            }
        }
    }
}