package com.pramithamj.todo.config;

import com.pramithamj.todo.entity.RefreshToken;
import com.pramithamj.todo.entity.User;
import com.pramithamj.todo.repository.RefreshTokenRepository;
import com.pramithamj.todo.service.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * OAuth2AuthenticationSuccessHandler
 * Handles successful OAuth2 authentication
 * Generates JWT tokens and redirects to frontend with tokens
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final IUserService userService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${application.oauth2.authorized-redirect-uris}")
    private String[] authorizedRedirectUris;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to {}", targetUrl);
            return;
        }

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    @Transactional
    protected String determineTargetUrl(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user information
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = extractEmail(attributes);
        String name = extractName(attributes);
        String provider = extractProvider(authentication);
        String providerId = extractProviderId(attributes, provider);
        String avatarUrl = extractAvatarUrl(attributes, provider);

        log.info("OAuth2 login successful for user: {} via {}", email, provider);

        // Find or create user
        User user = userService.findOrCreateOAuthUser(email, name, provider, providerId, avatarUrl);

        // Generate JWT tokens
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId().toString(),
                user.getEmail()
        );
        String refreshTokenValue = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        // Save refresh token to database
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .userId(user.getId())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .isRevoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        // Update last login
        userService.updateLastLogin(user.getId());

        log.info("OAuth2 authentication completed for user: {}", user.getEmail());

        // Build redirect URL with tokens
        String targetUrl = authorizedRedirectUris[0]; // Use first authorized URI

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshTokenValue)
                .build()
                .toUriString();
    }

    private String extractEmail(Map<String, Object> attributes) {
        String email = (String) attributes.get("email");
        
        // If email is not present (GitHub private email case), use login + provider domain
        if (email == null || email.isEmpty()) {
            String login = (String) attributes.get("login");
            if (login != null) {
                // Generate a unique email using GitHub username
                email = login + "@github.oauth.local";
            } else {
                email = "unknown@oauth.local";
            }
        }
        
        return email;
    }

    private String extractName(Map<String, Object> attributes) {
        return (String) attributes.getOrDefault("name", 
                attributes.getOrDefault("login", "Unknown User"));
    }

    private String extractProvider(Authentication authentication) {
        // Get the OAuth2 registration ID from the authentication details
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Try to determine provider from attributes
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        // Google has 'sub' attribute, GitHub has 'id' attribute
        if (attributes.containsKey("sub") && attributes.get("email") != null) {
            return "GOOGLE";
        } else if (attributes.containsKey("id") && attributes.containsKey("login")) {
            return "GITHUB";
        }
        
        // Fallback: try to get from authentication name
        String authName = authentication.getName();
        if (authName.contains("google")) return "GOOGLE";
        if (authName.contains("github")) return "GITHUB";
        
        // If we still can't determine, default to GOOGLE (shouldn't happen)
        log.warn("Could not determine OAuth provider, defaulting to GOOGLE");
        return "GOOGLE";
    }

    private String extractProviderId(Map<String, Object> attributes, String provider) {
        if ("GOOGLE".equals(provider)) {
            return (String) attributes.get("sub");
        } else if ("GITHUB".equals(provider)) {
            Object id = attributes.get("id");
            return id != null ? id.toString() : null;
        }
        return null;
    }

    private String extractAvatarUrl(Map<String, Object> attributes, String provider) {
        String avatarUrl = null;
        
        if ("GOOGLE".equals(provider)) {
            avatarUrl = (String) attributes.get("picture");
        } else if ("GITHUB".equals(provider)) {
            avatarUrl = (String) attributes.get("avatar_url");
        }
        
        // Safeguard: Truncate or skip if avatar URL is too long
        if (avatarUrl != null && avatarUrl.length() > 2000) {
            log.warn("Avatar URL too long ({} chars), truncating to 2000 chars", avatarUrl.length());
            avatarUrl = avatarUrl.substring(0, 2000);
        }
        
        return avatarUrl;
    }
}
