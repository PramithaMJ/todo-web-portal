package com.pramithamj.todo.exception;

/**
 * Exception thrown when a requested resource is not found
 */
public class ResourceNotFoundException extends ApplicationException {
    
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND");
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue), 
              "RESOURCE_NOT_FOUND");
    }
}
