package com.example.backend.exception;

public class RegistrationNotFoundException extends RuntimeException {
    public RegistrationNotFoundException(String message) {
        super(message);
    }

    public RegistrationNotFoundException(Long registrationId) {
        super("Registration not found with id: " + registrationId);
    }
}
