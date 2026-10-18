import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Expense } from '../expenses/expense.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Expense])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
