from datetime import datetime
from fastapi import APIRouter, HTTPException, Path, Depends, status
from typing import List
import json

from db.database import get_session
from models import SectionType, Task, TaskUpdate, TaskBase

# Create task router
task_router = APIRouter(prefix="/task", tags=["tasks"])

@task_router.post("")
async def create_task(
    task_data: TaskBase,
    session = Depends(get_session)
) -> Task:
    """Create a new task."""
    print(f"Creating task: {task_data.model_dump()}")
    # Convert to dict and handle the regularity field specially
    task_dict = task_data.model_dump()
    
    task = Task(**task_dict)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@task_router.get("/{task_id}")
async def get_task(
    task_id: str = Path(..., description="The ID of the task to retrieve"),
    session = Depends(get_session)
) -> Task:
    """Get a specific task by ID."""
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with ID {task_id} not found"
        )
    return task

@task_router.put("/{task_id}")
async def update_existing_task(
    task_data: TaskUpdate,
    task_id: str = Path(..., description="The ID of the task to update"),
    session = Depends(get_session)
) -> Task:
    """Update an existing task."""
    task: Task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with ID {task_id} not found"
        )
   
    # Update task fields
    task_data_dict = task_data.model_dump(exclude_unset=True)
    for field, value in task_data_dict.items():
        setattr(task, field, value)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@task_router.delete("/{task_id}")
async def delete_existing_task(
    task_id: str = Path(..., description="The ID of the task to delete"),
    session = Depends(get_session)
) -> dict:
    """Update task to delete state.So we can track what's deleted"""
    deleted = session.get(Task, task_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with ID {task_id} not found"
        )
    deleted.is_deleted = True
    session.add(deleted)
    session.commit()

    return {"message": f"Task with ID {task_id} deleted"}

@task_router.post("/{task_id}/complete")
async def complete_task(
    task_id: str = Path(..., description="The ID of the task to complete"),
    session = Depends(get_session)
) -> Task:
    """Complete a task by moving it to the 'done' section and setting the completion date."""
    task: Task | None = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with ID {task_id} not found"
        )
    
    # Update task fields
    task.section = SectionType.DONE
    task.completedAt = datetime.now()
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@task_router.post("/{task_id}/activate")
async def activate_task(
    task_id: str = Path(..., description="The ID of the task to activate"),
    session = Depends(get_session)
) -> Task:
    """Activate a task by moving it to the 'active' section."""
    task: Task | None = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with ID {task_id} not found"
        )
    
    # Update task field
    task.section = SectionType.ACTIVE
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task 