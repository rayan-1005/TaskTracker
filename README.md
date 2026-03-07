# TaskTracker

A full-stack User Management & Task Tracker application.

## Structure

- [`/server`](./server) — REST API built with Node.js, Express, PostgreSQL, Prisma
- [`/client`](./client) — Frontend built with React, Tailwind CSS

## Quick Start

### Backend
```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Tech Stack

| | Technology |
|---|---|
| Backend | Node.js, Express, Prisma, PostgreSQL (Neon) |
| Frontend | React, Tailwind CSS, Vite |
| Auth | JWT, bcryptjs |
| Testing | Jest, Supertest, React Testing Library |