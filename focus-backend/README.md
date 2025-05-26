# Tasks API Backend

This is the FastAPI backend for the Daily Tasks application. It provides RESTful APIs for task management with SQLite database storage.

## Features

- RESTful API for tasks management
- SQLite database for persistent storage
- Automatic sorting of tasks by priority and date
- No ORM dependencies - direct SQL queries

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the server:

```bash
uvicorn main:app --reload
```

The server will start at http://localhost:8000

## API Documentation

Once the server is running, you can access the automatic API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /tasks/{section}` - Get all tasks in a section (active/future/done)
- `GET /task/{task_id}` - Get a specific task by ID
- `POST /tasks` - Create a new task
- `PUT /task/{task_id}` - Update an existing task
- `DELETE /task/{task_id}` - Delete a task
- `POST /task/{task_id}/complete` - Mark a task as complete
- `POST /task/{task_id}/activate` - Move a task to the active section

## Database Structure

The application uses a SQLite database with a single `tasks` table:

```sql
CREATE TABLE tasks (
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
)
```

The database file is stored at `./db/data/tasks.db`. 