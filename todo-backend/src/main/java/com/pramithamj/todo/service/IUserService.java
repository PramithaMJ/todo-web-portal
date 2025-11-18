package com.pramithamj.todo.service;

import com.pramithamj.todo.dto.response.UserResponse;
import com.pramithamj.todo.entity.User;

import java.util.Optional;
import java.util.UUID;

/**
 * IUserService
 * Service interface for user business logic
 */
public interface IUserService {

    /**
     * Find user by ID
     */
    Optional<User> findById(UUID userId);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Get user by ID with exception if not found
     */
    User getUserById(UUID userId);

    /**
     * Get user response by ID
     */
    UserResponse getUserResponseById(UUID userId);

    /**
     * Save user
     */
    User saveUser(User user);

    /**
     * Create new user with password (for email registration)
     */
    User createUserWithPassword(String email, String name, String encryptedPassword);

    /**
     * Create new user from OAuth
     */
    User createOAuthUser(String email, String name, String provider, String providerId, String avatarUrl);

    /**
     * Find or create OAuth user
     */
    User findOrCreateOAuthUser(String email, String name, String provider, String providerId, String avatarUrl);

    /**
     * Update last login timestamp
     */
    void updateLastLogin(UUID userId);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Deactivate user
     */
    void deactivateUser(UUID userId);
}
