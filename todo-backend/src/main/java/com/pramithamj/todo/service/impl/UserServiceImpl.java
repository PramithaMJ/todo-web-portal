package com.pramithamj.todo.service.impl;

import com.pramithamj.todo.dto.response.UserResponse;
import com.pramithamj.todo.entity.User;
import com.pramithamj.todo.exception.ResourceNotFoundException;
import com.pramithamj.todo.mapper.UserMapper;
import com.pramithamj.todo.repository.UserRepository;
import com.pramithamj.todo.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * UserServiceImpl
 * Service implementation for user business logic
 * Follows layered architecture: Controller -> Service -> Repository
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    /**
     * Find user by ID
     */
    @Transactional(readOnly = true)
    public Optional<User> findById(UUID userId) {
        log.debug("Finding user by ID: {}", userId);
        return userRepository.findById(userId);
    }

    /**
     * Find user by email
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        log.debug("Finding user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    /**
     * Get user by ID with exception if not found
     */
    @Transactional(readOnly = true)
    public User getUserById(UUID userId) {
        log.debug("Getting user by ID: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    /**
     * Get user response by ID
     */
    @Transactional(readOnly = true)
    public UserResponse getUserResponseById(UUID userId) {
        log.debug("Getting user response by ID: {}", userId);
        User user = getUserById(userId);
        return userMapper.toResponse(user);
    }

    /**
     * Save user
     */
    public User saveUser(User user) {
        log.debug("Saving user: {}", user.getEmail());
        return userRepository.save(user);
    }

    /**
     * Create new user with password (for email registration)
     */
    public User createUserWithPassword(String email, String name, String encryptedPassword) {
        log.debug("Creating user with password: {}", email);

        User user = User.builder()
                .email(email)
                .name(name)
                .provider("EMAIL")
                .providerId(email)
                .password(encryptedPassword)
                .avatarUrl(null)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Created new user with password: {}", email);
        return savedUser;
    }

    /**
     * Create new user from OAuth
     */
    public User createOAuthUser(String email, String name, String provider, String providerId, String avatarUrl) {
        log.debug("Creating OAuth user: {} ({})", email, provider);

        User user = User.builder()
                .email(email)
                .name(name)
                .provider(provider)
                .providerId(providerId)
                .avatarUrl(avatarUrl)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Created new OAuth user: {}", email);
        return savedUser;
    }

    /**
     * Find or create OAuth user
     */
    public User findOrCreateOAuthUser(String email, String name, String provider, String providerId, String avatarUrl) {
        log.debug("Finding or creating OAuth user: {} ({})", email, provider);

        // Try to find existing user by provider and provider ID
        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);
        
        if (existingUser.isPresent()) {
            log.info("Found existing OAuth user: {}", email);
            return existingUser.get();
        }

        // Try to find by email (user might have signed up with different provider)
        Optional<User> userByEmail = userRepository.findByEmail(email);
        if (userByEmail.isPresent()) {
            log.info("Found existing user by email: {}", email);
            return userByEmail.get();
        }

        // Create new user
        return createOAuthUser(email, name, provider, providerId, avatarUrl);
    }

    /**
     * Update last login timestamp
     */
    public void updateLastLogin(UUID userId) {
        log.debug("Updating last login for user: {}", userId);
        userRepository.updateLastLogin(userId, LocalDateTime.now());
    }

    /**
     * Check if email exists
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Deactivate user
     */
    public void deactivateUser(UUID userId) {
        log.debug("Deactivating user: {}", userId);
        userRepository.deactivateUser(userId);
        log.info("User deactivated: {}", userId);
    }
}
