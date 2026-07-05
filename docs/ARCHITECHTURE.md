# Architecture

HeroBrine AI follows a layered architecture.

Frontend

↓

REST API

↓

Service Layer

↓

Repository Layer

↓

PostgreSQL

AI services communicate through an abstraction layer.

Gemini API is never called directly from business logic.

Future AI providers can be added without changing application logic.

## Frontend

- Next.js
- TypeScript
- Tailwind
- shadcn/ui

## Backend

- FastAPI
- SQLAlchemy
- Alembic

## Database

- PostgreSQL

## Authentication

- Firebase Authentication

## AI

- Gemini API

## Deployment

Frontend → Vercel

Backend → Railway