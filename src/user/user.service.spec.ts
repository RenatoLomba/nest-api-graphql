import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTestUtils } from '../common/test/user-test-utils';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(async () => {
    mockRepository.create.mockReset();
    mockRepository.delete.mockReset();
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.update.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when search all users', () => {
    it('should list all users', async () => {
      const mockListOfUsers = UserTestUtils.mockListOfUsersResult();
      mockRepository.find.mockReturnValue(mockListOfUsers);
      const users = await service.findAllUsers();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('when search for a user by id', () => {
    it('should find a existing user', async () => {
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      const user = await service.findUserById('Valid Id');
      expect(user).toMatchObject({ email: mockUserResult.email });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should not find a user that not exist', () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findUserById('Invalid Id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('when search a user by query params', () => {
    it('should be able to find user by his id', async () => {
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      const user = await service.findUser({ id: mockUserResult.id });

      expect(user).toMatchObject(mockUserResult);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should be able to find user by his name', async () => {
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      const user = await service.findUser({ name: mockUserResult.name });

      expect(user).toMatchObject(mockUserResult);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should be able to find user by his email', async () => {
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      const user = await service.findUser({ email: mockUserResult.email });

      expect(user).toMatchObject(mockUserResult);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should not find a user that not exist', () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findUser({ id: 'Invalid Id' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('when create user', () => {
    it('should be able to create a user', async () => {
      const mockCreateUserInput = UserTestUtils.mockCreateUserInput();
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.create.mockReturnValue(mockCreateUserInput);
      mockRepository.save.mockReturnValue(mockUserResult);
      const user = await service.createUser(mockCreateUserInput);

      expect(user).toMatchObject({ id: mockUserResult.id });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should not be able to create a user', async () => {
      const mockCreateUserInput = UserTestUtils.mockCreateUserInput();
      mockRepository.create.mockReturnValue(mockCreateUserInput);
      mockRepository.save.mockReturnValue(null);

      await service.createUser(mockCreateUserInput).catch((ex) => {
        expect(ex).toBeInstanceOf(InternalServerErrorException);
        expect(ex).toMatchObject({ message: 'Erro interno ao criar usuário' });
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('when update user', () => {
    it('should be able to update a user', async () => {
      const mockUpdateUserInput = UserTestUtils.mockUpdateUserInput();
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      mockRepository.update.mockReturnValue({ affected: 1 });
      mockRepository.create.mockReturnValue({
        ...mockUserResult,
        ...mockUpdateUserInput,
      });
      const user = await service.updateUser('Valid id', mockUpdateUserInput);

      expect(user).toMatchObject({ ...mockUserResult, ...mockUpdateUserInput });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should be able to update a user', async () => {
      const mockUpdateUserInput = UserTestUtils.mockUpdateUserInput();
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      mockRepository.update.mockReturnValue(null);
      mockRepository.create.mockReturnValue({
        ...mockUserResult,
        ...mockUpdateUserInput,
      });

      await service.updateUser('Valid id', mockUpdateUserInput).catch((ex) => {
        expect(ex).toBeInstanceOf(InternalServerErrorException);
        expect(ex).toMatchObject({
          message: 'Erro interno ao atualizar usuário',
        });
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).not.toHaveBeenCalledTimes(1);
    });
  });

  describe('when delete user', () => {
    it('should be able to delete a existing user', async () => {
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      mockRepository.delete.mockReturnValue({ affected: 1 });
      const deletedUser = await service.deleteUser(mockUserResult.id);

      expect(deletedUser).toMatchObject(mockUserResult);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should not be able to delete a user', async () => {
      const mockUserResult = UserTestUtils.mockUserResult();
      mockRepository.findOne.mockReturnValue(mockUserResult);
      mockRepository.delete.mockReturnValue(null);

      await service.deleteUser(mockUserResult.id).catch((ex) => {
        expect(ex).toBeInstanceOf(InternalServerErrorException);
        expect(ex).toMatchObject({
          message: 'Erro interno ao deletar usuário',
        });
      });
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
