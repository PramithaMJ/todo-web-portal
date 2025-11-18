package com.pramithamj.todo.service;

import com.pramithamj.todo.dto.request.CreateTaskRequest;
import com.pramithamj.todo.dto.request.UpdateTaskRequest;
import com.pramithamj.todo.dto.response.TaskResponse;
import com.pramithamj.todo.dto.response.TaskStatistics;
import com.pramithamj.todo.entity.Task;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

/**
 * ITaskService
 * Service interface for task business logic
 */
public interface ITaskService {

    /**
     * Get all tasks for a user
     */
    List<TaskResponse> getAllTasksForUser(UUID userId);

    /**
     * Get task by ID
     */
    TaskResponse getTaskById(UUID taskId, UUID userId);

    /**
     * Get task entity by ID
     */
    Task getTaskEntityById(UUID taskId, UUID userId);

    /**
     * Create new task
     */
    TaskResponse createTask(CreateTaskRequest request, UUID userId);

    /**
     * Update existing task
     */
    TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, UUID userId);

    /**
     * Delete task
     */
    void deleteTask(UUID taskId, UUID userId);

    /**
     * Get tasks by status
     */
    List<TaskResponse> getTasksByStatus(String status, UUID userId);

    /**
     * Count tasks by status
     */
    long countTasksByStatus(String status, UUID userId);

    /**
     * Mark task as completed
     */
    TaskResponse markAsCompleted(UUID taskId, UUID userId);

    /**
     * Get recent 5 tasks for user
     */
    List<TaskResponse> getRecent5Tasks(UUID userId);

    /**
     * Get all tasks for user with pagination
     */
    Page<TaskResponse> getAllTasks(UUID userId, int page, int size);

    /**
     * Get pending tasks for user with pagination
     */
    Page<TaskResponse> getPendingTasks(UUID userId, int page, int size);

    /**
     * Get completed tasks for user with pagination
     */
    Page<TaskResponse> getCompletedTasks(UUID userId, int page, int size);

    /**
     * Reopen task (mark as pending)
     */
    TaskResponse reopenTask(UUID userId, UUID taskId);

    /**
     * Search tasks by query
     */
    Page<TaskResponse> searchTasks(UUID userId, String query, int page, int size);

    /**
     * Get task statistics for user
     */
    TaskStatistics getTaskStatistics(UUID userId);
}
