import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { User } from '../users/user.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryInput: CreateCategoryInput,
    user: User,
  ): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...createCategoryInput,
      user,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(user: User): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: number, user: User): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryInput: UpdateCategoryInput,
    user: User,
  ): Promise<Category> {
    const category = await this.findOne(id, user);
    Object.assign(category, updateCategoryInput);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number, user: User): Promise<void> {
    const category = await this.findOne(id, user);
    await this.categoriesRepository.remove(category);
  }
}
