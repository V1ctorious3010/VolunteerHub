package com.example.backend.dto;

import lombok.Data;

@Data
public class VolunteerRequestDto {

    private Long id;              // ID của VolunteerRequest (cho hành động Hủy)
    private String postTitle;     // Từ VolunteerPost
    private String orgEmail;      // Từ VolunteerPost
    private String deadline;      // Từ VolunteerPost
    private String location;      // Từ VolunteerPost
    private String category;      // Từ VolunteerPost
    private String status; // Từ VolunteerRequest
}
