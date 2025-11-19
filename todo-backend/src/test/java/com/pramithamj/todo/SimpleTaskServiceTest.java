package com.pramithamj.todo;

import com.pramithamj.todo.dto.request.CreateTaskRequest;
import com.pramithamj.todo.dto.response.TaskResponse;
import com.pramithamj.todo.entity.Task;
import com.pramithamj.todo.mapper.TaskMapper;
import com.pramithamj.todo.repository.TaskRepository;
import com.pramithamj.todo.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Simple Task Service Tests
 * Basic unit tests for TaskServiceImpl
 */
@ExtendWith(MockitoExtension.class)
class SimpleTaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    private UUID userId;
    private UUID taskId;
    private Task task;
    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        taskId = UUID.randomUUID();

        task = Task.builder()
                .id(taskId)
                .userId(userId)
                .title("Test Task")
                .description("Test Description")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        taskResponse = TaskResponse.builder()
                .id(taskId)
                .userId(userId)
                .title("Test Task")
                .description("Test Description")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void shouldCreateTask() {
        // Given
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("New Task");
        request.setDescription("New Description");

        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        // When
        TaskResponse result = taskService.createTask(request, userId);

        // Then
        assertNotNull(result);
        assertEquals(taskResponse.getId(), result.getId());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void shouldGetTaskById() {
        // Given
        when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
        when(taskMapper.toResponse(task)).thenReturn(taskResponse);

        // When
        TaskResponse result = taskService.getTaskById(taskId, userId);

        // Then
        assertNotNull(result);
        assertEquals(taskId, result.getId());
        assertEquals("Test Task", result.getTitle());
        verify(taskRepository, times(1)).findByIdAndUserId(taskId, userId);
    }

    @Test
    void shouldCompleteTask() {
        // Given
        when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

        // When
        TaskResponse result = taskService.markAsCompleted(taskId, userId);

        // Then
        assertNotNull(result);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void shouldDeleteTask() {
        // Given
        when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));

        // When
        taskService.deleteTask(taskId, userId);

        // Then
        verify(taskRepository, times(1)).delete(task);
    }

    @Test
    void shouldCountTasksByStatus() {
        // Given
        when(taskRepository.countByUserIdAndStatus(userId, "PENDING")).thenReturn(5L);

        // When
        long count = taskService.countTasksByStatus("PENDING", userId);

        // Then
        assertEquals(5L, count);
        verify(taskRepository, times(1)).countByUserIdAndStatus(userId, "PENDING");
    }
}
