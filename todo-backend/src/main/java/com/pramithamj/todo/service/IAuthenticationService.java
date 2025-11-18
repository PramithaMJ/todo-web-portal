package com.pramithamj.todo.service;

import com.pramithamj.todo.dto.request.LoginRequest;
import com.pramithamj.todo.dto.request.RefreshTokenRequest;
import com.pramithamj.todo.dto.request.RegisterRequest;
import com.pramithamj.todo.dto.response.AuthenticationResponse;
import com.pramithamj.todo.entity.User;

import java.util.UUID;

/**
 * IAuthenticationService
 * Service interface for authentication business logic
 */
public interface IAuthenticationService {

    /**
     * Register a new user with password encryption
     */
    AuthenticationResponse register(RegisterRequest request);

    /**
     * Login user with password verification
     */
    AuthenticationResponse login(LoginRequest request);

    /**
     * Refresh access token using refresh token
     */
    AuthenticationResponse refreshAccessToken(RefreshTokenRequest request);

    /**
     * Logout user by revoking all refresh tokens
     */
    void logout(UUID userId);

    /**
     * Get current user
     */
    User getCurrentUser(UUID userId);
}
