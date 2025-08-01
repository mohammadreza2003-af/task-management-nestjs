import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskWithFilterDto } from './dto/get-task-filter..dto';

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

  async findTaskById(id: string): Promise<Task> {
    const task = await this.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    await this.delete(id);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    task.status = status;
    return this.save(task);
  }

  async getTaskWithFilter(filterDto: GetTaskWithFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  }
}
