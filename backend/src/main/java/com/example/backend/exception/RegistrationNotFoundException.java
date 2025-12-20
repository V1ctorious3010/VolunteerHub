package com.example.backend.exception;

public class RegistrationNotFoundException extends RuntimeException {
    public RegistrationNotFoundException(String message) {
        super(message);
    }

    public RegistrationNotFoundException(Long registrationId) {
        super("Đăng ký không tồn tại với ID: " + registrationId);
    }
}
