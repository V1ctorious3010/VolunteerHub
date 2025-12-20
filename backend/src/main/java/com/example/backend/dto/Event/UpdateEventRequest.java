package com.example.backend.dto.Event;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventRequest {

    @Size(min = 5, max = 200, message = "Tiêu đề phải từ 5 đến 200 ký tự")
    private String title;

    @Size(max = 255, message = "Địa điểm không được vượt quá 255 ký tự")
    private String location;

    private String thumbnail;

    @Min(value = 1, message = "Cần ít nhất 1 tình nguyện viên")
    @Max(value = 10000, message = "Tối đa 10000 tình nguyện viên")
    private Integer noOfVolunteer;

    @Future(message = "Thời gian bắt đầu phải ở tương lai")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime startTime;

    @Future(message = "Thời gian kết thúc phải ở tương lai")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime endTime;

    @Size(min = 20, max = 5000, message = "Mô tả phải từ 20 đến 5000 ký tự")
    private String description;

    @Size(max = 100, message = "Danh mục không được vượt quá 100 ký tự")
    private String category; // Optional
}