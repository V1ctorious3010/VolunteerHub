package com.example.backend.dto.Event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventStatusRequest {

    @NotBlank(message = "Trạng thái không được để trống")
    @Pattern(regexp = "COMING|REJECTED", message = "Trạng thái phải là COMING hoặc REJECTED")
    private String status;
}