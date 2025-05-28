# Daily Todo App - Frontend Structure

## Overview
This is the React TypeScript frontend for the daily todo application with modern UI/UX design and basic task management features.

## Frontend (`/daily-tasks-app/`)
**React TypeScript frontend application with custom CSS styling**

### Configuration Files
- **`package.json`** - Node.js dependencies, scripts, and project metadata
- **`package-lock.json`** - NPM lock file ensuring consistent dependency versions
- **`tsconfig.json`** - TypeScript compiler configuration with React settings
- **`Dockerfile`** - Container configuration for frontend deployment
- **`.gitignore`** - Frontend-specific git ignore rules
- **`README.md`** - Frontend documentation and development instructions

### Source Code (`/daily-tasks-app/src/`)

#### Main Application Files
- **`App.tsx`** - Main React application component with layout, state management, and modal handling
- **`App.css`** - Main application styles with custom CSS and responsive design
- **`index.tsx`** - React application entry point and DOM rendering
- **`index.css`** - Global styles imports
- **`react-app-env.d.ts`** - TypeScript declarations for React app environment

- **Test files:**
  - `App.test.tsx` - Unit tests for main App component
  - `setupTests.ts` - Jest testing framework configuration
  - `reportWebVitals.ts` - Performance monitoring setup

#### Components (`/daily-tasks-app/src/components/`)
React UI components for the task management interface:
- **`Header.tsx`** - Simple application header with title
- **`TaskList.tsx`** - Main task list display with task action buttons (complete, edit, delete)
- **`TaskFormPopup.tsx`** - Modal component for creating new tasks with basic form fields
- **`EditTaskPopup.tsx`** - Modal component for editing existing tasks with pre-filled data
- **`TabNavigation.tsx`** - Navigation tabs for switching between Active, Future, and Done task sections

#### Services (`/daily-tasks-app/src/services/`)
- **`TaskService.ts`** - API client service for all task CRUD operations with FastAPI backend communication

#### Types (`/daily-tasks-app/src/types/`)
- **`index.ts`** - TypeScript type definitions for tasks, urgency levels, sections, and app state interfaces. 
  - **Task Class**: Uses a class-based pattern similar to Python's BaseModel, allowing both instantiation and type usage
  - **Constants**: Exports arrays of valid values for type-safe operations (TAB_TYPES, URGENCY_LEVELS, WEEKDAYS)
  - **Type Definitions**: TabType, Urgency, and WeekDay types with corresponding constant arrays

#### Hooks (`/daily-tasks-app/src/hooks/`)
Custom React hooks for state management and operations:
- **`useTaskState.ts`** - Low-level state management hook with essential task state operations and UI state management
- **`useTaskOperations.ts`** - High-level business logic hook handling all task CRUD operations, API interactions, and task sorting

#### Utils (`/daily-tasks-app/src/utils/`)
- **`dateUtils.ts`** - Date manipulation utilities for task scheduling and recurring task logic

### Build Output
- **`node_modules/`** - Frontend Node.js dependencies and packages

## Frontend Technology Stack
- **React 18** - Component-based UI framework with hooks
- **TypeScript** - Static type checking for JavaScript
- **Custom CSS** - Hand-written CSS with modern design patterns and responsive layout
- **Custom hooks** - Centralized state management without external libraries

## Frontend Key Features
- **Responsive UI** - Modern CSS design with modal-based interactions
- **Type Safety** - Full TypeScript coverage for all components and data models
- **Component Architecture** - Modular React components with clear separation of concerns
- **State Management** - Custom hooks pattern for centralized state without external dependencies
- **API Integration** - Seamless communication with FastAPI backend through service layer
- **User Experience** - Modal-based task creation/editing with basic form validation
- **Navigation** - Tab-based interface for task categorization (Active, Future, Done)
- **Task Management UI** - Complete CRUD interface with urgency indicators and date planning
- **Visual Urgency System** - Dynamic task sizing and colors based on urgency levels
- **Task Sorting** - Automatic sorting by urgency levels and planned dates
- **Recurring Tasks** - Support for daily recurring tasks with day-of-week selection

## Notable Implementation Details
- Uses a class-based Task model for consistency with backend
- Implements optimistic updates for better user experience
- Custom CSS animations and hover effects for enhanced interactivity
- Mobile-responsive design with touch-friendly interfaces
- Visual urgency escalation (font sizes and colors increase with urgency)
- Automatic task sorting (critical tasks appear first, then by planned date)

## Missing/Simplified Features
- No drag & drop functionality
- No empty state handling for task lists  
- No advanced filtering or search capabilities
- No bulk operations on tasks
- No keyboard shortcuts or accessibility enhancements