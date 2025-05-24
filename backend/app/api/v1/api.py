from fastapi import APIRouter
from app.api.v1.endpoints import sheep, health_events, notifications

api_router = APIRouter()

api_router.include_router(sheep.router, prefix="/sheep", tags=["sheep"])
api_router.include_router(health_events.router, prefix="/health-events", tags=["health-events"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"]) 