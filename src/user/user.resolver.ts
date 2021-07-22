import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../auth/auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { QueryUserInput } from './dto/query-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) { } // eslint-disable-line

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(): Promise<User[]> {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async user(@Args('query') query: QueryUserInput): Promise<User> {
    const user = await this.userService.findUser(query);
    return user;
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async userById(
    @Args('id') id: string,
    // @CurrentUser() userLogged: User,
  ): Promise<User> {
    // console.log(userLogged);
    const user = await this.userService.findUserById(id);
    return user;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    const user = await this.userService.createUser(data);
    return user;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    const userUpdated = await this.userService.updateUser(id, data);
    return userUpdated;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@Args('id') id: string): Promise<User> {
    const userDeleted = await this.userService.deleteUser(id);
    return userDeleted;
  }
}
