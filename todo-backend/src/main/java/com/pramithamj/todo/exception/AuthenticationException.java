package com.pramithamj.todo.exception;

/**
 * Exception thrown when authentication fails
 */
public class AuthenticationException extends ApplicationException {
    
    public AuthenticationException(String message) {
        super(message, "AUTHENTICATION_FAILED");
    }
    
    public AuthenticationException(String message, Throwable cause) {
        super(message, "AUTHENTICATION_FAILED", cause);
    }
}
