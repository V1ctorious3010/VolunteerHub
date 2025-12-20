package com.example.backend.dto.Post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequest {

    @NotBlank(message = "Nội dung không được để trống")
    @Size(min = 1, max = 1000, message = "Nội dung phải từ 1 đến 1000 ký tự")
    private String content;

    @Pattern(regexp = "^https://.*", message = "Tệp đính kèm phải là URL HTTPS hợp lệ")
    private String attachment;
}
