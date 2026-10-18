import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expenses/expense.entity';
import { Budget } from '../budgets/budget.entity';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function budgetStatus(spent: number, budget: number | null) {
  if (budget == null) return 'no-budget';
  if (spent > budget) return 'over';
  if (spent >= budget * 0.8) return 'approaching';
  return 'within';
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Expense) private expenses: Repository<Expense>,
    @InjectRepository(Budget) private budgets: Repository<Budget>,
  ) {}

  async summary(userId: number, month?: string) {
    const target = month || currentMonth();

    const totals = await this.expenses
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.amount), 0)', 'total')
      .where('e.user_id = :userId', { userId })
      .andWhere("to_char(e.spent_on, 'YYYY-MM') = :month", { month: target })
      .getRawOne();
    const totalSpent = parseFloat(totals.total);

    const budgetRow = await this.budgets.findOne({
      where: { userId, month: target },
    });
    const budget = budgetRow ? budgetRow.amount : null;

    const highestExpense = await this.expenses
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.category', 'category')
      .where('e.user_id = :userId', { userId })
      .andWhere("to_char(e.spent_on, 'YYYY-MM') = :month", { month: target })
      .orderBy('e.amount', 'DESC')
      .getOne();

    const byCategory = await this.expenses
      .createQueryBuilder('e')
      .leftJoin('e.category', 'c')
      .select("COALESCE(c.name, 'Uncategorized')", 'category')
      .addSelect('SUM(e.amount)', 'total')
      .where('e.user_id = :userId', { userId })
      .andWhere("to_char(e.spent_on, 'YYYY-MM') = :month", { month: target })
      .groupBy('c.name')
      .orderBy('total', 'DESC')
      .getRawMany();

    const recentExpenses = await this.expenses.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      month: target,
      totalSpent,
      budget,
      remaining: budget == null ? null : budget - totalSpent,
      status: budgetStatus(totalSpent, budget),
      highestExpense: highestExpense || null,
      spendingByCategory: byCategory.map((row) => ({
        category: row.category,
        total: parseFloat(row.total),
      })),
      recentExpenses,
    };
  }
}
