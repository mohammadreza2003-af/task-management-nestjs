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
  getAllTasks(filterDto: GetTaskWithFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  getTaskById(id: string, user: User): Promise<Task> {
    return this.taskRepository.findTaskById(id, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    await this.taskRepository.deleteTask(id, user);
  }
  updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    return this.taskRepository.updateStatus(id, status, user);
  }
}
