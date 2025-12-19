package com.example.backend.exception;

public class DuplicateRegistrationException extends RuntimeException {
    public DuplicateRegistrationException(String message) {
        super(message);
    }

    public DuplicateRegistrationException() {
        super("Bạn đã đăng ký sự kiện này rồi");
    }
}
