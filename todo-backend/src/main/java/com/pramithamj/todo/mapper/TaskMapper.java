package com.pramithamj.todo.mapper;

import com.pramithamj.todo.dto.response.TaskResponse;
import com.pramithamj.todo.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

/**
 * TaskMapper
 * Maps between Task entity and TaskResponse DTO
 * Using MapStruct for type-safe, compile-time mapping
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TaskMapper {

    /**
     * Convert Task entity to response DTO
     */
    TaskResponse toResponse(Task task);

    /**
     * Convert list of Task entities to response DTOs
     */
    List<TaskResponse> toResponseList(List<Task> tasks);
}
