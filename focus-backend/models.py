from enum import Enum
import os
import uuid
from datetime import datetime
from typing import List, Literal, Optional

from sqlmodel import Field, SQLModel, JSON, Column
from sqlalchemy import ARRAY, String

class UrgencyLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class SectionType(str, Enum):
    ACTIVE = "active"
    FUTURE = "future"
    DONE = "done"       

class WeekDay(str, Enum):
    MONDAY = "MO"
    TUESDAY = "TU"
    WEDNESDAY = "WE"
    THURSDAY = "TH"
    FRIDAY = "FR"
    SATURDAY = "SA"
    SUNDAY = "SU"

class TaskBase(SQLModel):
    title: str
    why: str
    urgency: UrgencyLevel = UrgencyLevel.LOW
    section: SectionType = SectionType.ACTIVE
    plannedDate: Optional[datetime] = None
    regularity: Optional[List[WeekDay]] = Field(default=None, sa_column=Column(JSON))
    is_deleted: bool = False
            

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    why: Optional[str] = None
    urgency: Optional[UrgencyLevel] = None
    section: Optional[SectionType] = None


class Task(TaskBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    completedAt: Optional[datetime] = None

