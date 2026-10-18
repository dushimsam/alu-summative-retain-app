import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsDateString()
  spentOn: string;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
