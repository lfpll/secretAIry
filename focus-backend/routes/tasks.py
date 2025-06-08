from datetime import datetime
from fastapi import APIRouter, HTTPException, Path, Depends, status
from typing import List
from sqlmodel import select,text

from db.database import get_session
from models import SectionType, Task, TaskUpdate, WeekDay

# Create tasks router
tasks_router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_current_weekday() -> WeekDay:
    day = datetime.now().weekday()
    print(day)
    if day == 0:
        return WeekDay.MONDAY
    if day == 1:
        return WeekDay.TUESDAY
    if day == 2:
        return WeekDay.WEDNESDAY
    if day == 3:
        return WeekDay.THURSDAY
    if day == 4:
        return WeekDay.FRIDAY
    if day == 5:
        return WeekDay.SATURDAY
    if day == 6:
        return WeekDay.SUNDAY
    else:
        raise ValueError(f"Weekday for {day} doesn't exist")


@tasks_router.get("/{section}")
async def get_tasks(
    section: SectionType = Path(..., description="Section: active, future, or done"),
    session = Depends(get_session)
) -> List[Task]:
    """Get all tasks for a specific section without sorting (sorting will be done in frontend)."""
    statement = select(Task).where(Task.section == section).where(Task.is_deleted != True)
    tasks = session.exec(statement).all()
    if section == SectionType.ACTIVE:
        day = get_current_weekday()
        statement = select(Task).where(text(f"task.section = 'DONE' AND json_strip_nulls(regularity) is null AND '{day.value}'  IN (SELECT json_array_elements_text(task.regularity))"))
        regular_tasks = session.exec(statement).all()
        tasks.extend(regular_tasks)
    
    return tasks

