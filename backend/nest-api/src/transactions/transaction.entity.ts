// src/transactions/transaction.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('transactions')
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;

  @Field()
  @Column({ type: 'date' })
  date: Date;

  @Field()
  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column({ nullable: true })
  documentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
