package com.example.backend.exception;

public class EventCannotBeModifiedException extends RuntimeException {
    public EventCannotBeModifiedException(String message) {
        super(message);
    }

    public EventCannotBeModifiedException() {
        super("Không thể chỉnh sửa sự kiện ở trạng thái hiện tại");
    }

}