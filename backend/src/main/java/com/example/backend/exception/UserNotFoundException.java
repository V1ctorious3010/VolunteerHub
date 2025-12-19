package com.example.backend.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        super("Không tìm thấy người dùng với email: " + email);
    }
}
