// src/counter-parties/counter-party.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity('counter_parties')
export class CounterParty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, name: 'e_mail' })
  eMail: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  person: string;

  @Column('jsonb', { nullable: true })
  messengers: {
    whatsApp?: string;
    telegram?: string;
    viber?: string;
  };

  @ManyToOne(() => User, (user) => user.counterParties)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.counterParty)
  transactions: Transaction[];
}
