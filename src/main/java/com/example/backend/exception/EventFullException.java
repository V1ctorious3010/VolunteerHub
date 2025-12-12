package com.example.backend.exception;

public class EventFullException extends RuntimeException {
    public EventFullException(String message) {
        super(message);
    }

    public EventFullException() {
        super("This event has reached maximum capacity");
    }
}
