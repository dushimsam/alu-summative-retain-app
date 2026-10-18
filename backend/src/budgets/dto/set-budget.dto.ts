import { IsNumber, IsOptional, Matches, Min } from 'class-validator';

export class SetBudgetDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must look like YYYY-MM' })
  month?: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
