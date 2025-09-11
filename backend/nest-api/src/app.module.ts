import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { dataSourceOptions } from '../ormconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DocumentsModule } from './documents/documents.module';
import { FileUpload } from 'graphql-upload-ts';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot(dataSourceOptions),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGO_USER')}:${configService.get('MONGO_PASSWORD')}@localhost:27017/${configService.get('MONGO_DB_NAME')}`,
        authSource: 'admin',
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      playground: true,
    }),

    UsersModule,

    AuthModule,

    TransactionsModule,

    CategoriesModule,

    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// npx ts-node -P ./tsconfig.json --files ./node_modules/typeorm/cli.js -d ./ormconfig.ts migration:generate ./src/migrations/RemoveCounterPartiesEntinity
// npm run migration:run
