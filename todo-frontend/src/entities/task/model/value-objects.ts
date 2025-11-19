/**
 * Task Value Objects
 * Immutable value objects with validation logic
 */

import { isEmpty, isLengthValid } from '../../../shared/lib/utils/validators';
import type { TaskPriority } from './types';

/**
 * Task Title value object
 */
export class TaskTitle {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 200;
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(title: string): TaskTitle {
    const trimmed = title.trim();

    if (isEmpty(trimmed)) {
      throw new Error('Task title cannot be empty');
    }

    if (!isLengthValid(trimmed, TaskTitle.MIN_LENGTH, TaskTitle.MAX_LENGTH)) {
      throw new Error(
        `Task title must be between ${TaskTitle.MIN_LENGTH} and ${TaskTitle.MAX_LENGTH} characters`
      );
    }

    return new TaskTitle(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }
}

/**
 * Task Description value object
 */
export class TaskDescription {
  private static readonly MAX_LENGTH = 2000;
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(description: string): TaskDescription {
    const trimmed = description.trim();

    if (!isLengthValid(trimmed, 0, TaskDescription.MAX_LENGTH)) {
      throw new Error(`Task description must not exceed ${TaskDescription.MAX_LENGTH} characters`);
    }

    return new TaskDescription(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  equals(other: TaskDescription): boolean {
    return this.value === other.value;
  }
}

/**
 * Task Priority value object
 */
export class TaskPriorityVO {
  private static readonly VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
  private readonly value: TaskPriority;

  private constructor(value: TaskPriority) {
    this.value = value;
  }

  static create(priority: TaskPriority): TaskPriorityVO {
    if (!TaskPriorityVO.VALID_PRIORITIES.includes(priority)) {
      throw new Error(`Invalid task priority: ${priority}`);
    }

    return new TaskPriorityVO(priority);
  }

  getValue(): TaskPriority {
    return this.value;
  }

  isHigh(): boolean {
    return this.value === 'high';
  }

  isMedium(): boolean {
    return this.value === 'medium';
  }

  isLow(): boolean {
    return this.value === 'low';
  }

  equals(other: TaskPriorityVO): boolean {
    return this.value === other.value;
  }

  /**
   * Returns numeric weight for sorting
   */
  getWeight(): number {
    const weights: Record<TaskPriority, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    return weights[this.value];
  }
}
