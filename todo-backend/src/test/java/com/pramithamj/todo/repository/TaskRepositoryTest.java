package com.pramithamj.todo.repository;

import com.pramithamj.todo.entity.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Repository layer tests using @DataJpaTest
 * Tests database operations without full Spring context
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@DisplayName("TaskRepository Integration Tests")
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TestEntityManager entityManager;

    private UUID userId;
    private Task task1;
    private Task task2;
    private Task task3;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        task1 = Task.builder()
                .userId(userId)
                .title("Task 1")
                .description("Description 1")
                .status("PENDING")
                .createdAt(LocalDateTime.now().minusDays(3))
                .updatedAt(LocalDateTime.now())
                .build();

        task2 = Task.builder()
                .userId(userId)
                .title("Task 2")
                .description("Description 2")
                .status("COMPLETED")
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();

        task3 = Task.builder()
                .userId(userId)
                .title("Task 3")
                .description("Description 3")
                .status("PENDING")
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should save and retrieve task")
    void shouldSaveAndRetrieveTask() {
        // When
        Task saved = taskRepository.save(task1);
        entityManager.flush();
        Optional<Task> found = taskRepository.findById(saved.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Task 1");
        assertThat(found.get().getStatus()).isEqualTo("PENDING");
    }

    @Test
    @DisplayName("Should find tasks by userId")
    void shouldFindTasksByUserId() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        Page<Task> result = taskRepository.findByUserId(userId, PageRequest.of(0, 10));

        // Then
        assertThat(result.getContent()).hasSize(3);
    }

    @Test
    @DisplayName("Should find task by ID and userId")
    void shouldFindByIdAndUserId() {
        // Given
        Task saved = taskRepository.save(task1);
        entityManager.flush();

        // When
        Optional<Task> found = taskRepository.findByIdAndUserId(saved.getId(), userId);

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getUserId()).isEqualTo(userId);
    }

    @Test
    @DisplayName("Should not find task for different user")
    void shouldNotFindTaskForDifferentUser() {
        // Given
        Task saved = taskRepository.save(task1);
        entityManager.flush();
        UUID differentUserId = UUID.randomUUID();

        // When
        Optional<Task> found = taskRepository.findByIdAndUserId(saved.getId(), differentUserId);

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should find pending tasks")
    void shouldFindPendingTasks() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        Page<Task> result = taskRepository.findPendingTasksByUserId(userId, PageRequest.of(0, 10));

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).allMatch(t -> t.getStatus().equals("PENDING"));
    }

    @Test
    @DisplayName("Should find completed tasks")
    void shouldFindCompletedTasks() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        Page<Task> result = taskRepository.findCompletedTasksByUserId(userId, PageRequest.of(0, 10));

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    @DisplayName("Should find recent 5 tasks ordered by creation date")
    void shouldFindRecent5Tasks() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        List<Task> result = taskRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);

        // Then
        assertThat(result).hasSize(3);
        assertThat(result.get(0).getTitle()).isEqualTo("Task 3"); // Most recent
    }

    @Test
    @DisplayName("Should search tasks by title")
    void shouldSearchTasksByTitle() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        Page<Task> result = taskRepository.searchTasks(userId, "Task 2", PageRequest.of(0, 10));

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Task 2");
    }

    @Test
    @DisplayName("Should search tasks by description")
    void shouldSearchTasksByDescription() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        Page<Task> result = taskRepository.searchTasks(userId, "Description 1", PageRequest.of(0, 10));

        // Then
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Should count tasks by userId")
    void shouldCountTasksByUserId() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        long count = taskRepository.countByUserId(userId);

        // Then
        assertThat(count).isEqualTo(3);
    }

    @Test
    @DisplayName("Should count tasks by userId and status")
    void shouldCountTasksByUserIdAndStatus() {
        // Given
        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);
        entityManager.flush();

        // When
        long pendingCount = taskRepository.countByUserIdAndStatus(userId, "PENDING");
        long completedCount = taskRepository.countByUserIdAndStatus(userId, "COMPLETED");

        // Then
        assertThat(pendingCount).isEqualTo(2);
        assertThat(completedCount).isEqualTo(1);
    }

    @Test
    @DisplayName("Should update task")
    void shouldUpdateTask() {
        // Given
        Task saved = taskRepository.save(task1);
        entityManager.flush();

        // When
        saved.setTitle("Updated Title");
        saved.setStatus("COMPLETED");
        Task updated = taskRepository.save(saved);
        entityManager.flush();

        // Then
        Optional<Task> found = taskRepository.findById(updated.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Updated Title");
        assertThat(found.get().getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    @DisplayName("Should delete task")
    void shouldDeleteTask() {
        // Given
        Task saved = taskRepository.save(task1);
        entityManager.flush();

        // When
        taskRepository.delete(saved);
        entityManager.flush();

        // Then
        Optional<Task> found = taskRepository.findById(saved.getId());
        assertThat(found).isEmpty();
    }
}
