package com.example.backend.scheduler;

import com.example.backend.entity.Event;
import com.example.backend.repo.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventStatusScheduler {
    
    private final EventRepository eventRepository;
    
    /**
     * Auto update event status every 5 minutes
     * PENDING -> REJECTED (when startTime passed without approval)
     * COMING -> ONGOING (when now >= startTime)
     * ONGOING -> FINISHED (when now >= endTime)
     */
    @Scheduled(cron = "0 */5 * * * *") // 5m
    @Transactional
    public void autoUpdateEventStatus() {
        LocalDateTime now = LocalDateTime.now();
        
        List<Event> expiredPending = eventRepository
                .findByStatusAndStartTimeBefore(Event.EventStatus.PENDING, now);
        
        int rejectedCount = 0;
        for (Event event : expiredPending) {
            event.setStatus(Event.EventStatus.REJECTED);
            rejectedCount++;
            log.warn("Auto-rejected expired pending event {} (startTime: {})", 
                    event.getId(), event.getStartTime());
        }
        
        if (rejectedCount > 0) {
            eventRepository.saveAll(expiredPending);
            log.info("Auto-rejected {} expired pending events", rejectedCount);
        }
        
        List<Event> eventsToStart = eventRepository
                .findByStatusAndStartTimeBefore(Event.EventStatus.COMING, now);
        
        int startedCount = 0;
        for (Event event : eventsToStart) {
            event.setStatus(Event.EventStatus.ONGOING);
            startedCount++;
            log.info("Auto-updated event {} from COMING to ONGOING", event.getId());
        }
        
        if (startedCount > 0) {
            eventRepository.saveAll(eventsToStart);
            log.info("Auto-started {} events to ONGOING status", startedCount);
        }
        
        List<Event> eventsToFinish = eventRepository
                .findByStatusAndEndTimeBefore(Event.EventStatus.ONGOING, now);
        
        int finishedCount = 0;
        for (Event event : eventsToFinish) {
            event.setStatus(Event.EventStatus.FINISHED);
            finishedCount++;
            log.info("Auto-updated event {} from ONGOING to FINISHED", event.getId());
        }
        
        if (finishedCount > 0) {
            eventRepository.saveAll(eventsToFinish);
            log.info("Auto-finished {} events to FINISHED status", finishedCount);
        }
        
        if (rejectedCount > 0 || startedCount > 0 || finishedCount > 0) {
            log.info("Event status scheduler completed: {} rejected, {} started, {} finished", 
                    rejectedCount, startedCount, finishedCount);
        }
    }
}
