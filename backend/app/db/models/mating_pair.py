from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class MatingPair(Base):
    __tablename__ = "mating_pairs"

    id = Column(Integer, primary_key=True, index=True)
    ram_id = Column(String, ForeignKey("sheep.id"), nullable=False)
    ewe_id = Column(String, ForeignKey("sheep.id"), nullable=False)
    
    # Timing
    mating_start_date = Column(Date, nullable=False)
    expected_lambing_date = Column(Date, nullable=True)
    actual_lambing_date = Column(Date, nullable=True)
    
    # Group management
    group_slot = Column(Integer, nullable=True)  # For group mating scenarios
    
    # Success tracking
    pregnancy_confirmed = Column(Boolean, default=False)
    pregnancy_failed = Column(Boolean, default=False)
    failure_reason = Column(Text, nullable=True)
    
    # Override tracking
    override_user = Column(String, nullable=True)  # For manual overrides
    override_reason = Column(Text, nullable=True)
    
    created_at = Column(Date, default=datetime.utcnow)
    updated_at = Column(Date, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ram = relationship("Sheep", foreign_keys=[ram_id], back_populates="mating_pairs_as_ram")
    ewe = relationship("Sheep", foreign_keys=[ewe_id], back_populates="mating_pairs_as_ewe")
    
    def __repr__(self):
        return f"<MatingPair {self.ram_id} - {self.ewe_id}>" 