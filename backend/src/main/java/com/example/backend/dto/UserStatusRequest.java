package com.example.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserStatusRequest {
    @Email(message = "Định dạng email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;
}