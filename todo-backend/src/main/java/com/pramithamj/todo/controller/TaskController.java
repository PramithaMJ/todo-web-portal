package com.pramithamj.todo.controller;

import com.pramithamj.todo.dto.request.CreateTaskRequest;
import com.pramithamj.todo.dto.request.UpdateTaskRequest;
import com.pramithamj.todo.dto.response.TaskResponse;
import com.pramithamj.todo.dto.response.TaskStatistics;
import com.pramithamj.todo.security.CurrentUser;
import com.pramithamj.todo.security.UserPrincipal;
import com.pramithamj.todo.service.ITaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * TaskController
 * REST API endpoints for task management
 */
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tasks", description = "Task management APIs")
@PreAuthorize("isAuthenticated()")
public class TaskController {

    private final ITaskService taskService;

    @PostMapping
    @Operation(summary = "Create a new task", description = "Create a new task for the authenticated user")
    public ResponseEntity<TaskResponse> createTask(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestBody CreateTaskRequest request) {
        log.info("Create task request for user: {}", currentUser.getId());
        TaskResponse response = taskService.createTask(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent tasks", description = "Get the 5 most recent tasks for the authenticated user")
    public ResponseEntity<List<TaskResponse>> getRecentTasks(@CurrentUser UserPrincipal currentUser) {
        log.info("Get recent tasks request for user: {}", currentUser.getId());
        List<TaskResponse> tasks = taskService.getRecent5Tasks(currentUser.getId());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping
    @Operation(summary = "Get all tasks", description = "Get all tasks for the authenticated user with pagination")
    public ResponseEntity<Page<TaskResponse>> getAllTasks(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Get all tasks request for user: {} (page: {}, size: {})", currentUser.getId(), page, size);
        Page<TaskResponse> tasks = taskService.getAllTasks(currentUser.getId(), page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending tasks", description = "Get all pending tasks for the authenticated user")
    public ResponseEntity<Page<TaskResponse>> getPendingTasks(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Get pending tasks request for user: {}", currentUser.getId());
        Page<TaskResponse> tasks = taskService.getPendingTasks(currentUser.getId(), page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/completed")
    @Operation(summary = "Get completed tasks", description = "Get all completed tasks for the authenticated user")
    public ResponseEntity<Page<TaskResponse>> getCompletedTasks(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Get completed tasks request for user: {}", currentUser.getId());
        Page<TaskResponse> tasks = taskService.getCompletedTasks(currentUser.getId(), page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Get a specific task by ID for the authenticated user")
    public ResponseEntity<TaskResponse> getTaskById(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable UUID id) {
        log.info("Get task {} request for user: {}", id, currentUser.getId());
        TaskResponse task = taskService.getTaskById(id, currentUser.getId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Update an existing task for the authenticated user")
    public ResponseEntity<TaskResponse> updateTask(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskRequest request) {
        log.info("Update task {} request for user: {}", id, currentUser.getId());
        TaskResponse task = taskService.updateTask(id, request, currentUser.getId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Complete task", description = "Mark a task as completed for the authenticated user")
    public ResponseEntity<TaskResponse> completeTask(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable UUID id) {
        log.info("Complete task {} request for user: {}", id, currentUser.getId());
        TaskResponse task = taskService.markAsCompleted(id, currentUser.getId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}/reopen")
    @Operation(summary = "Reopen task", description = "Reopen a completed task for the authenticated user")
    public ResponseEntity<TaskResponse> reopenTask(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable UUID id) {
        log.info("Reopen task {} request for user: {}", id, currentUser.getId());
        TaskResponse task = taskService.reopenTask(currentUser.getId(), id);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Delete a task for the authenticated user")
    public ResponseEntity<Void> deleteTask(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable UUID id) {
        log.info("Delete task {} request for user: {}", id, currentUser.getId());
        taskService.deleteTask(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search tasks", description = "Search tasks by keyword for the authenticated user")
    public ResponseEntity<Page<TaskResponse>> searchTasks(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Search tasks request for user: {} with query: {}", currentUser.getId(), query);
        Page<TaskResponse> tasks = taskService.searchTasks(currentUser.getId(), query, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get task statistics", description = "Get task statistics for the authenticated user")
    public ResponseEntity<TaskStatistics> getTaskStatistics(@CurrentUser UserPrincipal currentUser) {
        log.info("Get task statistics request for user: {}", currentUser.getId());
        TaskStatistics statistics = taskService.getTaskStatistics(currentUser.getId());
        return ResponseEntity.ok(statistics);
    }
}
