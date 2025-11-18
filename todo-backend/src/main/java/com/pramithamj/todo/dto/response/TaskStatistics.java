package com.pramithamj.todo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TaskStatistics
 * DTO for task statistics response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatistics {
    
    private long total;
    
    private long pending;
    
    private long completed;
}
