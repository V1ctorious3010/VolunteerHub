package com.example.backend.exception;

public class EventCannotBeModifiedException extends RuntimeException {
    public EventCannotBeModifiedException(String message) {
        super(message);
    }

    public EventCannotBeModifiedException() {
        super("This event cannot be modified in its current state");
    }

}