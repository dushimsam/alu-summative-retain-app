# Retain API

REST API for Retain, a personal expense and budget manager. Built with NestJS,
TypeORM and PostgreSQL.

## Getting started

1. Start the database:

   ```bash
   docker compose up -d
   ```

2. Install dependencies and set up the environment:

   ```bash
   npm install
   cp .env.example .env
   ```

3. Add some test data (tables are created automatically on first run):

   ```bash
   npm run seed
   ```

4. Run the server:

   ```bash
   npm run start:dev
   ```

The API is served under `http://localhost:4000/api`.

Seeded logins:

- Admin: `admin@retain.app` / `admin123`
- User: `sam@retain.app` / `user123`

## Authentication

Sign up or sign in to receive a JWT. Send it on protected requests as a header:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth
- `POST /api/auth/signup` — create an account
- `POST /api/auth/signin` — log in
- `GET /api/auth/me` — current user

### Categories
- `GET /api/categories` — list categories
- `POST /api/categories` — create (admin)
- `PUT /api/categories/:id` — rename (admin)
- `DELETE /api/categories/:id` — delete and move its expenses to Uncategorized (admin)

### Expenses
- `GET /api/expenses` — list with filters, search, sorting and pagination
- `GET /api/expenses/:id` — single expense
- `POST /api/expenses` — create
- `PUT /api/expenses/:id` — update
- `DELETE /api/expenses/:id` — delete

Supported query params on the list endpoint: `search`, `category`,
`paymentMethod`, `startDate`, `endDate`, `minAmount`, `maxAmount`,
`sortBy` (`date` or `amount`), `order` (`asc` or `desc`), `page`, `limit`.

### Budgets
- `GET /api/budgets?month=YYYY-MM` — budget for a month (defaults to current)
- `PUT /api/budgets` — set or update the budget for a month

### Dashboard
- `GET /api/dashboard?month=YYYY-MM` — totals, remaining budget, status,
  highest expense, spending by category and recent expenses

### Admin
- `GET /api/admin/insights` — platform-wide insights (admin)
