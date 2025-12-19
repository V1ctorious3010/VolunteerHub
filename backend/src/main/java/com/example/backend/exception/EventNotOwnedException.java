
package com.example.backend.exception;

public class EventNotOwnedException extends RuntimeException {
    public EventNotOwnedException(String message) {
        super(message);
    }

    public EventNotOwnedException() {
        super("Bạn chỉ có thể chỉnh sửa sự kiện do bạn tạo");
    }

    public EventNotOwnedException(Long eventId, String userEmail) {
        super("Sự kiện " + eventId + " không thuộc về người dùng " + userEmail);
    }
}