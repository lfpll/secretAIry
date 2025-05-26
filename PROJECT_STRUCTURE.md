# Daily Todo App - Project Structure Summary

## Overview
This is a full-stack daily todo application with a React TypeScript frontend and FastAPI Python backend.

## Root Directory (`/`)
- **`.gitignore`** - Git ignore rules for the entire project
- **`README.md`** - Main project documentation
- **`docker-compose.yml`** - Docker orchestration for the entire application
- **`init.sql`** - Database initialization script
- **`package-lock.json`** - NPM lock file for root dependencies
- **`node_modules/`** - Node.js dependencies for root level
- **Documentation files:**
  - `fast_api_prompt.md` - FastAPI development prompts/guidelines
  - `docker-readme.md` - Docker setup instructions
  - `context.md` - Project context information
  - `pronmpt.md.html` - HTML version of prompts

## Backend (`/focus-backend/`)
**FastAPI Python backend for task management**

### Main Files
- **`main.py`** - FastAPI application entry point
- **`models.py`** - Pydantic data models for tasks
- **`tasks.db`** - SQLite database file
- **`pyproject.toml`** - Python project dependencies (using uv)
- **`uv.lock`** - UV lock file for dependencies
- **`Dockerfile`** - Container configuration for backend
- **`.python-version`** - Python version specification

### Subdirectories
- **`routes/`** - API endpoint definitions
  - `task.py` - Main task CRUD operations
  - `tasks.py` - Additional task-related endpoints
  - `__init__.py` - Package initialization
- **`db/`** - Database configuration and connection
  - `database.py` - Database setup and connection logic
  - `__init__.py` - Package initialization
- **`.venv/`** - Python virtual environment
- **`__pycache__/`** - Python bytecode cache

## Frontend (`/daily-tasks-app/`)
**React TypeScript frontend application**

### Configuration Files
- **`package.json`** - Node.js dependencies and scripts
- **`package-lock.json`** - NPM lock file
- **`tsconfig.json`** - TypeScript configuration
- **`Dockerfile`** - Container configuration for frontend
- **`.gitignore`** - Frontend-specific git ignores
- **`README.md`** - Frontend documentation

### Documentation
- **`tailwind.mdc`** - Tailwind CSS documentation/notes
- **`react.mdc`** - React development notes

### Source Code (`/daily-tasks-app/src/`)

#### Main Application Files
- **`App.tsx`** - Main React application component
- **`App.css`** - Main application styles
- **`index.tsx`** - React application entry point
- **`index.css`** - Global styles
- **Test files:** `App.test.tsx`, `setupTests.ts`, `reportWebVitals.ts`

#### Components (`/daily-tasks-app/src/components/`)
React UI components for the task management interface:
- **`Header.tsx`** - Application header component
- **`TaskList.tsx`** - Main task list display component
- **`TaskFormPopup.tsx`** - Modal for creating new tasks
- **`EditTaskPopup.tsx`** - Modal for editing existing tasks
- **`UrgentPopup.tsx`** - Modal for urgent task notifications
- **`TabNavigation.tsx`** - Navigation tabs component

#### Services (`/daily-tasks-app/src/services/`)
- **`TaskService.ts`** - API client for task CRUD operations

#### Types (`/daily-tasks-app/src/types/`)
- **`index.ts`** - TypeScript type definitions for tasks and app state

#### Hooks (`/daily-tasks-app/src/hooks/`)
Custom React hooks for state management:
- **`useTaskState.ts`** - Task state management hook
- **`useTaskOperations.ts`** - Task operations (CRUD) hook

#### Utils (`/daily-tasks-app/src/utils/`)
- **`dateUtils.ts`** - Date manipulation utility functions

### Static Assets (`/daily-tasks-app/public/`)
- **`index.html`** - Main HTML template
- **`favicon.ico`** - Website favicon
- **`logo192.png`, `logo512.png`** - App icons
- **`manifest.json`** - PWA manifest
- **`robots.txt`** - Search engine crawling instructions

### Build Output
- **`build/`** - Production build output directory
- **`node_modules/`** - Frontend Node.js dependencies

## Additional Directories

### Server (`/server/`)
- **`pyproject.toml`** - Alternative/minimal server configuration

## Technology Stack

### Backend
- **FastAPI** - Web framework
- **SQLite** - Database
- **Pydantic** - Data validation
- **UV** - Package manager

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Custom hooks** - State management

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Key Features
Based on the structure, this app includes:
- Task CRUD operations
- Task list with filtering/tabbed navigation
- Modal-based task creation and editing
- Urgent task notifications
- Date-based task management
- Responsive UI with modern styling 