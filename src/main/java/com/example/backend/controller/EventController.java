package com.example.backend.controller;

import com.example.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController// Đánh dấu lớp này là một REST controller
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/events")
    public ResponseEntity<?> getEvents(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(defaultValue = "") String start,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "startTime,asc") String sortBy
    ) {

        // call service and return result (Page<Event>)
        return ResponseEntity.ok(eventService.getEvents(keyword, location, start, page, sortBy).getContent());
    }
}