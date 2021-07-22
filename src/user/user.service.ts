import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { QueryUserInput } from './dto/query-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { } // eslint-disable-line

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findUser(query: QueryUserInput): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { ...query },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(data);
    const userCreated = await this.userRepository.save(user);

    if (!userCreated) {
      throw new InternalServerErrorException('Erro interno ao criar usuário');
    }

    return userCreated;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.findUserById(id);
    const updateResult = await this.userRepository.update(user, { ...data });

    if (!updateResult) {
      throw new InternalServerErrorException(
        'Erro interno ao atualizar usuário',
      );
    }

    const userUpdated = this.userRepository.create({ ...user, ...data });

    return userUpdated;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.findUserById(id);
    const deleteResult = await this.userRepository.delete(user);

    if (!deleteResult) {
      throw new InternalServerErrorException('Erro interno ao deletar usuário');
    }

    return user;
  }
}
