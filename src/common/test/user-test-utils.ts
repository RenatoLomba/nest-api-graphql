import { User } from '../../user/user.entity';
import { CreateUserInput } from '../../user/dto/create-user.input';
import { UpdateUserInput } from '../../user/dto/update-user.input';

export abstract class UserTestUtils {
  static mockCreateUserInput(): CreateUserInput {
    return {
      email: 'test_valid@email.com',
      name: 'Test Valid',
      password: 'testvalid123',
    };
  }

  static mockUpdateUserInput(): UpdateUserInput {
    return {
      email: 'updated@email.com',
      name: 'Test Updated',
      password: 'testupdated123',
    };
  }

  static mockUserResult(): User {
    return {
      id: '1',
      email: 'test_valid@email.com',
      name: 'Test Valid',
      password: 'testvalid123',
    };
  }

  static mockListOfUsersResult(): User[] {
    return [
      {
        id: '1',
        email: 'test_valid@email.com',
        name: 'Test Valid',
        password: 'testvalid123',
      },
      {
        id: '2',
        email: 'test_valid2@gmail.com',
        name: 'Test Valid 2',
        password: 'testvalid2',
      },
    ];
  }
}
