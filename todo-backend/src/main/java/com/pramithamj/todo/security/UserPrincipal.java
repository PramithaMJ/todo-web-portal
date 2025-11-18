package com.pramithamj.todo.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * UserPrincipal
 * Represents the authenticated user in the security context
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal {
    
    private UUID id;
    private String email;
    private String name;
    
    public static UserPrincipal create(UUID id, String email, String name) {
        return UserPrincipal.builder()
                .id(id)
                .email(email)
                .name(name)
                .build();
    }
}
