import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Category } from '../categories/category.entity';
import { categoryInitialData } from './users.categories-initial-data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    const createdUser = await this.usersRepository.save(newUser);

    await this.createDefaultCategories(createdUser);

    return createdUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password'],
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private async createDefaultCategories(user: User): Promise<void> {
    const categoriesToCreate = categoryInitialData.map((data) => ({
      ...data,
      user,
    }));

    await this.categoriesRepository.save(categoriesToCreate);
  }
}
