from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import logging
import os
from pathlib import Path
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
    allow_origins=["*"],  # Wildcard works when credentials are disabled
    allow_credentials=False,  # Disable credentials to allow wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(tasks_router)
app.include_router(task_router)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Serve static files from local static directory
static_dir = Path(__file__).parent / "static"

if static_dir.exists():
    # Mount static files (CSS, JS, images, etc.)
    app.mount("/static", StaticFiles(directory=static_dir / "static"), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(request: Request, full_path: str):
        """
        Serve the React app for all non-API routes.
        This handles client-side routing for the SPA.
        """
        # Check if it's an API route
        if full_path.startswith("task") or full_path.startswith("health"):
            # Let FastAPI handle API routes normally
            return
        
        # For all other routes, serve the React app
        index_file = static_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        else:
            return {"error": "React app not found. Please copy the React build files to the static directory."}
else:
    logger.warning(f"Static directory not found at {static_dir}. Please create a 'static' folder and copy the React build files there.")

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
