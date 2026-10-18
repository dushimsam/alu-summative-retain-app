import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { SetBudgetDto } from './dto/set-budget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private budgets: BudgetsService) {}

  @Get()
  get(@CurrentUser() user: { id: number }, @Query('month') month?: string) {
    return this.budgets.get(user.id, month);
  }

  @Put()
  set(@CurrentUser() user: { id: number }, @Body() dto: SetBudgetDto) {
    return this.budgets.set(user.id, dto);
  }
}
