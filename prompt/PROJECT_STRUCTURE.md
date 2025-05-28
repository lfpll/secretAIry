# Daily Todo App - Project Structure Overview

## Overview
This is a full-stack daily todo application with a React TypeScript frontend and FastAPI Python backend.

## Project Organization

For detailed structure information, see the dedicated documentation files:

- **[Frontend Structure](./FRONTEND_STRUCTURE.md)** - Complete React TypeScript frontend organization
- **[Backend Structure](./BACKEND_STRUCTURE.md)** - Complete FastAPI Python backend organization

## Root Directory (`/`)
- **`.gitignore`** - Git ignore rules for the entire project
- **`README.md`** - Main project documentation and setup instructions
- **`docker-compose.yml`** - Docker orchestration for the entire application with frontend, backend, and database services
- **`context.md`** - Project context and development information
- **`docker-readme.md`** - Docker setup and deployment instructions
- **`fast_api_prompt.md`** - FastAPI development guidelines and prompts for AI assistance
- **`pronmpt.md.html`** - HTML version of development prompts and guidelines

## Application Structure

### Frontend (`/daily-tasks-app/`)
React TypeScript application with Tailwind CSS styling.
**→ See [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) for complete details**

### Backend (`/focus-backend/`)
FastAPI Python backend with SQLite database.
**→ See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) for complete details**

## Technology Stack Summary

### Frontend Technologies
- **React 18** - Component-based UI framework
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Hooks** - State management pattern

### Backend Technologies
- **FastAPI** - Modern Python web framework
- **SQLModel** - Type-safe database interactions
- **SQLite** - Lightweight database
- **UV** - Python package manager

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Key Features Summary
- **Complete Task CRUD** - Full create, read, update, delete operations
- **Task Categorization** - Active, Future, and Done sections
- **Urgency Management** - Four-level priority system
- **Recurring Tasks** - Weekly recurring task support
- **Date Planning** - Future task scheduling
- **Responsive UI** - Modern, mobile-friendly design
- **Type Safety** - Full TypeScript and Python type coverage
- **RESTful API** - Well-structured endpoints with documentation

## Development Guidelines

For specific development context and guidelines:
- **Frontend Development**: Read `tailwind.mdc` and `react.mdc` files
- **Backend Development**: Read `fast_api_prompt.md` file
- **Docker Deployment**: Read `docker-readme.md` file

## Getting Started

1. **Setup**: Follow instructions in the main `README.md`
2. **Frontend**: Navigate to `/daily-tasks-app/` and see `FRONTEND_STRUCTURE.md`
3. **Backend**: Navigate to `/focus-backend/` and see `BACKEND_STRUCTURE.md`
4. **Full Stack**: Use `docker-compose.yml` for complete environment setup