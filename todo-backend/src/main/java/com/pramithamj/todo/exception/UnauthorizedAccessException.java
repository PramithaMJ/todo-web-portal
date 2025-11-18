package com.pramithamj.todo.exception;

/**
 * UnauthorizedAccessException
 * Thrown when a user attempts to access a resource they don't have permission for
 * Results in HTTP 403 Forbidden
 */
public class UnauthorizedAccessException extends ApplicationException {
    
    public UnauthorizedAccessException(String message) {
        super(message);
    }
    
    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
