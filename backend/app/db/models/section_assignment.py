from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SheepSection(str, Enum):
    MALE = "male"
    GENERAL = "general"
    MATING = "mating"

class SectionAssignment(Base):
    __tablename__ = "section_assignments"

    id = Column(Integer, primary_key=True, index=True)
    sheep_id = Column(String, ForeignKey("sheep.id"), nullable=False)
    section = Column(Enum(SheepSection), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(Date, default=datetime.utcnow)
    updated_at = Column(Date, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sheep = relationship("Sheep", back_populates="section_assignments")

    def __repr__(self):
        return f"<SectionAssignment {self.sheep_id} - {self.section} - {self.start_date}>" 