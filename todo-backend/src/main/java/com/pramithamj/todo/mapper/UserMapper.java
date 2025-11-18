package com.pramithamj.todo.mapper;

import com.pramithamj.todo.dto.response.UserResponse;
import com.pramithamj.todo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

/**
 * UserMapper
 * Maps between User entity and UserResponse DTO
 * Using MapStruct for type-safe, compile-time mapping
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    /**
     * Convert User entity to response DTO
     */
    UserResponse toResponse(User user);
}
