import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('categories')
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [String], { nullable: 'items' })
  @Column('text', { array: true, default: '{}' })
  keywords: string[];

  @Field(() => [Transaction], { nullable: 'itemsAndList' })
  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @Field(() => User)
  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
