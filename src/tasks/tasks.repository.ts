// task.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return this.save(task);
  }

  async getTasks(): Promise<Task[]> {
    return this.find();
  }

  async findById(id: string): Promise<Task> {
    const found = await this.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);
    return found;
  }

  async deleteTask(id: string): Promise<void> {
    await this.delete(id);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task) return null;

    task.status = status;
    return this.save(task);
  }
}
