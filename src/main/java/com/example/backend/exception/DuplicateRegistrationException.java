package com.example.backend.exception;

public class DuplicateRegistrationException extends RuntimeException {
    public DuplicateRegistrationException(String message) {
        super(message);
    }

    public DuplicateRegistrationException() {
        super("You have already registered for this event");
    }
}
