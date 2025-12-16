package com.example.backend.controller;

import com.example.backend.dto.StatisticsDto;
import com.example.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * Get platform statistics
     * GET /statistics
     * Auth: Public (no authentication required)
     */
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsDto> getStatistics() {
        log.info("GET /statistics");

        StatisticsDto statistics = statisticsService.getStatistics();
        return ResponseEntity.ok(statistics);
    }
}
