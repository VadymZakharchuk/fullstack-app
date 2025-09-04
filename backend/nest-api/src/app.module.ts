import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { CounterPartiesModule } from './counter-parties/counter-parties.module';
import { dataSourceOptions } from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot(dataSourceOptions),

    UsersModule,

    AuthModule,

    TransactionsModule,

    CategoriesModule,

    CounterPartiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
