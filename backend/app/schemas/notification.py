from typing import Optional, Dict
from pydantic import BaseModel
from app.services.notifications import Notification


class NotificationResponse(BaseModel):
    type: str
    title: str
    message: str
    recipient: str
    priority: str
    data: Optional[Dict] = None

    @classmethod
    def from_notification(cls, notification: Notification) -> "NotificationResponse":
        return cls(
            type=notification.type,
            title=notification.title,
            message=notification.message,
            recipient=notification.recipient,
            priority=notification.priority,
            data=notification.data
        ) 