package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;

/**
 * DTO for event report with volunteer statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventReportDto {
    private Long totalRegistrations;
    private Long approvedCount;
    private Long completedCount;
    private Long pendingCount;
    private Long rejectedCount;
    private Page<VolunteerReportDto> volunteers;
}
