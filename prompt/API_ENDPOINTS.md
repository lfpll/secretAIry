# API Endpoints Documentation

This document provides curl examples for all available API endpoints in the Focus Backend application.

## Base URL
```
http://192.168.0.145:8000
```

## Task Management Endpoints

### 1. Create Task
**POST** `/task

Creates a new task in the system with the specified details.
This endpoint allows you to add tasks to your task management system with urgency levels, sections, and optional scheduling.

**Example:**
```bash
curl -X POST "http://192.168.0.145:8000/task" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "why": "Need to deliver comprehensive documentation for the client presentation next week",
    "urgency": "high",
    "section": "active",
    "plannedDate": "2024-01-15T10:00:00",
    "regularity": ["MO", "WE", "FR"],
    "is_deleted": false
  }'
```

### 2. Get Task by ID
**GET** `/task/{task_id}`

Retrieves a specific task by its unique identifier.
Returns all task details including completion status, urgency level, and scheduling information.

**Example:**
```bash
curl -X GET "http://192.168.0.145:8000/task/550e8400-e29b-41d4-a716-446655440000" \
  -H "Accept: application/json"
```

### 3. Update Task
**PUT** `/task/{task_id}`

Updates an existing task with new information, allowing partial updates.
You can modify any task field including title, urgency, section, or scheduling details.

**Example:**
```bash
curl -X PUT "http://192.168.0.145:8000/task/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation - UPDATED",
    "urgency": "critical",
    "section": "active",
    "plannedDate": "2024-01-16T14:00:00"
  }'
```

### 4. Delete Task
**DELETE** `/task/{task_id}`

Marks a task as deleted by setting the is_deleted flag to true.
This is a soft delete operation that maintains task history for tracking purposes.

**Example:**
```bash
curl -X DELETE "http://192.168.0.145:8000/task/550e8400-e29b-41d4-a716-446655440000" \
  -H "Accept: application/json"
```

### 5. Complete Task
**POST** `/task/{task_id}/complete`

Marks a task as completed by moving it to the 'done' section and setting completion timestamp.
This action automatically updates the task status and records when the task was finished.

**Example:**
```bash
curl -X POST "http://192.168.0.145:8000/task/550e8400-e29b-41d4-a716-446655440000/complete" \
  -H "Accept: application/json"
```

### 6. Activate Task
**POST** `/task/{task_id}/activate`

Moves a task to the 'active' section, marking it as currently being worked on.
This is useful for promoting tasks from the future section or reactivating completed tasks.

**Example:**
```bash
curl -X POST "http://192.168.0.145:8000/task/550e8400-e29b-41d4-a716-446655440000/activate" \
  -H "Accept: application/json"
```

## Task Collection Endpoints

### 7. Get Tasks by Section
**GET** `/tasks/{section}`

Retrieves all tasks for a specific section (active, future, or done).
Returns a list of tasks without sorting - frontend handles the ordering of results.

**Example (Active Tasks):**
```bash
curl -X GET "http://192.168.0.145:8000/tasks/active" \
  -H "Accept: application/json"
```

**Example (Future Tasks):**
```bash
curl -X GET "http://192.168.0.145:8000/tasks/future" \
  -H "Accept: application/json"
```

**Example (Completed Tasks):**
```bash
curl -X GET "http://192.168.0.145:8000/tasks/done" \
  -H "Accept: application/json"
```

## Data Models Reference

### Task Model Fields:
- `id`: Unique UUID identifier (auto-generated)
- `title`: Task title/name
- `why`: Reason or description for the task
- `urgency`: Priority level ("critical", "high", "medium", "low")
- `section`: Current section ("active", "future", "done")
- `plannedDate`: Optional scheduled date/time
- `regularity`: Optional array of weekdays for recurring tasks
- `is_deleted`: Soft delete flag
- `completedAt`: Timestamp when task was completed

### Urgency Levels:
- `critical`: Urgent and important tasks
- `high`: High priority tasks
- `medium`: Medium priority tasks  
- `low`: Low priority tasks

### Section Types:
- `active`: Currently being worked on
- `future`: Planned for later
- `done`: Completed tasks

### Weekdays (for regularity):
- `MO`: Monday
- `TU`: Tuesday
- `WE`: Wednesday
- `TH`: Thursday
- `FR`: Friday
- `SA`: Saturday
- `SU`: Sunday 