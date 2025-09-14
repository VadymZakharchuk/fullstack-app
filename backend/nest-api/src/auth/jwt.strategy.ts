import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    const secretKey = configService.get<string>('SECRET_KEY');
    if (!secretKey) {
      throw new Error('SECRET_REFRESH_KEY is missed in config');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.usersService.findOneById(payload.sub as number);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
