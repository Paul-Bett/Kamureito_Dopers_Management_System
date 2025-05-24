from typing import Optional
from datetime import date
from decimal import Decimal
from pydantic import BaseModel, Field
from app.db.models.sheep import SheepStatus, SheepSex, SheepSection


class SheepBase(BaseModel):
    tag_id: str = Field(..., description="Unique tag ID (e.g., GRN-001)")
    scrapie_id: Optional[str] = Field(None, description="Scrapie disease ID")
    breed: str = Field(..., description="Sheep breed")
    sex: SheepSex = Field(..., description="Sheep sex")
    date_of_birth: date = Field(..., description="Date of birth")
    purchase_date: Optional[date] = Field(None, description="Date of purchase")
    acquisition_price: Optional[Decimal] = Field(None, description="Purchase price")
    origin_farm: Optional[str] = Field(None, description="Origin farm or lot")
    rfid_code: Optional[str] = Field(None, description="RFID code")
    qr_code: Optional[str] = Field(None, description="QR code")
    notes: Optional[str] = Field(None, description="Additional notes")


class SheepCreate(SheepBase):
    sire_id: Optional[str] = Field(None, description="Sire's tag ID")
    dam_id: Optional[str] = Field(None, description="Dam's tag ID")


class SheepUpdate(BaseModel):
    scrapie_id: Optional[str] = None
    breed: Optional[str] = None
    status: Optional[SheepStatus] = None
    current_section: Optional[SheepSection] = None
    sale_date: Optional[date] = None
    sale_price: Optional[Decimal] = None
    death_date: Optional[date] = None
    notes: Optional[str] = None


class SheepFilter(BaseModel):
    status: Optional[SheepStatus] = None
    sex: Optional[SheepSex] = None
    section: Optional[SheepSection] = None
    breed: Optional[str] = None


class SheepResponse(SheepBase):
    status: SheepStatus
    current_section: SheepSection
    sale_date: Optional[date] = None
    sale_price: Optional[Decimal] = None
    death_date: Optional[date] = None
    sire_id: Optional[str] = None
    dam_id: Optional[str] = None

    class Config:
        from_attributes = True 