package com.pramithamj.todo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

/**
 * OAuth2Controller
 * Redirect endpoints for OAuth2 authentication using Spring Security's OAuth2 client
 */
@RestController
@RequestMapping("/api/v1/auth/oauth2")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "OAuth2", description = "OAuth2 authentication APIs")
public class OAuth2Controller {

    /**
     * Redirect to Google OAuth2 authorization
     * Spring Security will handle the authorization request and state management
     */
    @GetMapping("/google")
    @Operation(summary = "Initiate Google OAuth", description = "Redirect to Google OAuth2 authorization")
    public RedirectView googleLogin() {
        log.info("Initiating Google OAuth2 login");
        // Spring Security will intercept this and handle the OAuth2 authorization request
        return new RedirectView("/oauth2/authorization/google");
    }

    /**
     * Redirect to GitHub OAuth2 authorization
     * Spring Security will handle the authorization request and state management
     */
    @GetMapping("/github")
    @Operation(summary = "Initiate GitHub OAuth", description = "Redirect to GitHub OAuth2 authorization")
    public RedirectView githubLogin() {
        log.info("Initiating GitHub OAuth2 login");
        // Spring Security will intercept this and handle the OAuth2 authorization request
        return new RedirectView("/oauth2/authorization/github");
    }
}
