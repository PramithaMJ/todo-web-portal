package com.pramithamj.todo.service.impl;

import com.pramithamj.todo.entity.RefreshToken;
import com.pramithamj.todo.exception.InvalidTokenException;
import com.pramithamj.todo.repository.RefreshTokenRepository;
import com.pramithamj.todo.service.IRefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * RefreshTokenServiceImpl
 * Service implementation for refresh token management
 * Follows layered architecture: Controller -> Service -> Repository
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements IRefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Create refresh token
     */
    @Override
    public RefreshToken createRefreshToken(UUID userId, String token, Long expirationMs) {
        log.debug("Creating refresh token for user: {}", userId);

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(expirationMs / 1000);

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(token)
                .expiresAt(expiresAt)
                .isRevoked(false)
                .build();

        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        log.info("Created refresh token for user: {}", userId);
        
        return saved;
    }

    /**
     * Find valid token
     */
    @Transactional(readOnly = true)
    public Optional<RefreshToken> findValidToken(String token) {
        log.debug("Finding valid refresh token");
        return refreshTokenRepository.findValidToken(token);
    }

    /**
     * Revoke token
     */
    public void revokeToken(String token) {
        log.debug("Revoking refresh token");
        
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        refreshToken.setIsRevoked(true);
        refreshTokenRepository.save(refreshToken);
        
        log.info("Refresh token revoked");
    }

    /**
     * Revoke all user tokens
     */
    public void revokeAllUserTokens(UUID userId) {
        log.debug("Revoking all tokens for user: {}", userId);
        refreshTokenRepository.revokeAllUserTokens(userId);
        log.info("All tokens revoked for user: {}", userId);
    }

    /**
     * Delete expired tokens
     */
    public void deleteExpiredTokens() {
        log.debug("Deleting expired tokens");
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Expired tokens deleted");
    }

    /**
     * Check if token is valid
     */
    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        return refreshTokenRepository.findValidToken(token).isPresent();
    }
}
