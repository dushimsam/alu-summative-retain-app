import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Expense } from '../expenses/expense.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Category) private categories: Repository<Category>,
    @InjectRepository(Expense) private expenses: Repository<Expense>,
  ) {}

  async insights() {
    const month = new Date().toISOString().slice(0, 7);

    const totalUsers = await this.users.count();
    const totalExpenses = await this.expenses.count();

    const valueRow = await this.expenses
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.amount), 0)', 'total')
      .getRawOne();

    const expensesThisMonth = await this.expenses
      .createQueryBuilder('e')
      .where("to_char(e.spent_on, 'YYYY-MM') = :month", { month })
      .getCount();

    const spendingPerCategory = await this.expenses
      .createQueryBuilder('e')
      .leftJoin('e.category', 'c')
      .select("COALESCE(c.name, 'Uncategorized')", 'category')
      .addSelect('COALESCE(SUM(e.amount), 0)', 'total')
      .groupBy('c.name')
      .orderBy('total', 'DESC')
      .getRawMany();

    const usage = await this.categories
      .createQueryBuilder('c')
      .leftJoin(Expense, 'e', 'e.category_id = c.id')
      .select('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('COUNT(e.id)', 'uses')
      .groupBy('c.id')
      .orderBy('uses', 'DESC')
      .getRawMany();
    const usageRows = usage.map((row) => ({ ...row, uses: Number(row.uses) }));

    const recentExpenses = await this.expenses.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: { user: true },
    });

    const recentUsers = await this.users.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalUsers,
      totalExpenses,
      totalExpenseValue: parseFloat(valueRow.total),
      expensesThisMonth,
      spendingPerCategory: spendingPerCategory.map((row) => ({
        category: row.category,
        total: parseFloat(row.total),
      })),
      topCategories: usageRows.slice(0, 5),
      bottomCategories: usageRows.slice().reverse().slice(0, 5),
      recentExpenses: recentExpenses.map((e) => ({
        ...e,
        user: e.user ? { id: e.user.id, name: e.user.name } : null,
      })),
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    };
  }
}
