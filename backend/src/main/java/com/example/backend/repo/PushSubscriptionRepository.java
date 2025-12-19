package com.example.backend.repo;

import com.example.backend.entity.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {

    /** Find all push subscriptions by user email
     * @param email User's email
     * @return List of PushSubscription
     */
    List<PushSubscription> findByUserEmail(String email);

    /** Check if a push subscription exists by endpoint
     * @param endpoint Subscription endpoint
     * @return true if exists, false otherwise
     */
    boolean existsByEndpoint(String endpoint);

    /** Delete a push subscription by endpoint
     * @param endpoint Subscription endpoint
     */
    @Transactional
    @Modifying
    void deleteByEndpoint(String endpoint);
}