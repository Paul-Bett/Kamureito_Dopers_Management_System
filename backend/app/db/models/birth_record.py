from datetime import date
from sqlalchemy import Column, String, Date, Enum, ForeignKey, Text, Numeric, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum


class BirthType(str, enum.Enum):
    SINGLE = "single"
    TWIN = "twin"
    TRIPLET = "triplet"
    QUADRUPLET = "quadruplet"


class RearingType(str, enum.Enum):
    NATURAL = "natural"
    FOSTERED = "fostered"


class BirthRecord(Base):
    # Core information
    ewe_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=False)
    sire_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=False)
    date_lambed = Column(Date, nullable=False)
    
    # Birth details
    birth_type = Column(Enum(BirthType), nullable=False)
    rearing_type = Column(Enum(RearingType), default=RearingType.NATURAL, nullable=False)
    dystocia = Column(Boolean, default=False, nullable=False)
    
    # Weaning information
    date_weaned = Column(Date, nullable=True)
    weaning_weight = Column(Numeric(5, 2), nullable=True)  # in kg
    expected_wean_date = Column(Date, nullable=True)
    
    # Lamb details (as JSON in notes)
    lamb_details = Column(Text, nullable=True)  # JSON string containing lamb IDs, weights, etc.
    
    # Mortality tracking
    mortality_flag = Column(Boolean, default=False, nullable=False)
    mortality_date = Column(Date, nullable=True)
    mortality_reason = Column(Text, nullable=True)
    
    # Comments and notes
    comments = Column(Text, nullable=True)
    
    # Relationships
    ewe = relationship("Sheep", foreign_keys=[ewe_id], back_populates="birth_records")
    sire = relationship("Sheep", foreign_keys=[sire_id])
    
    def __repr__(self):
        return f"<BirthRecord {self.ewe_id} - {self.date_lambed}>" 