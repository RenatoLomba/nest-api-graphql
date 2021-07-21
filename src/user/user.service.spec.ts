import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../common/test/test-util';
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
      const validUser = TestUtil.getValidUser();
      mockRepository.find.mockReturnValue([validUser, validUser]);
      const users = await service.findAllUsers();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('when search for a user by id', () => {
    it('should find a existing user', async () => {
      const validUser = TestUtil.getValidUser();
      mockRepository.findOne.mockReturnValue(validUser);
      const user = await service.findUserById('Valid Id');
      expect(user).toMatchObject({ email: validUser.email });
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

  describe('when create user', () => {
    it('should be able to create a user', async () => {
      const validUser = TestUtil.getValidUser();
      mockRepository.create.mockReturnValue(validUser);
      mockRepository.save.mockReturnValue(validUser);
      const user = await service.createUser(validUser);
      expect(user).toMatchObject({ id: validUser.id });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should not be able to create a user', async () => {
      const validUser = TestUtil.getValidUser();
      mockRepository.create.mockReturnValue(validUser);
      mockRepository.save.mockReturnValue(null);
      await service.createUser(validUser).catch((ex) => {
        expect(ex).toBeInstanceOf(InternalServerErrorException);
        expect(ex).toMatchObject({ message: 'Erro interno ao criar usuário' });
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('when update user', () => {
    it('should be able to update a user', async () => {
      const validUser = TestUtil.getValidUser();
      const updatedUser = { name: 'Updated name' };
      mockRepository.findOne.mockReturnValue(validUser);
      mockRepository.update.mockReturnValue({ affected: 1 });
      mockRepository.create.mockReturnValue({ ...validUser, ...updatedUser });
      const user = await service.updateUser('Valid id', updatedUser);
      expect(user).toMatchObject({ ...validUser, ...updatedUser });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should be able to update a user', async () => {
      const validUser = TestUtil.getValidUser();
      const updatedUser = { name: 'Updated name' };
      mockRepository.findOne.mockReturnValue(validUser);
      mockRepository.update.mockReturnValue(null);
      mockRepository.create.mockReturnValue({ ...validUser, ...updatedUser });
      await service.updateUser('Valid id', updatedUser).catch((ex) => {
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
      const validUser = TestUtil.getValidUser();
      mockRepository.findOne.mockReturnValue(validUser);
      mockRepository.delete.mockReturnValue({ affected: 1 });
      const deletedUser = await service.deleteUser(validUser.id);
      expect(deletedUser).toMatchObject(validUser);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should not be able to delete a user', async () => {
      const validUser = TestUtil.getValidUser();
      mockRepository.findOne.mockReturnValue(validUser);
      mockRepository.delete.mockReturnValue(null);
      await service.deleteUser(validUser.id).catch((ex) => {
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
