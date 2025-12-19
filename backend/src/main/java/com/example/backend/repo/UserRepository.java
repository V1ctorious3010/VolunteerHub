package com.example.backend.repo;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Find user by email
     * @param email the email of the user
     * @return the user
     */
    Optional<User> findByEmail(String email);

    /**
     * Count users by roles and not locked
     * @param roles the roles to filter
     * @return the count of users
     */
    long countByRoleInAndIsLockedFalse(User.Role... roles);
}