from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class ProgressUpdate(BaseModel):
    pattern_id: str
    score: int  # 0-5


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    pattern_id: str
    ease_factor: float = 2.5
    interval_days: int = 1
    next_review_date: date
    repetitions: int = 0
    last_score: int = 0
    updated_at: Optional[datetime] = None
