from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services.notifications import get_all_notifications
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def check_notifications():
    """Check for notifications and send them to appropriate recipients."""
    try:
        db = SessionLocal()
        notifications = get_all_notifications(db)
        
        for notification in notifications:
            # Here you would implement the actual notification sending logic
            # For example, sending emails, push notifications, etc.
            logger.info(
                f"Notification: {notification.title} - {notification.message} "
                f"(Recipient: {notification.recipient}, Priority: {notification.priority})"
            )
            
    except Exception as e:
        logger.error(f"Error checking notifications: {str(e)}")
    finally:
        db.close()


def start_scheduler():
    """Start the scheduler with configured jobs."""
    if not scheduler.running:
        # Check for notifications every day at 8 AM
        scheduler.add_job(
            check_notifications,
            CronTrigger(hour=8, minute=0),
            id="daily_notifications",
            name="Check daily notifications",
            replace_existing=True
        )
        
        scheduler.start()
        logger.info("Scheduler started successfully")


def shutdown_scheduler():
    """Shutdown the scheduler gracefully."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler shut down successfully") 