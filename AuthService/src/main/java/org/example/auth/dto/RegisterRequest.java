package org.example.auth.dto;
import org.example.auth.entity.User.Role;

import lombok.*;

@Getter @Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}