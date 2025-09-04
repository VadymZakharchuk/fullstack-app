import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Transaction as UserTransaction } from '../transactions/transaction.entity';
import bcrypt from 'bcryptjs';
import { CounterParty } from '../counter-parties/counter-party.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => UserTransaction, (transaction) => transaction.user)
  transactions: UserTransaction[];

  @OneToMany(() => CounterParty, (counterParty) => counterParty.user)
  counterParties: CounterParty[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
