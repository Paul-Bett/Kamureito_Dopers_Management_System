from typing import List, Optional
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.db.models.health_event import HealthEvent
from app.db.models.mating_pair import MatingPair
from app.db.models.sheep import Sheep
from app.services.health import get_overdue_events


class NotificationType:
    HEALTH_OVERDUE = "health_overdue"
    MATING_WINDOW = "mating_window"
    WEANING_DUE = "weaning_due"
    HEALTH_FOLLOWUP = "health_followup"
    INBREEDING_ALERT = "inbreeding_alert"


class Notification:
    def __init__(
        self,
        type: str,
        title: str,
        message: str,
        recipient: str,
        priority: str = "normal",
        data: dict = None
    ):
        self.type = type
        self.title = title
        self.message = message
        self.recipient = recipient
        self.priority = priority
        self.data = data or {}


def get_health_notifications(db: Session) -> List[Notification]:
    """Get notifications for overdue health events."""
    notifications = []
    overdue_events = get_overdue_events(db)
    
    for event in overdue_events:
        sheep = db.query(Sheep).filter(Sheep.tag_id == event.sheep_id).first()
        if not sheep:
            continue
            
        days_overdue = (date.today() - event.next_due_date).days
        notifications.append(Notification(
            type=NotificationType.HEALTH_OVERDUE,
            title="Overdue Health Event",
            message=f"Sheep {sheep.tag_id} is overdue for {event.event_type} by {days_overdue} days",
            recipient="herd_care_team",
            priority="high" if days_overdue > 7 else "normal",
            data={
                "sheep_id": sheep.tag_id,
                "event_id": event.id,
                "event_type": event.event_type,
                "days_overdue": days_overdue
            }
        ))
    
    return notifications


def get_mating_notifications(db: Session) -> List[Notification]:
    """Get notifications for upcoming mating windows."""
    notifications = []
    two_weeks_from_now = date.today() + timedelta(days=14)
    
    upcoming_mating = db.query(MatingPair).filter(
        MatingPair.mating_start_date <= two_weeks_from_now,
        MatingPair.mating_start_date > date.today()
    ).all()
    
    for mating in upcoming_mating:
        ewe = db.query(Sheep).filter(Sheep.tag_id == mating.ewe_id).first()
        if not ewe:
            continue
            
        days_until = (mating.mating_start_date - date.today()).days
        notifications.append(Notification(
            type=NotificationType.MATING_WINDOW,
            title="Upcoming Mating Window",
            message=f"Ewe {ewe.tag_id} due for mating in {days_until} days. Group slot: {mating.group_slot}",
            recipient="farm_manager",
            data={
                "ewe_id": ewe.tag_id,
                "mating_id": mating.id,
                "group_slot": mating.group_slot,
                "days_until": days_until
            }
        ))
    
    return notifications


def get_weaning_notifications(db: Session) -> List[Notification]:
    """Get notifications for upcoming weaning dates."""
    notifications = []
    two_weeks_from_now = date.today() + timedelta(days=14)
    
    # Query birth records with upcoming weaning dates
    upcoming_weaning = db.query(BirthRecord).filter(
        BirthRecord.expected_wean_date <= two_weeks_from_now,
        BirthRecord.expected_wean_date > date.today(),
        BirthRecord.date_weaned.is_(None)  # Not yet weaned
    ).all()
    
    for record in upcoming_weaning:
        ewe = db.query(Sheep).filter(Sheep.tag_id == record.ewe_id).first()
        if not ewe:
            continue
            
        days_until = (record.expected_wean_date - date.today()).days
        notifications.append(Notification(
            type=NotificationType.WEANING_DUE,
            title="Weaning Due",
            message=f"Lambs of Ewe {ewe.tag_id} expected to wean in {days_until} days",
            recipient="shepherd",
            data={
                "ewe_id": ewe.tag_id,
                "birth_record_id": record.id,
                "days_until": days_until
            }
        ))
    
    return notifications


def get_all_notifications(db: Session) -> List[Notification]:
    """Get all notifications from all sources."""
    notifications = []
    notifications.extend(get_health_notifications(db))
    notifications.extend(get_mating_notifications(db))
    notifications.extend(get_weaning_notifications(db))
    return notifications 