package com.pramithamj.todo.service;

import com.pramithamj.todo.dto.request.CreateTaskRequest;
import com.pramithamj.todo.dto.request.UpdateTaskRequest;
import com.pramithamj.todo.dto.response.TaskResponse;
import com.pramithamj.todo.dto.response.TaskStatistics;
import com.pramithamj.todo.entity.Task;
import com.pramithamj.todo.exception.ResourceNotFoundException;
import com.pramithamj.todo.mapper.TaskMapper;
import com.pramithamj.todo.repository.TaskRepository;
import com.pramithamj.todo.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Comprehensive unit tests for TaskServiceImpl
 * Following industry best practices with proper test structure
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService Unit Tests")
class TaskServiceImplTest {

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
    private CreateTaskRequest createRequest;
    private UpdateTaskRequest updateRequest;

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

        createRequest = new CreateTaskRequest();
        createRequest.setTitle("New Task");
        createRequest.setDescription("New Description");

        updateRequest = new UpdateTaskRequest();
        updateRequest.setTitle("Updated Task");
        updateRequest.setDescription("Updated Description");
    }

    @Nested
    @DisplayName("Create Task Tests")
    class CreateTaskTests {

        @Test
        @DisplayName("Should create task successfully with valid data")
        void shouldCreateTaskSuccessfully() {
            // Given
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(task)).thenReturn(taskResponse);

            // When
            TaskResponse result = taskService.createTask(createRequest, userId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(taskId);
            assertThat(result.getTitle()).isEqualTo("Test Task");
            
            ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
            verify(taskRepository).save(taskCaptor.capture());
            
            Task savedTask = taskCaptor.getValue();
            assertThat(savedTask.getUserId()).isEqualTo(userId);
            assertThat(savedTask.getStatus()).isEqualTo("PENDING");
        }

        @Test
        @DisplayName("Should set correct default status when creating task")
        void shouldSetDefaultStatus() {
            // Given
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            taskService.createTask(createRequest, userId);

            // Then
            ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
            verify(taskRepository).save(captor.capture());
            assertThat(captor.getValue().getStatus()).isEqualTo("PENDING");
        }
    }

    @Nested
    @DisplayName("Get Task Tests")
    class GetTaskTests {

        @Test
        @DisplayName("Should get task by ID successfully")
        void shouldGetTaskById() {
            // Given
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
            when(taskMapper.toResponse(task)).thenReturn(taskResponse);

            // When
            TaskResponse result = taskService.getTaskById(taskId, userId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(taskId);
            assertThat(result.getTitle()).isEqualTo("Test Task");
            verify(taskRepository).findByIdAndUserId(taskId, userId);
        }

        @Test
        @DisplayName("Should throw exception when task not found")
        void shouldThrowExceptionWhenTaskNotFound() {
            // Given
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> taskService.getTaskById(taskId, userId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Task not found");
        }

        @Test
        @DisplayName("Should get all tasks for user")
        void shouldGetAllTasksForUser() {
            // Given
            List<Task> tasks = Arrays.asList(task, task);
            Page<Task> taskPage = new PageImpl<>(tasks);
            when(taskRepository.findByUserId(eq(userId), any(Pageable.class))).thenReturn(taskPage);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            List<TaskResponse> result = taskService.getAllTasksForUser(userId);

            // Then
            assertThat(result).hasSize(2);
            verify(taskRepository).findByUserId(eq(userId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("Update Task Tests")
    class UpdateTaskTests {

        @Test
        @DisplayName("Should update task successfully")
        void shouldUpdateTaskSuccessfully() {
            // Given
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            TaskResponse result = taskService.updateTask(taskId, updateRequest, userId);

            // Then
            assertThat(result).isNotNull();
            verify(taskRepository).findByIdAndUserId(taskId, userId);
            verify(taskRepository).save(any(Task.class));
        }

        @Test
        @DisplayName("Should update only non-null fields")
        void shouldUpdateOnlyNonNullFields() {
            // Given
            UpdateTaskRequest partialUpdate = new UpdateTaskRequest();
            partialUpdate.setTitle("New Title Only");
            
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            taskService.updateTask(taskId, partialUpdate, userId);

            // Then
            ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
            verify(taskRepository).save(captor.capture());
            assertThat(captor.getValue().getTitle()).isEqualTo("New Title Only");
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent task")
        void shouldThrowExceptionWhenUpdatingNonExistentTask() {
            // Given
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> taskService.updateTask(taskId, updateRequest, userId))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Delete Task Tests")
    class DeleteTaskTests {

        @Test
        @DisplayName("Should delete task successfully")
        void shouldDeleteTaskSuccessfully() {
            // Given
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));

            // When
            taskService.deleteTask(taskId, userId);

            // Then
            verify(taskRepository).findByIdAndUserId(taskId, userId);
            verify(taskRepository).delete(task);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent task")
        void shouldThrowExceptionWhenDeletingNonExistentTask() {
            // Given
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> taskService.deleteTask(taskId, userId))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Task Status Tests")
    class TaskStatusTests {

        @Test
        @DisplayName("Should mark task as completed")
        void shouldMarkTaskAsCompleted() {
            // Given
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            TaskResponse result = taskService.markAsCompleted(taskId, userId);

            // Then
            assertThat(result).isNotNull();
            ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
            verify(taskRepository).save(captor.capture());
            assertThat(captor.getValue().getStatus()).isEqualTo("COMPLETED");
            assertThat(captor.getValue().getCompletedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should reopen completed task")
        void shouldReopenTask() {
            // Given
            task.setStatus("COMPLETED");
            task.setCompletedAt(LocalDateTime.now());
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            TaskResponse result = taskService.reopenTask(userId, taskId);

            // Then
            assertThat(result).isNotNull();
            ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
            verify(taskRepository).save(captor.capture());
            assertThat(captor.getValue().getStatus()).isEqualTo("PENDING");
            assertThat(captor.getValue().getCompletedAt()).isNull();
        }

        @Test
        @DisplayName("Should get tasks by status")
        void shouldGetTasksByStatus() {
            // Given
            Page<Task> pendingTasks = new PageImpl<>(Arrays.asList(task));
            when(taskRepository.findPendingTasksByUserId(eq(userId), any(Pageable.class)))
                    .thenReturn(pendingTasks);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            List<TaskResponse> result = taskService.getTasksByStatus("PENDING", userId);

            // Then
            assertThat(result).isNotEmpty();
            verify(taskRepository).findPendingTasksByUserId(eq(userId), any(Pageable.class));
        }

        @Test
        @DisplayName("Should count tasks by status")
        void shouldCountTasksByStatus() {
            // Given
            when(taskRepository.countByUserIdAndStatus(userId, "PENDING")).thenReturn(5L);

            // When
            long count = taskService.countTasksByStatus("PENDING", userId);

            // Then
            assertThat(count).isEqualTo(5L);
            verify(taskRepository).countByUserIdAndStatus(userId, "PENDING");
        }
    }

    @Nested
    @DisplayName("Pagination Tests")
    class PaginationTests {

        @Test
        @DisplayName("Should get paginated tasks")
        void shouldGetPaginatedTasks() {
            // Given
            List<Task> tasks = Arrays.asList(task, task, task);
            Page<Task> taskPage = new PageImpl<>(tasks, PageRequest.of(0, 10), 3);
            when(taskRepository.findByUserId(eq(userId), any(Pageable.class))).thenReturn(taskPage);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            Page<TaskResponse> result = taskService.getAllTasks(userId, 0, 10);

            // Then
            assertThat(result.getContent()).hasSize(3);
            assertThat(result.getTotalElements()).isEqualTo(3);
            verify(taskRepository).findByUserId(eq(userId), any(Pageable.class));
        }

        @Test
        @DisplayName("Should get recent 5 tasks")
        void shouldGetRecent5Tasks() {
            // Given
            List<Task> tasks = Arrays.asList(task, task, task, task, task);
            when(taskRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)).thenReturn(tasks);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            List<TaskResponse> result = taskService.getRecent5Tasks(userId);

            // Then
            assertThat(result).hasSize(5);
            verify(taskRepository).findTop5ByUserIdOrderByCreatedAtDesc(userId);
        }
    }

    @Nested
    @DisplayName("Search Tests")
    class SearchTests {

        @Test
        @DisplayName("Should search tasks by query")
        void shouldSearchTasks() {
            // Given
            String query = "test";
            Page<Task> searchResults = new PageImpl<>(Arrays.asList(task));
            when(taskRepository.searchTasks(eq(userId), eq(query), any(Pageable.class)))
                    .thenReturn(searchResults);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            Page<TaskResponse> result = taskService.searchTasks(userId, query, 0, 10);

            // Then
            assertThat(result.getContent()).isNotEmpty();
            verify(taskRepository).searchTasks(eq(userId), eq(query), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("Statistics Tests")
    class StatisticsTests {

        @Test
        @DisplayName("Should get task statistics")
        void shouldGetTaskStatistics() {
            // Given
            when(taskRepository.countByUserId(userId)).thenReturn(10L);
            when(taskRepository.countByUserIdAndStatus(userId, "PENDING")).thenReturn(6L);
            when(taskRepository.countByUserIdAndStatus(userId, "COMPLETED")).thenReturn(4L);

            // When
            TaskStatistics result = taskService.getTaskStatistics(userId);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getTotal()).isEqualTo(10L);
            assertThat(result.getPending()).isEqualTo(6L);
            assertThat(result.getCompleted()).isEqualTo(4L);
            
            verify(taskRepository).countByUserId(userId);
            verify(taskRepository).countByUserIdAndStatus(userId, "PENDING");
            verify(taskRepository).countByUserIdAndStatus(userId, "COMPLETED");
        }

        @Test
        @DisplayName("Should return zero statistics for new user")
        void shouldReturnZeroStatisticsForNewUser() {
            // Given
            when(taskRepository.countByUserId(userId)).thenReturn(0L);
            when(taskRepository.countByUserIdAndStatus(userId, "PENDING")).thenReturn(0L);
            when(taskRepository.countByUserIdAndStatus(userId, "COMPLETED")).thenReturn(0L);

            // When
            TaskStatistics result = taskService.getTaskStatistics(userId);

            // Then
            assertThat(result.getTotal()).isZero();
            assertThat(result.getPending()).isZero();
            assertThat(result.getCompleted()).isZero();
        }
    }

    @Nested
    @DisplayName("Edge Cases and Validation")
    class EdgeCasesTests {

        @Test
        @DisplayName("Should handle empty title in update")
        void shouldHandleEmptyTitleInUpdate() {
            // Given
            UpdateTaskRequest emptyUpdate = new UpdateTaskRequest();
            emptyUpdate.setTitle("   ");
            
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            taskService.updateTask(taskId, emptyUpdate, userId);

            // Then
            verify(taskRepository).findByIdAndUserId(taskId, userId);
            // Title should not be updated if blank
        }

        @Test
        @DisplayName("Should handle null description in update")
        void shouldHandleNullDescriptionInUpdate() {
            // Given
            UpdateTaskRequest nullDescUpdate = new UpdateTaskRequest();
            nullDescUpdate.setTitle("Valid Title");
            nullDescUpdate.setDescription(null);
            
            when(taskRepository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(task);
            when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

            // When
            TaskResponse result = taskService.updateTask(taskId, nullDescUpdate, userId);

            // Then
            assertThat(result).isNotNull();
            verify(taskRepository).save(any(Task.class));
        }
    }
}
