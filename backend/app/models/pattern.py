from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExampleBase(BaseModel):
    sentence_en: str
    sentence_ko: str
    native_tip: Optional[str] = None
    audio_url: Optional[str] = None
    source: str = "manual"
    difficulty: int = 1


class PatternBase(BaseModel):
    category: str
    subcategory: Optional[str] = None
    pattern_template: str
    explanation_ko: str
    dev_analogy: Optional[str] = None
    cefr_level: str = "A1"
    difficulty_order: int = 1


class PatternResponse(PatternBase):
    id: str
    examples: list[ExampleBase] = []
    created_at: Optional[datetime] = None


class SceneResponse(BaseModel):
    id: str
    name_ko: str
    name_en: str
    description: Optional[str] = None
    visual_layout: Optional[str] = None
    cefr_level: str = "A1"
    patterns: list[PatternResponse] = []
