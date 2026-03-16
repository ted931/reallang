import json
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.models.pattern import PatternResponse, ExampleBase, SceneResponse

router = APIRouter(prefix="/lessons", tags=["lessons"])

# Load seed data from JSON file
_DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "seed_patterns.json"
_seed_data: dict | None = None


def _load_seed_data() -> dict:
    """Load and cache seed data from JSON file."""
    global _seed_data
    if _seed_data is None:
        with open(_DATA_PATH, "r", encoding="utf-8") as f:
            _seed_data = json.load(f)
    return _seed_data


def _build_pattern_response(idx: int, p: dict) -> PatternResponse:
    """Convert a raw pattern dict to PatternResponse."""
    examples = [
        ExampleBase(**ex)
        for ex in p.get("examples", [])
    ]
    return PatternResponse(
        id=f"pattern-{idx + 1:03d}",
        category=p["category"],
        subcategory=p.get("subcategory"),
        pattern_template=p["pattern_template"],
        explanation_ko=p["explanation_ko"],
        dev_analogy=p.get("dev_analogy"),
        cefr_level=p.get("cefr_level", "A1"),
        difficulty_order=p.get("difficulty_order", 1),
        examples=examples,
        created_at=None,
    )


@router.get("/categories")
async def get_categories():
    """Get all available categories with pattern counts."""
    data = _load_seed_data()
    category_map: dict[str, int] = {}
    for p in data.get("patterns", []):
        cat = p["category"]
        category_map[cat] = category_map.get(cat, 0) + 1
    categories = [
        {"name": name, "pattern_count": count}
        for name, count in category_map.items()
    ]
    return {"categories": categories}


@router.get("/scenes")
async def get_scenes():
    """Get all available scenes."""
    data = _load_seed_data()
    scenes = []
    for idx, s in enumerate(data.get("scenes", [])):
        scenes.append(
            SceneResponse(
                id=f"scene-{idx + 1:03d}",
                name_ko=s["name_ko"],
                name_en=s["name_en"],
                description=s.get("description"),
                visual_layout=s.get("visual_layout"),
                cefr_level=s.get("cefr_level", "A1"),
                patterns=[],
            )
        )
    return {"scenes": scenes}


@router.get("/")
async def get_lessons(
    category: Optional[str] = Query(None, description="Filter by category"),
    cefr_level: Optional[str] = Query(None, description="Filter by CEFR level"),
):
    """Get all patterns, optionally filtered by category or CEFR level."""
    data = _load_seed_data()
    results: list[PatternResponse] = []
    for idx, p in enumerate(data.get("patterns", [])):
        if category and p["category"] != category:
            continue
        if cefr_level and p.get("cefr_level", "A1") != cefr_level:
            continue
        results.append(_build_pattern_response(idx, p))
    return {"patterns": results}


@router.get("/{pattern_id}")
async def get_lesson(pattern_id: str):
    """Get a single pattern by ID with examples."""
    data = _load_seed_data()
    patterns = data.get("patterns", [])

    # Extract index from pattern_id (e.g. "pattern-001" -> 0)
    try:
        idx = int(pattern_id.replace("pattern-", "")) - 1
    except (ValueError, IndexError):
        raise HTTPException(status_code=404, detail="Pattern not found")

    if idx < 0 or idx >= len(patterns):
        raise HTTPException(status_code=404, detail="Pattern not found")

    return _build_pattern_response(idx, patterns[idx])
