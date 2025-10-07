package org.example.auth.dto;
import lombok.*;

@Getter @Setter @AllArgsConstructor
public class AuthResponse {
    private String message;
    private UserView user;
}