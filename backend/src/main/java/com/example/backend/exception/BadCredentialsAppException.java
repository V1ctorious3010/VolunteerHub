package com.example.backend.exception;

public class BadCredentialsAppException extends RuntimeException {
    public BadCredentialsAppException(String message) { super(message); }
    public BadCredentialsAppException(String message, Throwable cause) { super(message, cause); }
}
