package com.example.backend.exception;

public class InvalidEventStatusException extends RuntimeException {
    public InvalidEventStatusException(String message) {
        super(message);
    }

    public InvalidEventStatusException() {
        super("Invalid event status for this operation");
    }
}
