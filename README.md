# Retain

A personal expense and budget manager. Users track expenses, set a monthly
budget and view spending summaries; admins manage categories and see platform
insights.

**Live app:** _add deployed URL here_

Seeded logins — Admin: `admin@retain.app` / `admin123`, User: `sam@retain.app` / `user123`

## Tech

- **Frontend:** React, TypeScript, Vite, Tailwind, Redux Toolkit (filters), React Context (auth)
- **Backend:** NestJS, TypeORM, PostgreSQL, JWT auth

## Features

- Authentication with `user` and `admin` roles and protected routes
- Expense CRUD with search, filters, sorting and pagination
- Monthly budget tracking with within / approaching / over status
- User dashboard: totals, remaining budget, highest expense, spending by category
- Admin dashboard: category management and platform insights

## Setup

Run the backend first, then the frontend. Each has its own README with details.

```bash
# backend — API on http://localhost:4000/api
cd backend && docker compose up -d && npm install && cp .env.example .env
npm run seed && npm run start:dev

# frontend — app on http://localhost:5173
cd frontend && npm install && cp .env.example .env && npm run dev
```

- Backend setup and full API reference: [backend/README.md](backend/README.md)
- Frontend setup: [frontend/README.md](frontend/README.md)

## API

Base URL `/api`; all routes except `/auth/signup` and `/auth/signin` need a
Bearer token. Resources: `/auth`, `/categories`, `/expenses`, `/budgets`,
`/dashboard`, `/admin/insights`. Endpoint and query-param details are in
[backend/README.md](backend/README.md).
