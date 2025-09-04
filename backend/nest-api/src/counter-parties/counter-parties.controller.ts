// src/counter-parties/counter-parties.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CounterPartiesService } from './counter-parties.service';
import { CreateCounterPartyDto } from './dto/create-counter-party.dto';
import { UpdateCounterPartyDto } from './dto/update-counter-party.dto';
import { GetUser } from '../common/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('counter-parties')
@UseGuards(AuthGuard('jwt'))
export class CounterPartiesController {
  constructor(private readonly counterPartiesService: CounterPartiesService) {}

  @Post()
  async create(
    @Body() createCounterPartyDto: CreateCounterPartyDto,
    @GetUser() user: User,
  ) {
    return this.counterPartiesService.create(createCounterPartyDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return this.counterPartiesService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.counterPartiesService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCounterPartyDto: UpdateCounterPartyDto,
    @GetUser() user: User,
  ) {
    return this.counterPartiesService.update(id, updateCounterPartyDto, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.counterPartiesService.remove(id, user);
  }
}
