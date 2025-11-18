package com.pramithamj.todo.repository;

import com.pramithamj.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * UserRepository
 * Repository interface for User entity following Repository Pattern
 * Interface Segregation Principle - only necessary methods
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by email address
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by provider and provider ID (for OAuth2)
     */
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    /**
     * Check if email already exists
     */
    boolean existsByEmail(String email);

    /**
     * Update user's last login timestamp
     */
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") UUID userId, @Param("loginTime") LocalDateTime loginTime);

    /**
     * Deactivate user account
     */
    @Modifying
    @Query("UPDATE User u SET u.isActive = false WHERE u.id = :userId")
    void deactivateUser(@Param("userId") UUID userId);
}
