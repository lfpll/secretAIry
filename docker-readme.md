# Docker PostgreSQL Migration

This document outlines the changes made to migrate the application from SQLite to PostgreSQL in a Docker environment.

## Key Changes

### Database Layer

1. **Removed SQLite-specific Code**
   - Removed SQLite imports and connection handling
   - Removed database file path configuration
   - Eliminated table creation logic from Python code

2. **PostgreSQL Configuration**
   - Added PostgreSQL connection using psycopg2
   - Added environment variables for database configuration
   - Changed parameter placeholders from `?` to `%s` for PostgreSQL

3. **Database Initialization**
   - Moved table creation to `init.sql` PostgreSQL initialization script
   - Added sample data population to `init.sql`
   - Removed Python-based seeding functions

### Docker Environment

1. **Docker Compose Setup**
   - PostgreSQL service with health check
   - Volume mounting for data persistence
   - Integration with backend and frontend services
   - Proper networking between services

2. **Backend Changes**
   - Added psycopg2-binary to requirements.txt
   - Simplified startup procedure
   - Database-agnostic API implementation

3. **Frontend Changes**
   - Environment variable for API URL
   - Container volume mounting for development

## Database Schema

The database schema remains the same as before, but is now managed by PostgreSQL:

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

## Benefits of Changes

1. **Database Portability**
   - Application is now agnostic about database location
   - Environment variables control connection

2. **Improved Development Experience**
   - Consistent environment across development and production
   - No local database file management
   - No manual database migration needed

3. **Enhanced Data Persistence**
   - PostgreSQL offers more robust data storage
   - Database handled by separate container
   - Volume mounting ensures data persistence 