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
import { CounterParty } from '../counter-parties/counter-party.entity';
import { Category } from '../categories/category.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => CounterParty, (counterParty) => counterParty.transactions)
  counterParty: CounterParty;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
