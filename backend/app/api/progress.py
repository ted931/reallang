import uuid
from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Query

from app.models.progress import ProgressUpdate, ProgressResponse
from app.services.srs import calculate_srs

router = APIRouter(prefix="/progress", tags=["progress"])

# In-memory storage for progress data (keyed by user_id -> pattern_id)
_progress_store: dict[str, dict[str, ProgressResponse]] = {}

DEFAULT_USER_ID = "user-default"


def _get_user_store(user_id: str) -> dict[str, ProgressResponse]:
    """Get or create the progress store for a user."""
    if user_id not in _progress_store:
        _progress_store[user_id] = {}
    return _progress_store[user_id]


@router.get("/")
async def get_progress(
    user_id: str = Query(DEFAULT_USER_ID, description="User ID"),
):
    """Get all progress records for a user."""
    store = _get_user_store(user_id)
    return {"progress": list(store.values())}


@router.post("/review")
async def review_pattern(
    update: ProgressUpdate,
    user_id: str = Query(DEFAULT_USER_ID, description="User ID"),
):
    """Record a review result and update SRS scheduling."""
    store = _get_user_store(user_id)

    existing = store.get(update.pattern_id)

    if existing:
        ease = existing.ease_factor
        interval = existing.interval_days
        reps = existing.repetitions
    else:
        ease = 2.5
        interval = 1
        reps = 0

    new_ease, new_interval, new_reps = calculate_srs(
        ease, interval, reps, update.score
    )

    now = datetime.utcnow()
    next_review = date.today() + timedelta(days=new_interval)

    progress = ProgressResponse(
        id=existing.id if existing else str(uuid.uuid4()),
        user_id=user_id,
        pattern_id=update.pattern_id,
        ease_factor=round(new_ease, 2),
        interval_days=new_interval,
        next_review_date=next_review,
        repetitions=new_reps,
        last_score=update.score,
        updated_at=now,
    )

    store[update.pattern_id] = progress

    return progress


@router.get("/today")
async def get_today_reviews(
    user_id: str = Query(DEFAULT_USER_ID, description="User ID"),
):
    """Get patterns that are due for review today."""
    store = _get_user_store(user_id)
    today = date.today()
    due = [
        p for p in store.values()
        if p.next_review_date <= today
    ]
    return {"due_count": len(due), "patterns": due}
