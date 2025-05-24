from datetime import date
from sqlalchemy import Column, String, Date, ForeignKey, Text, Boolean, Integer
from sqlalchemy.orm import relationship
from app.db.base import Base


class MatingPair(Base):
    # Core information
    ram_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=False)
    ewe_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=False)
    
    # Timing
    mating_start_date = Column(Date, nullable=False)
    expected_lambing_date = Column(Date, nullable=False)
    actual_lambing_date = Column(Date, nullable=True)
    
    # Group management
    group_slot = Column(Integer, nullable=False)  # 1-12 for monthly rotation
    
    # Success tracking
    pregnancy_confirmed = Column(Boolean, default=False, nullable=False)
    pregnancy_failed = Column(Boolean, default=False, nullable=False)
    failure_reason = Column(Text, nullable=True)
    
    # Override tracking
    override_user = Column(String(50), nullable=True)
    override_reason = Column(Text, nullable=True)
    
    # Relationships
    ram = relationship("Sheep", foreign_keys=[ram_id], backref="ram_mating_records")
    ewe = relationship("Sheep", foreign_keys=[ewe_id], backref="ewe_mating_records")
    
    def __repr__(self):
        return f"<MatingPair {self.ram_id} - {self.ewe_id}>" 