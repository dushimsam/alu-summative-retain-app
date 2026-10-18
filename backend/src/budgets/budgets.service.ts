import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { SetBudgetDto } from './dto/set-budget.dto';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

@Injectable()
export class BudgetsService {
  constructor(@InjectRepository(Budget) private budgets: Repository<Budget>) {}

  async get(userId: number, month?: string) {
    const target = month || currentMonth();
    const budget = await this.budgets.findOne({
      where: { userId, month: target },
    });
    return budget || { month: target, amount: null };
  }

  async set(userId: number, dto: SetBudgetDto) {
    const month = dto.month || currentMonth();
    let budget = await this.budgets.findOne({ where: { userId, month } });
    if (budget) {
      budget.amount = dto.amount;
    } else {
      budget = this.budgets.create({ userId, month, amount: dto.amount });
    }
    return this.budgets.save(budget);
  }
}
