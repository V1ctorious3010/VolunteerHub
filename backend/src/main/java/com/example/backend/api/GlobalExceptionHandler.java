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

}