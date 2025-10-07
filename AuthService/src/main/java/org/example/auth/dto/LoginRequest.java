package org.example.auth.dto;
import lombok.*;

@Getter @Setter
public class LoginRequest {
    private String email;
    private String password;
}