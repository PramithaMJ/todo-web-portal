package com.pramithamj.todo.repository;

import com.pramithamj.todo.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * TaskRepository
 * Repository interface for Task entity following Repository Pattern
 * Interface Segregation Principle - task-specific operations
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    /**
     * Find all tasks by user ID
     */
    Page<Task> findByUserId(UUID userId, Pageable pageable);

    /**
     * Find recent tasks (top 5) by user ID
     */
    List<Task> findTop5ByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Find pending tasks by user ID
     */
    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND t.status = 'PENDING' ORDER BY t.createdAt DESC")
    Page<Task> findPendingTasksByUserId(@Param("userId") UUID userId, Pageable pageable);

    /**
     * Find completed tasks by user ID
     */
    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND t.status = 'COMPLETED' ORDER BY t.completedAt DESC")
    Page<Task> findCompletedTasksByUserId(@Param("userId") UUID userId, Pageable pageable);

    /**
     * Find task by ID and user ID (authorization check)
     */
    Optional<Task> findByIdAndUserId(UUID taskId, UUID userId);

    /**
     * Search tasks by title or description
     */
    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Task> searchTasks(@Param("userId") UUID userId, @Param("query") String query, Pageable pageable);

    /**
     * Count tasks by user ID and status
     * If status is null, counts all tasks for the user
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.userId = :userId AND (:status IS NULL OR t.status = :status)")
    long countByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") String status);

    /**
     * Count all tasks by user ID
     */
    long countByUserId(UUID userId);

    /**
     * Delete all tasks by user ID
     */
    void deleteByUserId(UUID userId);
}
