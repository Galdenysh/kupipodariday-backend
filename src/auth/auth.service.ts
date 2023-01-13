import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_NOT_FOUND } from 'src/config/errors';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { comparePass } from 'src/utils/hashPass';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const isMatch = await comparePass(password, user.password);

    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
