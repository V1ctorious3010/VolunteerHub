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
    public void send(String toEmail, String actorName, String type, String content, String url) {
        NotificationEventDTO dto = new NotificationEventDTO(toEmail, actorName, type, content, url);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, dto);
    }
}