package com.pramithamj.todo.service.impl;

import com.pramithamj.todo.config.JwtTokenProvider;
import com.pramithamj.todo.dto.request.LoginRequest;
import com.pramithamj.todo.dto.request.RefreshTokenRequest;
import com.pramithamj.todo.dto.request.RegisterRequest;
import com.pramithamj.todo.dto.response.AuthenticationResponse;
import com.pramithamj.todo.dto.response.UserResponse;
import com.pramithamj.todo.entity.RefreshToken;
import com.pramithamj.todo.entity.User;
import com.pramithamj.todo.exception.AuthenticationException;
import com.pramithamj.todo.exception.BusinessRuleViolationException;
import com.pramithamj.todo.exception.InvalidTokenException;
import com.pramithamj.todo.service.IAuthenticationService;
import com.pramithamj.todo.service.IRefreshTokenService;
import com.pramithamj.todo.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * AuthenticationServiceImpl
 * Service implementation for authentication business logic with JWT and BCrypt
 * Follows layered architecture: Controller -> Service -> Repository
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements IAuthenticationService {

    private final IUserService userService;
    private final IRefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register a new user with password encryption
     */
    public AuthenticationResponse register(RegisterRequest request) {
        log.debug("Registering new user: {}", request.getEmail());

        // Check if email already exists
        if (userService.existsByEmail(request.getEmail())) {
            throw new BusinessRuleViolationException("Email already registered");
        }

        // Create new user with encrypted password
        User savedUser = userService.createUserWithPassword(
                request.getEmail(),
                request.getName(),
                passwordEncoder.encode(request.getPassword())
        );

        log.info("User registered successfully: {}", savedUser.getEmail());

        return generateAuthenticationResponse(savedUser);
    }

    /**
     * Login user with password verification
     */
    public AuthenticationResponse login(LoginRequest request) {
        log.debug("Login attempt for user: {}", request.getEmail());

        // Find user by email
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        // Verify password
        if (user.getPassword() == null || 
            !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }

        // Check if user is active
        if (!user.getIsActive()) {
            throw new AuthenticationException("User account is deactivated");
        }

        log.info("User logged in successfully: {}", user.getEmail());

        return generateAuthenticationResponse(user);
    }

    /**
     * Refresh access token using refresh token
     */
    public AuthenticationResponse refreshAccessToken(RefreshTokenRequest request) {
        log.debug("Refreshing access token");

        String refreshToken = request.getRefreshToken();

        // Validate refresh token with JWT
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        String tokenType = jwtTokenProvider.extractTokenType(refreshToken);
        if (!"REFRESH".equals(tokenType)) {
            throw new InvalidTokenException("Token is not a refresh token");
        }

        // Find refresh token in database
        RefreshToken tokenEntity = refreshTokenService.findValidToken(refreshToken)
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired refresh token"));

        // Get user
        User user = userService.getUserById(tokenEntity.getUserId());

        log.info("Access token refreshed for user: {}", user.getEmail());

        return generateAuthenticationResponse(user);
    }

    /**
     * Logout user by revoking all refresh tokens
     */
    public void logout(UUID userId) {
        log.debug("Logging out user: {}", userId);
        refreshTokenService.revokeAllUserTokens(userId);
        log.info("User logged out successfully: {}", userId);
    }

    /**
     * Get current user
     */
    @Transactional(readOnly = true)
    public User getCurrentUser(UUID userId) {
        return userService.getUserById(userId);
    }

    /**
     * Generate authentication response with JWT tokens
     */
    private AuthenticationResponse generateAuthenticationResponse(User user) {
        log.debug("Generating authentication response for user: {}", user.getEmail());

        // Generate JWT tokens
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId().toString(),
                user.getEmail()
        );
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        // Save refresh token
        refreshTokenService.createRefreshToken(
                user.getId(),
                refreshToken,
                jwtTokenProvider.getRefreshExpiration()
        );

        // Update last login
        userService.updateLastLogin(user.getId());

        // Get user response
        UserResponse userResponse = userService.getUserResponseById(user.getId());

        return AuthenticationResponse.of(
                accessToken,
                refreshToken,
                jwtTokenProvider.getJwtExpiration() / 1000, // Convert to seconds
                userResponse
        );
    }
}
