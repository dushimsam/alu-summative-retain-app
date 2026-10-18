import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { User } from './users/user.entity';
import { Category } from './categories/category.entity';
import { Expense } from './expenses/expense.entity';
import { Budget } from './budgets/budget.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Category, Expense, Budget],
  synchronize: true,
});

async function ensureCategory(
  repo: Repository<Category>,
  name: string,
  isDefault = false,
) {
  const existing = await repo.findOne({ where: { name } });
  if (!existing) {
    await repo.save(repo.create({ name, isDefault }));
  }
}

async function ensureUser(
  repo: Repository<User>,
  name: string,
  email: string,
  password: string,
  role = 'user',
) {
  const existing = await repo.findOne({ where: { email } });
  if (!existing) {
    const hash = await bcrypt.hash(password, 10);
    await repo.save(repo.create({ name, email, password: hash, role }));
  }
}

async function run() {
  await dataSource.initialize();
  const users = dataSource.getRepository(User);
  const categories = dataSource.getRepository(Category);

  await ensureCategory(categories, 'Uncategorized', true);
  for (const name of ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Health']) {
    await ensureCategory(categories, name);
  }

  await ensureUser(users, 'Admin', 'admin@retain.app', 'admin123', 'admin');
  await ensureUser(users, 'Sam', 'sam@retain.app', 'user123');

  console.log('Seed data inserted.');
  console.log('Admin login: admin@retain.app / admin123');
  console.log('User login:  sam@retain.app / user123');

  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
