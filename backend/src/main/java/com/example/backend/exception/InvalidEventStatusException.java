package com.example.backend.exception;

public class InvalidEventStatusException extends RuntimeException {
    public InvalidEventStatusException(String message) {
        super(message);
    }

    public InvalidEventStatusException() {
        super("Trạng thái sự kiện không hợp lệ cho thao tác này");
    }
}
