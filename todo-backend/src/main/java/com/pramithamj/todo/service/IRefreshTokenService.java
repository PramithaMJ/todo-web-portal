package com.pramithamj.todo.service;

import com.pramithamj.todo.entity.RefreshToken;

import java.util.Optional;
import java.util.UUID;

/**
 * IRefreshTokenService
 * Service interface for refresh token management
 */
public interface IRefreshTokenService {

    /**
     * Create and save a refresh token
     */
    RefreshToken createRefreshToken(UUID userId, String token, Long expirationMs);

    /**
     * Find a valid (non-expired, non-revoked) refresh token
     */
    Optional<RefreshToken> findValidToken(String token);

    /**
     * Revoke a specific refresh token
     */
    void revokeToken(String token);

    /**
     * Revoke all refresh tokens for a user
     */
    void revokeAllUserTokens(UUID userId);

    /**
     * Delete expired tokens (cleanup)
     */
    void deleteExpiredTokens();
}
