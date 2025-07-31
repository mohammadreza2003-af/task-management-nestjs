import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskWithFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
  @IsOptional()
  @IsNotEmpty()
  search?: string;
}
