import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'john',
  id: '123',
  password: '123123',
  tasks: [],
};

describe('TaskService', () => {
  let taskService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // initialize nestjs module with service and reporitory
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    taskService = module.get(TasksService);
    tasksRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('somValue');
      const result = await taskService.getAllTasks(null, mockUser);
      expect(result).toEqual('somValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRespository.findOne and returns the result', async () => {
      const mockTasks = {
        title: 'Test',
        description: 'Some des',
        id: '123',
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTasks);

      const result = await taskService.getTaskById(mockTasks.id, mockUser);
      expect(result).toBe(mockTasks);
    });

    it('calls TaskRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('123', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
