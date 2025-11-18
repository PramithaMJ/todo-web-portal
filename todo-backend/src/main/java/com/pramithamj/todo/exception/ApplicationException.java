package com.pramithamj.todo.exception;

/**
 * Base Application Exception
 * All custom exceptions extend this
 */
public class ApplicationException extends RuntimeException {
    
    private final String errorCode;
    
    public ApplicationException(String message) {
        super(message);
        this.errorCode = "APPLICATION_ERROR";
    }
    
    public ApplicationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public ApplicationException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "APPLICATION_ERROR";
    }
    
    public ApplicationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}
