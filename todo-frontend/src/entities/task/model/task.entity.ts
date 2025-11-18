/**
 * Task Entity
 * Domain model with business logic
 */

import type { Task, TaskId, TaskStatus, TaskPriority } from './types';
import { TaskTitle, TaskDescription, TaskPriorityVO } from './value-objects';

/**
 * Task Entity class with business rules
 */
export class TaskEntity {
  public readonly id: TaskId;
  private title: TaskTitle;
  private description: TaskDescription;
  private status: TaskStatus;
  private priority: TaskPriorityVO;
  public readonly createdAt: Date;
  private updatedAt: Date;
  private completedAt: Date | null;
  public readonly userId: string;

  private constructor(
    id: TaskId,
    title: TaskTitle,
    description: TaskDescription,
    status: TaskStatus,
    priority: TaskPriorityVO,
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date | null,
    userId: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
    this.userId = userId;
  }

  /**
   * Creates a new Task entity from raw data
   */
  static create(data: Task): TaskEntity {
    return new TaskEntity(
      data.id,
      TaskTitle.create(data.title),
      TaskDescription.create(data.description),
      data.status,
      TaskPriorityVO.create(data.priority),
      data.createdAt,
      data.updatedAt,
      data.completedAt,
      data.userId
    );
  }

  /**
   * Updates task title
   */
  updateTitle(newTitle: string): void {
    this.title = TaskTitle.create(newTitle);
    this.touch();
  }

  /**
   * Updates task description
   */
  updateDescription(newDescription: string): void {
    this.description = TaskDescription.create(newDescription);
    this.touch();
  }

  /**
   * Updates task priority
   */
  updatePriority(newPriority: TaskPriority): void {
    this.priority = TaskPriorityVO.create(newPriority);
    this.touch();
  }

  /**
   * Marks task as completed
   */
  complete(): void {
    if (this.isCompleted()) {
      throw new Error('Task is already completed');
    }

    this.status = 'completed';
    this.completedAt = new Date();
    this.touch();
  }

  /**
   * Marks task as pending
   */
  uncomplete(): void {
    if (!this.isCompleted()) {
      throw new Error('Task is not completed');
    }

    this.status = 'pending';
    this.completedAt = null;
    this.touch();
  }

  /**
   * Checks if task is completed
   */
  isCompleted(): boolean {
    return this.status === 'completed';
  }

  /**
   * Checks if task is pending
   */
  isPending(): boolean {
    return this.status === 'pending';
  }

  /**
   * Checks if task is high priority
   */
  isHighPriority(): boolean {
    return this.priority.isHigh();
  }

  /**
   * Gets task title as string
   */
  getTitle(): string {
    return this.title.getValue();
  }

  /**
   * Gets task description as string
   */
  getDescription(): string {
    return this.description.getValue();
  }

  /**
   * Gets task priority
   */
  getPriority(): TaskPriority {
    return this.priority.getValue();
  }

  /**
   * Gets task status
   */
  getStatus(): TaskStatus {
    return this.status;
  }

  /**
   * Gets completed at timestamp
   */
  getCompletedAt(): Date | null {
    return this.completedAt;
  }

  /**
   * Gets updated at timestamp
   */
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Converts entity to plain object
   */
  toPlainObject(): Task {
    return {
      id: this.id,
      title: this.title.getValue(),
      description: this.description.getValue(),
      status: this.status,
      priority: this.priority.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      completedAt: this.completedAt,
      userId: this.userId,
    };
  }

  /**
   * Updates the updatedAt timestamp
   */
  private touch(): void {
    this.updatedAt = new Date();
  }
}
