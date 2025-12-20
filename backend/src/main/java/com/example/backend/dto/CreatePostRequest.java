package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {

    @NotBlank(message = "Nội dung không được để trống")
    @Size(min = 1, max = 5000, message = "Nội dung phải từ 1 đến 5000 ký tự")
    private String content;

    @Pattern(regexp = "^https://.*", message = "Tệp đính kèm phải là URL HTTPS hợp lệ")
    private String attachment; // Optional Cloudinary URL
}
