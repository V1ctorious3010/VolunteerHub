package com.example.backend.exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(String message) {
        super(message);
    }

    public EventNotFoundException(Long eventId) {
        super("Không tìm thấy sự kiện với ID: " + eventId);
    }
}
