import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':email')
  async findOneByEmail(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findOneByEmail(email);
  }

  @Get('one/:id')
  async userDetails(@Param('id') id: string): Promise<User | null> {
    return this.usersService.userDetails(+id);
  }
}
