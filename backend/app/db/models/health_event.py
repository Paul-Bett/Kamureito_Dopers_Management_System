from datetime import date
from sqlalchemy import Column, String, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum


class EventType(str, enum.Enum):
    VACCINATION = "vaccination"
    DEWORMING = "deworming"
    VET_VISIT = "vet_visit"
    TREATMENT = "treatment"
    CHECKUP = "checkup"
    OTHER = "other"


class HealthEvent(Base):
    # Core information
    sheep_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=False)
    event_date = Column(Date, nullable=False)
    event_type = Column(Enum(EventType), nullable=False)
    
    # Event details
    details = Column(Text, nullable=False)  # JSON string containing treatment details
    next_due_date = Column(Date, nullable=True)
    
    # Attachments
    attachments = Column(Text, nullable=True)  # JSON string containing file paths/URLs
    
    # Relationships
    sheep = relationship("Sheep", back_populates="health_events")
    
    def __repr__(self):
        return f"<HealthEvent {self.sheep_id} - {self.event_type} - {self.event_date}>" 