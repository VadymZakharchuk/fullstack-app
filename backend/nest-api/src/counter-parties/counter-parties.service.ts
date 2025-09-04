import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounterParty } from './counter-party.entity';
import { CreateCounterPartyDto } from './dto/create-counter-party.dto';
import { UpdateCounterPartyDto } from './dto/update-counter-party.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CounterPartiesService {
  constructor(
    @InjectRepository(CounterParty)
    private counterPartiesRepository: Repository<CounterParty>,
  ) {}

  // Create a new counter party
  async create(
    createCounterPartyDto: CreateCounterPartyDto,
    user: User,
  ): Promise<CounterParty> {
    const counterParty = this.counterPartiesRepository.create({
      ...createCounterPartyDto,
      user,
    });
    return this.counterPartiesRepository.save(counterParty);
  }

  // Get all counter parties for the current user
  async findAll(user: User): Promise<CounterParty[]> {
    return this.counterPartiesRepository.find({
      where: { user: { id: user.id } },
    });
  }

  // Find a single counter party by ID and user
  async findOne(id: number, user: User): Promise<CounterParty> {
    const counterParty = await this.counterPartiesRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!counterParty) {
      throw new NotFoundException(`Counter party with ID ${id} not found.`);
    }
    return counterParty;
  }

  // Update a counter party
  async update(
    id: number,
    updateCounterPartyDto: UpdateCounterPartyDto,
    user: User,
  ): Promise<CounterParty> {
    const counterParty = await this.findOne(id, user);
    Object.assign(counterParty, updateCounterPartyDto);
    return this.counterPartiesRepository.save(counterParty);
  }

  // Delete a counter party
  async remove(id: number, user: User): Promise<void> {
    const counterParty = await this.findOne(id, user);
    await this.counterPartiesRepository.remove(counterParty);
  }
}
