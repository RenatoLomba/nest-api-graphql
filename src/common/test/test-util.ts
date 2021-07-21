import { User } from '../../user/user.entity';

export class TestUtil {
  static getValidUser(): User {
    const user = new User();
    user.email = 'test_valid@email.com';
    user.name = 'Test Valid';
    user.id = '1';
    return user;
  }
}
