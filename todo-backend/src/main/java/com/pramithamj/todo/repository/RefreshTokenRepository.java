package com.pramithamj.todo.repository;

import com.pramithamj.todo.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * RefreshTokenRepository
 * Repository interface for RefreshToken entity
 * Following Repository Pattern and Interface Segregation Principle
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /**
     * Find refresh token by token string
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Find valid refresh token (not revoked and not expired)
     */
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.token = :token AND rt.isRevoked = false AND rt.expiresAt > CURRENT_TIMESTAMP")
    Optional<RefreshToken> findValidToken(@Param("token") String token);

    /**
     * Find all tokens by user ID
     */
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.userId = :userId")
    Optional<RefreshToken> findByUserId(@Param("userId") UUID userId);

    /**
     * Revoke all refresh tokens for a user
     */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.userId = :userId AND rt.isRevoked = false")
    void revokeAllUserTokens(@Param("userId") UUID userId);

    /**
     * Delete expired tokens (cleanup)
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :now OR rt.isRevoked = true")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Delete all tokens by user ID
     */
    void deleteByUserId(UUID userId);
}
