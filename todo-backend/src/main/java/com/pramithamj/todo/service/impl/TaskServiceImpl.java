package com.pramithamj.todo.service.impl;

import com.pramithamj.todo.dto.request.CreateTaskRequest;
import com.pramithamj.todo.dto.request.UpdateTaskRequest;
import com.pramithamj.todo.dto.response.TaskResponse;
import com.pramithamj.todo.dto.response.TaskStatistics;
import com.pramithamj.todo.entity.Task;
import com.pramithamj.todo.exception.ResourceNotFoundException;
import com.pramithamj.todo.mapper.TaskMapper;
import com.pramithamj.todo.repository.TaskRepository;
import com.pramithamj.todo.service.ITaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * TaskServiceImpl
 * Service implementation for task business logic
 * Follows layered architecture: Controller -> Service -> Repository
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements ITaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    /**
     * Create a new task
     */
    @Override
    public TaskResponse createTask(CreateTaskRequest request, UUID userId) {
        log.debug("Creating task for user: {}", userId);

        Task task = Task.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .status("PENDING")
                .build();

        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully: {}", savedTask.getId());
        
        return taskMapper.toResponse(savedTask);
    }

    /**
     * Get all tasks for a user
     */
    @Override
    public List<TaskResponse> getAllTasksForUser(UUID userId) {
        log.debug("Fetching all tasks for user: {}", userId);
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Task> tasks = taskRepository.findByUserId(userId, pageable);
        return tasks.stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get task by ID
     */
    @Override
    public TaskResponse getTaskById(UUID taskId, UUID userId) {
        log.debug("Fetching task {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        return taskMapper.toResponse(task);
    }

    /**
     * Get task entity by ID
     */
    @Override
    public Task getTaskEntityById(UUID taskId, UUID userId) {
        return taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    /**
     * Update existing task
     */
    @Override
    public TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, UUID userId) {
        log.debug("Updating task {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        // Update fields
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        
        Task updatedTask = taskRepository.save(task);
        log.info("Task updated successfully: {}", taskId);
        
        return taskMapper.toResponse(updatedTask);
    }

    /**
     * Delete task
     */
    @Override
    public void deleteTask(UUID taskId, UUID userId) {
        log.debug("Deleting task {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        taskRepository.delete(task);
        log.info("Task deleted successfully: {}", taskId);
    }

    /**
     * Get tasks by status
     */
    @Override
    public List<TaskResponse> getTasksByStatus(String status, UUID userId) {
        log.debug("Fetching tasks with status {} for user: {}", status, userId);
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Task> tasks;
        if ("PENDING".equals(status)) {
            tasks = taskRepository.findPendingTasksByUserId(userId, pageable);
        } else if ("COMPLETED".equals(status)) {
            tasks = taskRepository.findCompletedTasksByUserId(userId, pageable);
        } else {
            tasks = taskRepository.findByUserId(userId, pageable);
        }
        return tasks.stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Count tasks by status
     */
    @Override
    public long countTasksByStatus(String status, UUID userId) {
        return taskRepository.countByUserIdAndStatus(userId, status);
    }

    /**
     * Mark task as completed
     */
    @Override
    public TaskResponse markAsCompleted(UUID taskId, UUID userId) {
        log.debug("Completing task {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        task.setStatus("COMPLETED");
        task.setCompletedAt(LocalDateTime.now());
        
        Task completedTask = taskRepository.save(task);
        log.info("Task completed successfully: {}", taskId);
        
        return taskMapper.toResponse(completedTask);
    }

    /**
     * Get recent 5 tasks for user
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getRecent5Tasks(UUID userId) {
        log.debug("Fetching recent 5 tasks for user: {}", userId);
        
        List<Task> tasks = taskRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);
        return tasks.stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all tasks for user with pagination
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasks(UUID userId, int page, int size) {
        log.debug("Fetching all tasks for user: {} (page: {}, size: {})", userId, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Task> tasks = taskRepository.findByUserId(userId, pageable);
        
        return tasks.map(taskMapper::toResponse);
    }

    /**
     * Get pending tasks for user with pagination
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> getPendingTasks(UUID userId, int page, int size) {
        log.debug("Fetching pending tasks for user: {}", userId);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Task> tasks = taskRepository.findPendingTasksByUserId(userId, pageable);
        
        return tasks.map(taskMapper::toResponse);
    }

    /**
     * Get completed tasks for user with pagination
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> getCompletedTasks(UUID userId, int page, int size) {
        log.debug("Fetching completed tasks for user: {}", userId);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "completedAt"));
        Page<Task> tasks = taskRepository.findCompletedTasksByUserId(userId, pageable);
        
        return tasks.map(taskMapper::toResponse);
    }

    /**
     * Complete task (internal)
     */
    public TaskResponse completeTask(UUID userId, UUID taskId) {
        log.debug("Completing task {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        task.setStatus("COMPLETED");
        task.setCompletedAt(LocalDateTime.now());
        
        Task completedTask = taskRepository.save(task);
        log.info("Task completed successfully: {}", taskId);
        
        return taskMapper.toResponse(completedTask);
    }

    /**
     * Reopen task
     */
    public TaskResponse reopenTask(UUID userId, UUID taskId) {
        log.debug("Reopening task {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        task.setStatus("PENDING");
        task.setCompletedAt(null);
        
        Task reopenedTask = taskRepository.save(task);
        log.info("Task reopened successfully: {}", taskId);
        
        return taskMapper.toResponse(reopenedTask);
    }

    /**
     * Search tasks
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> searchTasks(UUID userId, String query, int page, int size) {
        log.debug("Searching tasks for user {} with query: {}", userId, query);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Task> tasks = taskRepository.searchTasks(userId, query, pageable);
        
        return tasks.map(taskMapper::toResponse);
    }

    /**
     * Get task statistics
     */
    @Transactional(readOnly = true)
    public TaskStatistics getTaskStatistics(UUID userId) {
        log.debug("Fetching task statistics for user: {}", userId);
        
        long totalTasks = taskRepository.countByUserId(userId);
        long pendingTasks = taskRepository.countByUserIdAndStatus(userId, "PENDING");
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, "COMPLETED");
        
        return TaskStatistics.builder()
                .total(totalTasks)
                .pending(pendingTasks)
                .completed(completedTasks)
                .build();
    }
}
