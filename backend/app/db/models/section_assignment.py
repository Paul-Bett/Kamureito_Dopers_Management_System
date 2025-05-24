from datetime import date
from sqlalchemy import Column, String, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.db.models.sheep import SheepSection


class SectionAssignment(Base):
    # Core information
    sheep_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=False)
    section = Column(Enum(SheepSection), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)  # Null means current assignment
    
    # Movement details
    reason = Column(Text, nullable=False)  # e.g., "weaned", "sold", "moved for mating"
    
    # Relationships
    sheep = relationship("Sheep", back_populates="section_history")
    
    def __repr__(self):
        return f"<SectionAssignment {self.sheep_id} - {self.section} - {self.start_date}>" 