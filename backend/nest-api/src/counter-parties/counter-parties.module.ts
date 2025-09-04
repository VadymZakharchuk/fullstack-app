import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounterPartiesController } from './counter-parties.controller';
import { CounterPartiesService } from './counter-parties.service';
import { CounterParty } from './counter-party.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CounterParty]),
    forwardRef(() => UsersModule),
  ],
  controllers: [CounterPartiesController],
  providers: [CounterPartiesService],
  exports: [CounterPartiesService],
})
export class CounterPartiesModule {}
