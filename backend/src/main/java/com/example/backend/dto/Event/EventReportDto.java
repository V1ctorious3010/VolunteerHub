package com.example.backend.dto.Event;

import com.example.backend.dto.VolunteerReportDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

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
