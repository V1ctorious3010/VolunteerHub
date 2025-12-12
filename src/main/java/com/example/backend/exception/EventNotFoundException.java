package com.example.backend.exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(String message) {
        super(message);
    }

    public EventNotFoundException(Long eventId) {
        super("Event not found with id: " + eventId);
    }
}
