package com.example.backend.service;

import com.example.backend.entity.Event;
import com.example.backend.entity.Registration;
import com.example.backend.entity.User;
import com.example.backend.exception.BadCredentialsAppException;
import com.example.backend.repo.EventRepository;
import com.example.backend.repo.RegistrationRepository;
import com.example.backend.repo.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    /**
     * Lấy danh sách tất cả volunteer (không phân trang)
     */
    @Transactional(readOnly = true)
    public List<User> getAllVolunteers() {
        return userRepository.findAll();
    }

    /**
     * Lấy danh sách volunteer có phân trang
     */
    @Transactional(readOnly = true)
    public Page<User> getVolunteers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    /**
     * Ban user
     * Auto-reject pending events (if organizer)
     * Auto-reject approved registrations (if volunteer)
     */
    @Transactional
    public void banUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsAppException("The user was not found."));
        
        user.setLocked(true);
        userRepository.save(user);
        log.info("User {} has been locked", email);

        // If organizer: auto-reject all PENDING events
        if (user.getRole() == User.Role.EVENT_ORGANIZER) {
            List<Event> pendingEvents = eventRepository.findByOrganizerEmailAndStatus(
                email, Event.EventStatus.PENDING);
            
            if (!pendingEvents.isEmpty()) {
                pendingEvents.forEach(event -> {
                    event.setStatus(Event.EventStatus.REJECTED);
                    log.info("Auto-rejected event {} due to organizer ban", event.getId());
                });
                eventRepository.saveAll(pendingEvents);
                log.info("Auto-rejected {} pending events for banned organizer {}", 
                    pendingEvents.size(), email);
            }
        }

        // Auto-reject all APPROVED registrations
        List<Registration> approvedRegistrations = registrationRepository
            .findByUserEmailAndStatus(email, Registration.RequestStatus.APPROVED);
        
        if (!approvedRegistrations.isEmpty()) {
            approvedRegistrations.forEach(reg -> {
                reg.setStatus(Registration.RequestStatus.REJECTED);
                
                // Restore event remaining slot
                Event event = reg.getEvent();
                event.setRemaining(event.getRemaining() + 1);
                eventRepository.save(event);
                
                log.info("Auto-rejected registration {} and restored slot for event {}", 
                    reg.getId(), event.getId());
            });
            registrationRepository.saveAll(approvedRegistrations);
            log.info("Auto-rejected {} approved registrations for banned user {}", 
                approvedRegistrations.size(), email);
        }
    }


    @Transactional
    public void unbanUser(String email) {
        User v = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsAppException("The user was not found."));
        v.setLocked(false);
        userRepository.save(v);
        log.info("User {} has been unlocked", email);
    }
}
