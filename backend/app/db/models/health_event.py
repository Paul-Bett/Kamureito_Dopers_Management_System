from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class EventType(str, Enum):
    VACCINATION = "vaccination"
    TREATMENT = "treatment"
    CHECKUP = "checkup"
    OTHER = "other"

class HealthEvent(Base):
    __tablename__ = "health_events"

    id = Column(Integer, primary_key=True, index=True)
    sheep_id = Column(String, ForeignKey("sheep.id"), nullable=False)
    event_date = Column(Date, nullable=False)
    event_type = Column(Enum(EventType), nullable=False)
    details = Column(Text, nullable=False)
    next_due_date = Column(Date, nullable=True)
    attachments = Column(Text, nullable=True)  # JSON string of file paths/URLs
    created_at = Column(Date, default=datetime.utcnow)
    updated_at = Column(Date, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sheep = relationship("Sheep", back_populates="health_events")

    def __repr__(self):
        return f"<HealthEvent {self.sheep_id} - {self.event_type} - {self.event_date}>" 