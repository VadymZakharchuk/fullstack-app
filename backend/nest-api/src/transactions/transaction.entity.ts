// src/transactions/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
@Index(['user', 'bankName', 'fingerprint'], { unique: true })
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'timestamp' })
  date: Date;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field()
  @Column()
  type: 'income' | 'expense';

  @Field({ nullable: true })
  @Column({ nullable: true })
  fingerprint: string;

  @Field()
  @Column()
  bankName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  documentId: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
