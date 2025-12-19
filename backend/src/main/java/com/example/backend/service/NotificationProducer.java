package com.example.backend.service;

import com.example.backend.config.RabbitMQConfig;
import com.example.backend.dto.NotificationEventDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducer {
    private final RabbitTemplate rabbitTemplate;
    /**
     * Send notification message to RabbitMQ
     * @param toEmail recipient's email
     * @param actorName name of the actor triggering the notification
     * @param type type of notification
     * @param content content of the notification
     */
    public void send(String toEmail, String actorName, String type, String content) {
        NotificationEventDTO dto = new NotificationEventDTO(toEmail, actorName, type, content);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, dto);
    }
}