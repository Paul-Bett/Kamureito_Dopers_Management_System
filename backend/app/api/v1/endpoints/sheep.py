from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.sheep import Sheep, SheepStatus, SheepSex, SheepSection
from app.schemas.sheep import (
    SheepCreate,
    SheepUpdate,
    SheepResponse,
    SheepFilter
)
from app.services.sheep import (
    create_sheep,
    get_sheep,
    update_sheep,
    delete_sheep,
    list_sheep,
    generate_tag_id
)

router = APIRouter()


@router.post("/", response_model=SheepResponse)
def create_new_sheep(
    sheep_in: SheepCreate,
    db: Session = Depends(get_db)
):
    """Create a new sheep record."""
    try:
        return create_sheep(db=db, sheep_in=sheep_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{tag_id}", response_model=SheepResponse)
def read_sheep(
    tag_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific sheep by tag ID."""
    sheep = get_sheep(db=db, tag_id=tag_id)
    if not sheep:
        raise HTTPException(status_code=404, detail="Sheep not found")
    return sheep


@router.put("/{tag_id}", response_model=SheepResponse)
def update_sheep_record(
    tag_id: str,
    sheep_in: SheepUpdate,
    db: Session = Depends(get_db)
):
    """Update a sheep record."""
    sheep = update_sheep(db=db, tag_id=tag_id, sheep_in=sheep_in)
    if not sheep:
        raise HTTPException(status_code=404, detail="Sheep not found")
    return sheep


@router.delete("/{tag_id}")
def delete_sheep_record(
    tag_id: str,
    db: Session = Depends(get_db)
):
    """Delete a sheep record."""
    success = delete_sheep(db=db, tag_id=tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sheep not found")
    return {"message": "Sheep deleted successfully"}


@router.get("/", response_model=List[SheepResponse])
def list_sheep_records(
    status: Optional[SheepStatus] = None,
    sex: Optional[SheepSex] = None,
    section: Optional[SheepSection] = None,
    breed: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List sheep records with optional filtering."""
    filters = SheepFilter(
        status=status,
        sex=sex,
        section=section,
        breed=breed
    )
    return list_sheep(db=db, filters=filters)


@router.get("/generate-tag/{color_code}", response_model=str)
def get_next_tag_id(
    color_code: str,
    db: Session = Depends(get_db)
):
    """Generate the next available tag ID for a given color code."""
    return generate_tag_id(db=db, color_code=color_code) 