import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from './category.entity';
import { Expense } from '../expenses/expense.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categories: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  findAll() {
    return this.categories.find({ order: { name: 'ASC' } });
  }

  async create(dto: CategoryDto) {
    await this.ensureNameFree(dto.name);
    return this.categories.save(this.categories.create({ name: dto.name.trim() }));
  }

  async update(id: number, dto: CategoryDto) {
    const category = await this.categories.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.ensureNameFree(dto.name, id);
    category.name = dto.name.trim();
    return this.categories.save(category);
  }

  async remove(id: number) {
    const category = await this.categories.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.isDefault) {
      throw new BadRequestException('The default category cannot be deleted');
    }

    const fallback = await this.categories.findOne({ where: { isDefault: true } });

    await this.dataSource.transaction(async (manager) => {
      await manager.update(
        Expense,
        { categoryId: id },
        { categoryId: fallback ? fallback.id : null },
      );
      await manager.delete(Category, { id });
    });

    return { message: 'Category deleted and its expenses moved to Uncategorized' };
  }

  private async ensureNameFree(name: string, ignoreId?: number) {
    const existing = await this.categories.findOne({
      where: { name: name.trim() },
    });
    if (existing && existing.id !== ignoreId) {
      throw new ConflictException('A category with that name already exists');
    }
  }
}
