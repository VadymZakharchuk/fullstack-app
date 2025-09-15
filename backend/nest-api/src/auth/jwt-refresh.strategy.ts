import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
  };
}

interface Payload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secretOrKey = configService.get<string>('SECRET_REFRESH_KEY');
    if (!secretOrKey) {
      throw new Error('SECRET_REFRESH_KEY is missed in config');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: RequestWithCookies) => {
          return req.cookies?.refreshToken || null;
        },
      ]),
      secretOrKey: secretOrKey,
      passReqToCallback: true,
    });
  }

  async validate(req: RequestWithCookies, payload: Payload) {
    const refreshToken = req.cookies?.refreshToken;
    const user = await this.usersService.findOneById(payload.sub);

    if (!user || !user.hashedRefreshToken || !refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Неправильний токен');
    }

    return user;
  }
}
