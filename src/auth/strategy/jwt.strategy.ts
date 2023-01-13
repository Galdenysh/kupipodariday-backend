import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { USER_UNAUTHORIZED } from 'src/config/errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'secret',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findOne(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException(USER_UNAUTHORIZED);
    }

    return user;
  }
}
