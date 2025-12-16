package com.example.backend.service;

import com.example.backend.dto.StatisticsDto;
import com.example.backend.entity.Event;
import com.example.backend.entity.User;
import com.example.backend.repo.EventRepository;
import com.example.backend.repo.PostRepository;
import com.example.backend.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    /**
     * Get platform statistics (public)
     * GET /api/statistics
     */
    @Transactional(readOnly = true)
    public StatisticsDto getStatistics() {
        log.info("Getting platform statistics");

        // Count approved events (COMING, ONGOING, FINISHED)
        Long totalEvents = eventRepository.countByStatusIn(
                new Event.EventStatus[]{Event.EventStatus.COMING, Event.EventStatus.ONGOING, Event.EventStatus.FINISHED}
        );

        // Count volunteers and organizers (not locked)
        Long totalVolunteers = userRepository.countByRoleInAndIsLockedFalse(
                new User.Role[]{User.Role.VOLUNTEER, User.Role.EVENT_ORGANIZER}
        );

        // Count posts from approved events
        Long totalPosts = postRepository.countByEventStatusIn(
                new Event.EventStatus[]{Event.EventStatus.COMING, Event.EventStatus.ONGOING, Event.EventStatus.FINISHED}
        );

        log.info("Statistics - Events: {}, Volunteers: {}, Posts: {}", 
                totalEvents, totalVolunteers, totalPosts);

        return StatisticsDto.builder()
                .totalEvents(totalEvents)
                .totalVolunteers(totalVolunteers)
                .totalPosts(totalPosts)
                .build();
    }
}
