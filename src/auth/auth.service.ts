import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { } // eslint-disable-line

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user = await this.userService.findUser({ email: data.email });

    const isValidPassword = compareSync(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const token = await this.jwtToken(user);

    return {
      user,
      token,
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = { username: user.name, sub: user.id };
    return this.jwtService.signAsync(payload);
  }
}
