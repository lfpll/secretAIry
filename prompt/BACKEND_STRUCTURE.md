# Daily Todo App - Backend Structure

## Overview
This is the FastAPI Python backend for the daily todo application providing RESTful API endpoints for task management with SQLite database storage.

## Backend (`/focus-backend/`)
**FastAPI Python backend for task management with SQLite database**

### Main Files
- **`main.py`** - FastAPI application entry point with CORS setup and route registration
- **`models.py`** - SQLModel data models defining Task structure with urgency levels, sections, and recurring task support
- **`tasks.db`** - SQLite database file containing task data
- **`pyproject.toml`** - Python project dependencies managed by UV package manager
- **`uv.lock`** - UV lock file ensuring reproducible dependency installations
- **`Dockerfile`** - Container configuration for backend deployment
- **`.python-version`** - Python version specification for the project
- **`.gitignore`** - Backend-specific git ignore rules
- **`README.md`** - Backend documentation and API endpoints
- **`get-docker.sh`** - Docker installation script
- **`nohup.out`** - Background process output log file

### Subdirectories

#### Routes (`/focus-backend/routes/`)
API endpoint definitions:
- **`task.py`** - Main task CRUD operations with filtering, urgency management, and recurring task support
- **`tasks.py`** - Additional task-related utility endpoints
- **`__init__.py`** - Package initialization file

#### Database (`/focus-backend/db/`)
Database configuration and connection management:
- **`database.py`** - SQLite database setup, connection logic, and table creation
- **`__init__.py`** - Database package initialization

#### Environment
- **`.venv/`** - Python virtual environment with project dependencies
- **`__pycache__/`** - Python bytecode cache directories

## Backend Technology Stack
- **FastAPI** - Modern Python web framework with automatic API documentation
- **SQLModel** - Type-safe SQL database interactions with Pydantic integration
- **SQLite** - Lightweight embedded database for task storage
- **UV** - Fast Python package manager and dependency resolver
- **Pydantic** - Data validation and settings management using Python type hints

## API Endpoints Structure
Based on the FastAPI implementation:

### Task Management Endpoints
- **GET /tasks** - Retrieve all tasks with optional filtering parameters
- **POST /tasks** - Create new task with validation
- **PUT /tasks/{id}** - Update existing task by ID
- **DELETE /tasks/{id}** - Delete task by ID
- **GET /tasks/{id}** - Retrieve specific task by ID

### Query Parameters Support
- Task filtering by section (active, future, done)
- Urgency level filtering (critical, high, medium, low)
- Date range filtering for planned dates
- Recurring task management

## Data Models
### Task Model Structure
- **ID** - Unique identifier (auto-generated)
- **Title** - Task description (required)
- **Section** - Task category (active, future, done)
- **Urgency** - Priority level (critical, high, medium, low)
- **Planned Date** - Optional future scheduling
- **Is Recurring** - Boolean flag for recurring tasks
- **Recurring Days** - Weekday selection for recurring tasks
- **Created At** - Timestamp of task creation
- **Updated At** - Timestamp of last modification

## Backend Key Features
- **RESTful API Design** - Standard HTTP methods with proper status codes
- **Data Validation** - Pydantic models ensure type safety and validation
- **Database Integration** - SQLModel provides type-safe database operations
- **CORS Support** - Cross-origin requests enabled for frontend integration
- **Automatic Documentation** - FastAPI generates interactive API docs
- **Task CRUD Operations** - Complete create, read, update, delete functionality
- **Advanced Filtering** - Multiple query parameters for task retrieval
- **Recurring Task Logic** - Weekly recurring task support with weekday selection
- **Date Management** - Planned date functionality for future task scheduling
- **Error Handling** - Proper HTTP error responses and validation feedback

## Database Schema
- **SQLite Database** - Single file database for simplicity and portability
- **Table Creation** - Automatic table generation from SQLModel definitions
- **Migrations** - Schema changes handled through model updates
- **Data Persistence** - File-based storage in `tasks.db`

## Development Workflow
- **UV Package Management** - Fast dependency resolution and environment management
- **Type Safety** - Full type checking with Python type hints
- **API Testing** - Automatic interactive documentation at `/docs` endpoint
- **Hot Reload** - Development server with automatic code reloading
- **Container Support** - Docker configuration for consistent deployment

## Knowledge Base
If you feel that you need help with backend development, read the `fast_api_prompt.md` file for more context about the FastAPI development guidelines and your role in the project. 