import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskWithFilterDto } from './dto/get-task-filter..dto';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}
  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getTasks();
  }
  getTaskWithFilter(filterDto: GetTaskWithFilterDto): Promise<Task[]> {
    return this.taskRepository.getTaskWithFilter(filterDto);
  }
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.findTaskById(id);
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.deleteTask(id);
  }
  updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.taskRepository.updateStatus(id, status);
  }
}
