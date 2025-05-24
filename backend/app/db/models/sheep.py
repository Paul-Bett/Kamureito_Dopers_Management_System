from datetime import date
from sqlalchemy import Column, String, Date, Enum, ForeignKey, Text, Numeric
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum


class SheepStatus(str, enum.Enum):
    ACTIVE = "active"
    SOLD = "sold"
    DECEASED = "deceased"


class SheepSex(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"


class SheepSection(str, enum.Enum):
    MALE = "male"
    GENERAL = "general"
    MATING = "mating"


class Sheep(Base):
    # Core identification
    tag_id = Column(String(20), unique=True, nullable=False, index=True)
    scrapie_id = Column(String(50), unique=True, nullable=True)
    breed = Column(String(50), nullable=False)
    sex = Column(Enum(SheepSex), nullable=False)
    
    # Dates
    date_of_birth = Column(Date, nullable=False)
    purchase_date = Column(Date, nullable=True)
    sale_date = Column(Date, nullable=True)
    death_date = Column(Date, nullable=True)
    
    # Financial
    acquisition_price = Column(Numeric(10, 2), nullable=True)
    sale_price = Column(Numeric(10, 2), nullable=True)
    
    # Status and location
    status = Column(Enum(SheepStatus), default=SheepStatus.ACTIVE, nullable=False)
    current_section = Column(Enum(SheepSection), default=SheepSection.GENERAL, nullable=False)
    
    # Origin and tracking
    origin_farm = Column(String(100), nullable=True)
    rfid_code = Column(String(50), unique=True, nullable=True)
    qr_code = Column(String(50), unique=True, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    sire_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=True)
    dam_id = Column(String(20), ForeignKey("sheep.tag_id"), nullable=True)
    
    # Define relationships
    sire = relationship("Sheep", remote_side=[tag_id], foreign_keys=[sire_id], backref="sired_offspring")
    dam = relationship("Sheep", remote_side=[tag_id], foreign_keys=[dam_id], backref="birthed_offspring")
    
    # Health and breeding relationships
    health_events = relationship("HealthEvent", back_populates="sheep")
    birth_records = relationship("BirthRecord", back_populates="ewe")
    mating_records = relationship("MatingPair", back_populates="sheep")
    section_history = relationship("SectionAssignment", back_populates="sheep")

    def __repr__(self):
        return f"<Sheep {self.tag_id}>" 