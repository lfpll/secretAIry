# Task Management Application - Docker Setup

This repository contains a Task Management application with a FastAPI backend and React frontend, containerized with Docker Compose.

## Project Structure

- `server/` - FastAPI backend
- `daily-tasks-app/` - React frontend

## Docker Setup

The application is configured to run with Docker Compose, which includes:

1. **PostgreSQL database** - Replacing the original SQLite database
2. **FastAPI backend** - Connects to PostgreSQL
3. **React frontend** - Connects to the backend API

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository
2. From the root directory, run:

```bash
docker-compose up
```

This will:
- Start PostgreSQL with initialized database schema
- Start the FastAPI backend on http://localhost:8000
- Start the React frontend on http://localhost:3000

## API Documentation

Once the server is running, you can access the automatic API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

### Backend
- `DB_HOST` - PostgreSQL host (default: postgres)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USER` - PostgreSQL user (default: taskuser)
- `DB_PASSWORD` - PostgreSQL password (default: taskpass)
- `DB_NAME` - PostgreSQL database name (default: tasks_db)

### Frontend
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8000)

## Database Schema

The PostgreSQL database follows the same schema as the original SQLite database:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    why TEXT NOT NULL,
    urgency TEXT NOT NULL,
    section TEXT NOT NULL,
    planned_date TEXT,
    completed_at TEXT,
    regularity_type TEXT,
    regularity_days TEXT,
    regularity_every_x_days INTEGER,
    regularity_last_completed TEXT
);
``` 