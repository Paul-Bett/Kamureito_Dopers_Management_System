from typing import Optional, List
from datetime import date
from pydantic import BaseModel, Field
from app.db.models.health_event import EventType


class HealthEventBase(BaseModel):
    sheep_id: str
    event_date: date
    event_type: EventType
    details: str
    next_due_date: Optional[date] = None
    attachments: Optional[List[str]] = None


class HealthEventCreate(HealthEventBase):
    pass


class HealthEventUpdate(BaseModel):
    event_date: Optional[date] = None
    event_type: Optional[EventType] = None
    details: Optional[str] = None
    next_due_date: Optional[date] = None
    attachments: Optional[List[str]] = None


class HealthEventResponse(HealthEventBase):
    id: int

    class Config:
        from_attributes = True


class HealthEventFilter(BaseModel):
    sheep_id: Optional[str] = None
    event_type: Optional[EventType] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    overdue: Optional[bool] = None 