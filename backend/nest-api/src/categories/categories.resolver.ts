import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { User } from '../users/user.entity';
import { GqlUser } from '../common/gql-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Category)
@UseGuards(GqlAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category])
  async categories(@GqlUser() user: User): Promise<Category[]> {
    return this.categoriesService.findAll(user);
  }

  @Query(() => Category)
  async category(
    @Args('id', { type: () => ID }) id: number,
    @GqlUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.findOne(id, user);
  }

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @GqlUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryInput, user);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
    @GqlUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryInput, user);
  }

  @Mutation(() => ID)
  async removeCategory(
    @Args('id', { type: () => ID }) id: number,
    @GqlUser() user: User,
  ): Promise<number> {
    await this.categoriesService.remove(id, user);
    return id;
  }
}
