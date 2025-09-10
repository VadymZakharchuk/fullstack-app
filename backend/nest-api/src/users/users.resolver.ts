import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserCreateGraphql } from './dto/user-create.graphql.dto';
import { UserUpdateGraphql } from './dto/user-update.graphql.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async getUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User | null> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(
    @Args('createUserInput') createUserInput: UserCreateGraphql,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UserUpdateGraphql,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
