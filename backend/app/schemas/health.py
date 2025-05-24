from typing import Optional, List
from datetime import date
from pydantic import BaseModel, Field
from app.db.models.health_event import EventType


class HealthEventBase(BaseModel):
    sheep_id: str = Field(..., description="Sheep tag ID")
    event_date: date = Field(..., description="Date of the health event")
    event_type: EventType = Field(..., description="Type of health event")
    details: str = Field(..., description="JSON string containing event details")
    next_due_date: Optional[date] = Field(None, description="Next due date for recurring events")
    attachments: Optional[str] = Field(None, description="JSON string containing file paths/URLs")


class HealthEventCreate(HealthEventBase):
    pass


class HealthEventUpdate(BaseModel):
    event_date: Optional[date] = None
    event_type: Optional[EventType] = None
    details: Optional[str] = None
    next_due_date: Optional[date] = None
    attachments: Optional[str] = None


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