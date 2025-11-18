package com.pramithamj.todo.exception;

/**
 * Exception thrown when token validation fails
 */
public class InvalidTokenException extends ApplicationException {
    
    public InvalidTokenException(String message) {
        super(message, "INVALID_TOKEN");
    }
    
    public InvalidTokenException(String message, Throwable cause) {
        super(message, "INVALID_TOKEN", cause);
    }
}
