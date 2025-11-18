package com.pramithamj.todo.exception;

/**
 * Exception thrown when business rule validation fails
 */
public class BusinessRuleViolationException extends ApplicationException {
    
    public BusinessRuleViolationException(String message) {
        super(message, "BUSINESS_RULE_VIOLATION");
    }
    
    public BusinessRuleViolationException(String message, Throwable cause) {
        super(message, "BUSINESS_RULE_VIOLATION", cause);
    }
}
