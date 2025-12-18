package com.example.backend.repo;

import com.example.backend.entity.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {

    List<PushSubscription> findByUserEmail(String email);

    boolean existsByEndpoint(String endpoint);

    @Transactional
    @Modifying
    void deleteByEndpoint(String endpoint);
}