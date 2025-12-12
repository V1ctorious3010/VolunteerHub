package com.example.backend.api;

import com.example.backend.exception.BadCredentialsAppException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsAppException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsAppException ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.UNAUTHORIZED.value());
        err.setError(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }

    @ExceptionHandler(com.example.backend.exception.EventNotFoundException.class)
    public ResponseEntity<ApiError> handleEventNotFound(com.example.backend.exception.EventNotFoundException ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.NOT_FOUND.value());
        err.setError("Event Not Found");
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }

    @ExceptionHandler(com.example.backend.exception.RegistrationNotFoundException.class)
    public ResponseEntity<ApiError> handleRegistrationNotFound(com.example.backend.exception.RegistrationNotFoundException ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.NOT_FOUND.value());
        err.setError("Registration Not Found");
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }

    @ExceptionHandler(com.example.backend.exception.DuplicateRegistrationException.class)
    public ResponseEntity<ApiError> handleDuplicateRegistration(com.example.backend.exception.DuplicateRegistrationException ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.CONFLICT.value());
        err.setError("Duplicate Registration");
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
    }

    @ExceptionHandler(com.example.backend.exception.EventFullException.class)
    public ResponseEntity<ApiError> handleEventFull(com.example.backend.exception.EventFullException ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.CONFLICT.value());
        err.setError("Event Full");
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
    }

    @ExceptionHandler(com.example.backend.exception.UnauthorizedAccessException.class)
    public ResponseEntity<ApiError> handleUnauthorizedAccess(com.example.backend.exception.UnauthorizedAccessException ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.FORBIDDEN.value());
        err.setError("Forbidden");
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
    }

    @ExceptionHandler(com.example.backend.exception.InvalidEventStatusException.class)
    public ResponseEntity<ApiError> handleInvalidEventStatus(com.example.backend.exception.InvalidEventStatusException ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError("Invalid Event Status");
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(org.springframework.web.bind.MethodArgumentNotValidException ex,
        HttpServletRequest req) {
        java.util.Map<String, String> errors = new java.util.HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((org.springframework.validation.FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError("Validation Failed");
        err.setMessage("Input validation failed: " + errors.toString());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex,
        HttpServletRequest req) {
        ApiError err = new ApiError();
        err.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        err.setError("Internal Server Error");
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
    }

}