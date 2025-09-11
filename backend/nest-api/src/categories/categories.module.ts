import { forwardRef, Module } from '@nestjs/common';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => UsersModule),
  ],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
