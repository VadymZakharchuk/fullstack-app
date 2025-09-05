import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;
    try {
      console.log(pass, user.password);
      const isPasswordValid = await bcrypt.compare(pass, user.password);

      if (isPasswordValid) {
        const { ...result } = user;
        return result;
      } else {
        return null;
      }
    } catch (e) {
      console.error('Password compare error', e);
      return null;
    }
  }

  login(user: UserDto) {
    const payload = { email: user.email, sub: user.id };
    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(body: LoginDto): Promise<UserDto | string> {
    const { password, ...userData } = body;
    const dbUser = await this.usersService.findOneByEmail(body.email);
    if (dbUser) {
      return `Can't create new account. Account with email ${body.email} already exists`;
    }
    const user = await this.usersService.create({
      ...userData,
      password: password,
    });
    const { ...result } = user;
    return result;
  }
}
