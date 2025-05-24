from typing import List, Optional
from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.models.health_event import HealthEvent, EventType
from app.schemas.health import HealthEventCreate, HealthEventUpdate, HealthEventFilter


def create_health_event(db: Session, event_in: HealthEventCreate) -> HealthEvent:
    """Create a new health event record."""
    db_event = HealthEvent(
        sheep_id=event_in.sheep_id,
        event_date=event_in.event_date,
        event_type=event_in.event_type,
        details=event_in.details,
        next_due_date=event_in.next_due_date,
        attachments=event_in.attachments
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_health_event(db: Session, event_id: int) -> Optional[HealthEvent]:
    """Get a health event by ID."""
    return db.query(HealthEvent).filter(HealthEvent.id == event_id).first()


def update_health_event(db: Session, event_id: int, event_in: HealthEventUpdate) -> Optional[HealthEvent]:
    """Update a health event record."""
    db_event = get_health_event(db, event_id)
    if not db_event:
        return None
    
    update_data = event_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_event, field, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_health_event(db: Session, event_id: int) -> bool:
    """Delete a health event record."""
    db_event = get_health_event(db, event_id)
    if not db_event:
        return False
    
    db.delete(db_event)
    db.commit()
    return True


def list_health_events(db: Session, filters: HealthEventFilter) -> List[HealthEvent]:
    """List health event records with optional filtering."""
    query = db.query(HealthEvent)
    
    if filters.sheep_id:
        query = query.filter(HealthEvent.sheep_id == filters.sheep_id)
    if filters.event_type:
        query = query.filter(HealthEvent.event_type == filters.event_type)
    if filters.start_date:
        query = query.filter(HealthEvent.event_date >= filters.start_date)
    if filters.end_date:
        query = query.filter(HealthEvent.event_date <= filters.end_date)
    if filters.overdue:
        query = query.filter(
            and_(
                HealthEvent.next_due_date.isnot(None),
                HealthEvent.next_due_date < date.today()
            )
        )
    
    return query.order_by(HealthEvent.event_date.desc()).all()


def get_overdue_events(db: Session) -> List[HealthEvent]:
    """Get all overdue health events."""
    return db.query(HealthEvent).filter(
        and_(
            HealthEvent.next_due_date.isnot(None),
            HealthEvent.next_due_date < date.today()
        )
    ).order_by(HealthEvent.next_due_date.asc()).all() 