package com.example.backend.exception;

public class EventFullException extends RuntimeException {
    public EventFullException(String message) {
        super(message);
    }

    public EventFullException() {
        super("Sự kiện đã đủ số lượng tình nguyện viên");
    }
}
