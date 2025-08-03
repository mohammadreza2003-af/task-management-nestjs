import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskWithFilterDto } from './dto/get-task-filter..dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    return this.save(task);
  }

  async getTasks(filterDto: GetTaskWithFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
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

  async findTaskById(id: string, user: User): Promise<Task> {
    const task = await this.findOne({ where: { id, user } });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.findOne({ where: { id, user } });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    await this.delete(id);
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne({ where: { id, user } });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    task.status = status;
    return this.save(task);
  }
}
