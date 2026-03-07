# TaskTracker — Full Stack Application

A full-stack User Management & Task Tracker built as a hiring assignment. Features JWT authentication, role-based access control, full task CRUD, and a clean minimal UI.

---

## Overview

| | |
|---|---|
| **Backend** | REST API — Node.js, Express, PostgreSQL, Prisma |
| **Frontend** | React SPA — Vite, Tailwind CSS, shadcn-style components |
| **Auth** | JWT + bcrypt password hashing |
| **Database** | PostgreSQL hosted on Neon |
| **Testing** | Jest, Supertest, React Testing Library |

---

## Features

### Authentication
- Register and login with email and password
- JWT token issued on login, attached to all protected requests
- Passwords hashed with bcrypt (10 salt rounds)

### Role-Based Access Control
- **User** — can manage only their own tasks and view their own profile
- **Admin** — can view all users, delete users, and access all tasks

### Task Management
- Create, read, update, delete tasks
- Toggle task status between pending and completed
- Tasks are owned by users — enforced server-side from JWT payload

### Frontend
- Clean black & white minimal UI
- Dashboard with task stats and completion rate
- Admin dashboard shows all users' tasks with owner emails
- Responsive layout with sidebar navigation
- Toast notifications, loading states, form validation

---

## Project Structure

```
TaskTracker/
├── server/          # Backend REST API
│   ├── src/
│   ├── tests/
│   ├── prisma/
│   └── README.md    # Backend setup & API reference
│
└── client/          # Frontend React app
    ├── src/
    ├── tests/
    ├── screenshots/
    └── README.md    # Frontend setup & screenshots
```
- 📁 [**server/**](./server) — REST API setup, environment config, and API reference → [README](./server/README.md)
- 📁 [**client/**](./client) — Frontend setup, screenshots, and test instructions → [README](./client/README.md)

---

## Quick Start

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # fill in your Neon DB URL and JWT secret
npx prisma migrate dev
npm run dev            # runs on http://localhost:3000
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:3000/api/v1
npm run dev            # runs on http://localhost:5173
```

### 3. Create an admin user

After registering, run this in your Neon SQL editor:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Running Tests

```bash
# Backend
cd server && npm test

# Frontend
cd client && npm test
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/register | Public | Register a new user |
| POST | /api/v1/auth/login | Public | Login and get JWT token |
| GET | /api/v1/users | Admin | Get all users |
| GET | /api/v1/users/:id | Self or Admin | Get user profile |
| DELETE | /api/v1/users/:id | Admin | Delete a user |
| POST | /api/v1/tasks | Auth | Create a task |
| GET | /api/v1/tasks | Auth | Get tasks |
| PUT | /api/v1/tasks/:id | Auth | Update a task |
| DELETE | /api/v1/tasks/:id | Auth | Delete a task |

---

## Security

- Passwords hashed with bcrypt — never stored in plain text
- JWT signed with HMAC-SHA256 using environment variable secret
- Timing attack prevention on login — bcrypt always runs regardless of whether user exists
- Task ownership enforced server-side — clients cannot spoof ownership
- All secrets in `.env` — never committed to git
- Environment variables for API URL on frontend — no hardcoded URLs