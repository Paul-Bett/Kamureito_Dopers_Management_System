from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.health import (
    HealthEventCreate,
    HealthEventUpdate,
    HealthEventResponse,
    HealthEventFilter
)
from app.services.health import (
    create_health_event,
    get_health_event,
    update_health_event,
    delete_health_event,
    list_health_events,
    get_overdue_events
)

router = APIRouter()


@router.post("/", response_model=HealthEventResponse)
def create_new_health_event(
    event_in: HealthEventCreate,
    db: Session = Depends(get_db)
):
    """Create a new health event record."""
    return create_health_event(db=db, event_in=event_in)


@router.get("/{event_id}", response_model=HealthEventResponse)
def read_health_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific health event by ID."""
    event = get_health_event(db=db, event_id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Health event not found")
    return event


@router.put("/{event_id}", response_model=HealthEventResponse)
def update_health_event_record(
    event_id: int,
    event_in: HealthEventUpdate,
    db: Session = Depends(get_db)
):
    """Update a health event record."""
    event = update_health_event(db=db, event_id=event_id, event_in=event_in)
    if not event:
        raise HTTPException(status_code=404, detail="Health event not found")
    return event


@router.delete("/{event_id}")
def delete_health_event_record(
    event_id: int,
    db: Session = Depends(get_db)
):
    """Delete a health event record."""
    success = delete_health_event(db=db, event_id=event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Health event not found")
    return {"message": "Health event deleted successfully"}


@router.get("/", response_model=List[HealthEventResponse])
def list_health_event_records(
    sheep_id: Optional[str] = None,
    event_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    overdue: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """List health event records with optional filtering."""
    filters = HealthEventFilter(
        sheep_id=sheep_id,
        event_type=event_type,
        start_date=start_date,
        end_date=end_date,
        overdue=overdue
    )
    return list_health_events(db=db, filters=filters)


@router.get("/overdue/", response_model=List[HealthEventResponse])
def list_overdue_events(
    db: Session = Depends(get_db)
):
    """List all overdue health events."""
    return get_overdue_events(db=db) 