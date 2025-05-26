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


class RegularityType(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    EVERY_X_DAYS = "everyXDays"


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
    regularity_type: RegularityType
    regularity_in_days: int | None = None
    regularity_week_days: Optional[List[WeekDay]] = Field(default=None, sa_column=Column(JSON))

    def validate_regularity(self):
        if self.regularity_type == RegularityType.DAILY:
            if self.regularity_in_days is not None:
                raise ValueError("regularity_in_days is not allowed when regularity_type is DAILY")
            if self.regularity_week_days is not None:
                raise ValueError("regularity_week_days is not allowed when regularity_type is DAILY")
        elif self.regularity_type == RegularityType.WEEKLY:
            if self.regularity_in_days is not None:
                raise ValueError("regularity_in_days is not allowed when regularity_type is WEEKLY")
            if self.regularity_week_days is None:
                raise ValueError("regularity_week_days is required when regularity_type is WEEKLY")
        elif self.regularity_type == RegularityType.EVERY_X_DAYS:
            if self.regularity_in_days is None:
                raise ValueError("regularity_in_days is required when regularity_type is EVERY_X_DAYS")
            

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    why: Optional[str] = None
    urgency: Optional[UrgencyLevel] = None
    section: Optional[SectionType] = None


class Task(TaskBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    completedAt: Optional[datetime] = None

