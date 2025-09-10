import { InputType, Field, PartialType } from '@nestjs/graphql';
import { UserCreateGraphql } from './user-create.graphql.dto';
import { IsNumber } from 'class-validator';

@InputType()
export class UserUpdateGraphql extends PartialType(UserCreateGraphql) {
  @IsNumber()
  @Field()
  id: number;
}
