package com.example.backend.dto;

import lombok.Data;

@Data
public class VolunteerRequestDto {

    private Long id;
    private String postTitle;
    private String orgEmail;
    private String deadline;
    private String location;
    private String category;
    private String status;
}
