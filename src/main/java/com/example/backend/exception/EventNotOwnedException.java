
package com.example.backend.exception;

public class EventNotOwnedException extends RuntimeException {
    public EventNotOwnedException(String message) {
        super(message);
    }

    public EventNotOwnedException() {
        super("You can only modify events that you created");
    }

    public EventNotOwnedException(Long eventId, String userEmail) {
        super("Event " + eventId + " does not belong to user " + userEmail);
    }
}