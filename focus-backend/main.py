from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from db.database import create_db_and_tables
from routes.tasks import tasks_router
from routes.task import task_router

# Simple logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Manage application lifespan - startup and shutdown events."""
    # Startup: Initialize database
    create_db_and_tables()
    logger.info("Database initialized")
    yield
    # Shutdown: Cleanup resources (if needed)
    logger.info("Application shutting down")

# Create FastAPI app with lifespan
app = FastAPI(
    title="Tasks API",
    description="API for managing daily tasks",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router)
app.include_router(task_router)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
