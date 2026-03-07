# Task Tracker API — Backend

A RESTful User Management & Task Tracker API built with Node.js, Express, PostgreSQL (Neon), and Prisma.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v18+ |
| Framework | Express |
| Database | PostgreSQL (hosted on Neon) |
| ORM | Prisma |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Validation | Zod |
| Testing | Jest + Supertest |

---

## Project Structure

```
server/
├── src/
│   ├── app.js                  # Express app configuration
│   ├── server.js               # HTTP server entry point
│   ├── config/
│   │   └── db.js               # Prisma singleton client
│   ├── middleware/
│   │   ├── auth.js             # JWT authenticate + authorize middleware
│   │   └── validate.js         # Zod validation middleware
│   ├── validators/
│   │   └── schemas.js          # All Zod schemas
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── task.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── task.controller.js
│   └── services/
│       ├── auth.service.js     # Register, login business logic
│       ├── user.service.js     # User management business logic
│       └── task.service.js     # Task CRUD + ownership enforcement
├── tests/
│   ├── unit/
│   │   ├── auth.service.test.js
│   │   └── task.service.test.js
│   └── api/
│       └── auth.api.test.js
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.example
└── README.md
```

---

## Setup

### Prerequisites

- Node.js v18+
- A [Neon](https://neon.tech) account (free tier) or any PostgreSQL instance

### 1. Clone the repository

```bash
git clone https://github.com/rayan-1005/tast-tracker
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DATABASE_URL="postgresql://username:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your_long_random_secret_here"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

> **Generate a strong JWT_SECRET:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

> **Note on Neon:** The `?sslmode=require` at the end of DATABASE_URL is required for Neon connections.

### 4. Run database migration

```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

---

## Running the Server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:3000`

---

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only API tests
npm run test:api
```

---

## API Reference

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication

#### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass1"
}
```
Response `201`:
```json
{
  "message": "User registered successfully",
  "user": { "id": "uuid", "email": "user@example.com", "role": "user", "createdAt": "..." }
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass1"
}
```
Response `200`:
```json
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": { "id": "uuid", "email": "user@example.com", "role": "user" }
}
```

### Users

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | /api/v1/users | admin | Get all users |
| GET | /api/v1/users/:id | self or admin | Get user profile |
| DELETE | /api/v1/users/:id | admin | Delete a user |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/tasks | Create a task |
| GET | /api/v1/tasks | Get tasks (own or all if admin) |
| PUT | /api/v1/tasks/:id | Update a task |
| DELETE | /api/v1/tasks/:id | Delete a task |

#### Create Task
```
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Write unit tests",
  "description": "Cover all service functions",
  "status": "pending"
}
```

#### Update Task
```
PUT /api/v1/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

---

## Security Implementation

- **Password hashing** — bcrypt with 10 salt rounds, never stored in plain text
- **JWT authentication** — tokens signed with HMAC-SHA256 using environment variable secrets
- **Role-based access control (RBAC)** — enforced at middleware and service layers
- **Task ownership** — enforced server-side from JWT payload, clients cannot spoof ownership
- **Timing attack prevention** — bcrypt.compare always runs during login regardless of whether the user exists
- **Environment variables** — all secrets in `.env`, never committed to git

---

## Creating an Admin User

There is no public API endpoint to create an admin — this is intentional. To elevate a user to admin, run this in your Neon SQL editor:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
```