package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationEventDTO {
    private String recipientEmail; // Người nhận
    private String actorName;      // Người gửi
    private String type;
    private String content;
    private String targetUrl;
}