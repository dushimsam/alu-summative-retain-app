import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpenseDto } from './dto/query-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private expenses: Repository<Expense>,
  ) {}

  async findAll(userId: number, query: QueryExpenseDto) {
    const qb = this.expenses
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.category', 'category')
      .where('e.userId = :userId', { userId });

    if (query.search) {
      qb.andWhere('(e.title ILIKE :search OR e.notes ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }
    if (query.category) {
      qb.andWhere('e.categoryId = :category', { category: query.category });
    }
    if (query.paymentMethod) {
      qb.andWhere('e.paymentMethod = :pm', { pm: query.paymentMethod });
    }
    if (query.startDate) {
      qb.andWhere('e.spentOn >= :start', { start: query.startDate });
    }
    if (query.endDate) {
      qb.andWhere('e.spentOn <= :end', { end: query.endDate });
    }
    if (query.minAmount) {
      qb.andWhere('e.amount >= :min', { min: query.minAmount });
    }
    if (query.maxAmount) {
      qb.andWhere('e.amount <= :max', { max: query.maxAmount });
    }

    const sortColumn = query.sortBy === 'amount' ? 'e.amount' : 'e.spentOn';
    const sortOrder = query.order === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy(sortColumn, sortOrder).addOrderBy('e.id', 'DESC');

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async findOne(userId: number, id: number) {
    const expense = await this.expenses.findOne({ where: { id, userId } });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async create(userId: number, dto: CreateExpenseDto) {
    const expense = this.expenses.create({
      userId,
      title: dto.title,
      amount: dto.amount,
      categoryId: dto.categoryId ?? null,
      spentOn: dto.spentOn,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes ?? null,
    });
    const saved = await this.expenses.save(expense);
    return this.findOne(userId, saved.id);
  }

  async update(userId: number, id: number, dto: UpdateExpenseDto) {
    const expense = await this.findOne(userId, id);
    Object.assign(expense, dto);
    await this.expenses.save(expense);
    return this.findOne(userId, id);
  }

  async remove(userId: number, id: number) {
    const expense = await this.findOne(userId, id);
    await this.expenses.remove(expense);
    return { message: 'Expense deleted' };
  }
}
