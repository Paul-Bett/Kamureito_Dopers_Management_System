from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Text, Float, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class BirthType(str, Enum):
    SINGLE = "single"
    TWIN = "twin"
    TRIPLET = "triplet"
    QUADRUPLET = "quadruplet"

class RearingType(str, Enum):
    NATURAL = "natural"
    BOTTLE = "bottle"
    MIXED = "mixed"

class BirthRecord(Base):
    __tablename__ = "birth_records"

    id = Column(Integer, primary_key=True, index=True)
    ewe_id = Column(String, ForeignKey("sheep.id"), nullable=False)
    sire_id = Column(String, ForeignKey("sheep.id"), nullable=True)
    date_lambed = Column(Date, nullable=False)
    birth_type = Column(Enum(BirthType), nullable=False)
    rearing_type = Column(Enum(RearingType), nullable=False)
    dystocia = Column(Boolean, default=False)
    date_weaned = Column(Date, nullable=True)
    weaning_weight = Column(Float, nullable=True)
    expected_wean_date = Column(Date, nullable=True)
    lamb_details = Column(Text, nullable=True)  # JSON string containing lamb details
    mortality_flag = Column(Boolean, default=False)
    mortality_date = Column(Date, nullable=True)
    mortality_reason = Column(Text, nullable=True)
    comments = Column(Text, nullable=True)
    created_at = Column(Date, default=datetime.utcnow)
    updated_at = Column(Date, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    ewe = relationship("Sheep", foreign_keys=[ewe_id], back_populates="birth_records_as_ewe")
    sire = relationship("Sheep", foreign_keys=[sire_id], back_populates="birth_records_as_sire")

    def __repr__(self):
        return f"<BirthRecord {self.ewe_id} - {self.date_lambed}>" 