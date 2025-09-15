import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Transaction as UserTransaction } from '../transactions/transaction.entity';
import * as bcrypt from 'bcryptjs';
import { Category } from '../categories/category.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @Field(() => [UserTransaction])
  @OneToMany(() => UserTransaction, (transaction) => transaction.user)
  transactions: UserTransaction[];

  @Field(() => [Category])
  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
