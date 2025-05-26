from datetime import datetime
from fastapi import APIRouter, HTTPException, Path, Depends, status
from typing import List
from sqlmodel import select

from db.database import get_session
from models import SectionType, Task, TaskUpdate

# Create tasks router
tasks_router = APIRouter(prefix="/tasks", tags=["tasks"])

@tasks_router.get("/{section}")
async def get_tasks(
    section: SectionType = Path(..., description="Section: active, future, or done"),
    session = Depends(get_session)
) -> List[Task]:
    """Get all tasks for a specific section without sorting (sorting will be done in frontend)."""
    statement = select(Task).where(Task.section == section)
    tasks = session.exec(statement).all()
    return tasks

