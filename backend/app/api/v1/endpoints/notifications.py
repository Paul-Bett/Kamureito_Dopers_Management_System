from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.notifications import (
    get_all_notifications,
    get_health_notifications,
    get_mating_notifications,
    get_weaning_notifications,
    Notification
)
from app.schemas.notification import NotificationResponse


router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
def list_all_notifications(
    db: Session = Depends(get_db)
):
    """Get all notifications."""
    notifications = get_all_notifications(db)
    return [NotificationResponse.from_notification(n) for n in notifications]


@router.get("/health", response_model=List[NotificationResponse])
def list_health_notifications(
    db: Session = Depends(get_db)
):
    """Get health-related notifications."""
    notifications = get_health_notifications(db)
    return [NotificationResponse.from_notification(n) for n in notifications]


@router.get("/mating", response_model=List[NotificationResponse])
def list_mating_notifications(
    db: Session = Depends(get_db)
):
    """Get mating-related notifications."""
    notifications = get_mating_notifications(db)
    return [NotificationResponse.from_notification(n) for n in notifications]


@router.get("/weaning", response_model=List[NotificationResponse])
def list_weaning_notifications(
    db: Session = Depends(get_db)
):
    """Get weaning-related notifications."""
    notifications = get_weaning_notifications(db)
    return [NotificationResponse.from_notification(n) for n in notifications] 