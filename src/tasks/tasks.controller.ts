import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/users.entity';
import { GetUser } from '../auth/get-user-decorator';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
export class TasksController {
  logger = new Logger();
  constructor(
    private tasksService: TasksService,
    private configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(this.configService.get('POSTGRES_HOST'));
    return this.tasksService.getAllTasks(filterDto, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createTasks(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTasks(createTaskDto, user);
  }

  @Delete('/:id')
  @Patch('/:id/status')
  @UseGuards(AuthGuard())
  deleteById(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTasks(id, user);
  }

  @Patch('/:id/status')
  @UseGuards(AuthGuard())
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
