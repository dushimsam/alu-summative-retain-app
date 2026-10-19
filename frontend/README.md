# Retain (frontend)

React + TypeScript + Vite client for Retain, a personal expense and budget
manager. Styled with Tailwind CSS.

## Stack

- React with TypeScript (Vite)
- React Router for routing and protected routes
- React Context for authentication (sign up, sign in, sign out, roles)
- Redux Toolkit for expense search, filtering and sorting
- Tailwind CSS for styling

## Getting started

Make sure the backend API is running first (see `../backend`).

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` and talks to the API at the URL set in
`.env` (`VITE_API_URL`, defaults to `http://localhost:4000/api`).

Seeded logins from the backend:

- Admin: `admin@retain.app` / `admin123`
- User: `sam@retain.app` / `user123`

## Structure

- `src/context` — authentication context and provider
- `src/store` — Redux store and the filters slice
- `src/components` — shared UI, layout and route guards
- `src/pages` — dashboard, expenses, budget and auth screens
- `src/pages/admin` — admin insights and category management
- `src/api.ts` — small fetch wrapper that attaches the auth token
