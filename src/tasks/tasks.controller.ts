import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskWithFilterDto } from './dto/get-task-filter..dto';
import { UpdateTaskDto } from './dto/update-tast-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getTasks(
    @Query() filterDto: GetTaskWithFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(filterDto, user);
  }
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
  @Put('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
