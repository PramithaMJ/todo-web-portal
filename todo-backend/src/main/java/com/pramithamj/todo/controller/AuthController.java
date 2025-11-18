package com.pramithamj.todo.controller;

import com.pramithamj.todo.dto.request.LoginRequest;
import com.pramithamj.todo.dto.request.RefreshTokenRequest;
import com.pramithamj.todo.dto.request.RegisterRequest;
import com.pramithamj.todo.dto.response.AuthenticationResponse;
import com.pramithamj.todo.entity.User;
import com.pramithamj.todo.security.CurrentUser;
import com.pramithamj.todo.security.UserPrincipal;
import com.pramithamj.todo.service.IAuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * AuthController
 * REST API endpoints for authentication
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final IAuthenticationService authenticationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Create a new user account")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request for email: {}", request.getEmail());
        AuthenticationResponse response = authenticationService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and return JWT tokens")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthenticationResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Get new access token using refresh token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request");
        AuthenticationResponse response = authenticationService.refreshAccessToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Logout user", description = "Revoke user's refresh tokens")
    public ResponseEntity<Void> logout(@CurrentUser UserPrincipal currentUser) {
        log.info("Logout request for user: {}", currentUser.getId());
        authenticationService.logout(currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user", description = "Get currently authenticated user details")
    public ResponseEntity<User> getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        log.info("Get current user request: {}", currentUser.getId());
        User user = authenticationService.getCurrentUser(currentUser.getId());
        return ResponseEntity.ok(user);
    }
}
