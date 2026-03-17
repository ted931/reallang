#!/usr/bin/env python3
"""매일 네이버 오늘의회화를 크롤링하여 seed_patterns.json에 추가"""
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

try:
    import httpx
except ImportError:
    os.system(f"{sys.executable} -m pip install httpx beautifulsoup4 -q")
    import httpx

from bs4 import BeautifulSoup

# 경로 설정
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "seed_patterns.json"
FRONTEND_DATA = BASE_DIR / "frontend" / "src" / "data" / "seed_patterns.json"
LOG_FILE = BASE_DIR / "scripts" / "crawl.log"

NAVER_API = "https://gateway.dict.naver.com/endic/en/enko/today/{date}/conversation.dict"

# 카테고리 키워드 매핑
CATEGORY_KEYWORDS = {
    "Travel": ["airport", "hotel", "flight", "travel", "tourist", "luggage", "passport", "ticket", "boarding"],
    "Ordering": ["order", "menu", "restaurant", "food", "eat", "drink", "coffee", "lunch", "dinner", "breakfast", "cafe", "waiter"],
    "Shopping": ["buy", "shop", "store", "price", "discount", "pay", "size", "try on", "mall"],
    "Hospital & Pharmacy": ["doctor", "hospital", "sick", "medicine", "health", "pain", "appointment", "pharmacy"],
    "Hotel & Accommodation": ["check in", "room", "reservation", "stay", "checkout", "hotel"],
    "Work & Office": ["meeting", "office", "work", "project", "deadline", "boss", "colleague", "presentation"],
    "Banking & Money": ["bank", "money", "account", "transfer", "exchange", "card", "ATM"],
    "Directions": ["direction", "turn", "street", "map", "lost", "way", "bus stop", "station"],
    "Weather": ["weather", "rain", "sunny", "cold", "hot", "snow", "umbrella", "forecast"],
    "Entertainment & Hobbies": ["movie", "music", "game", "hobby", "concert", "show", "fun", "play"],
    "Education": ["study", "school", "class", "teacher", "learn", "homework", "exam", "university"],
    "Phone": ["call", "phone", "text", "message", "ring"],
    "Greeting": ["hello", "hi", "nice to meet", "how are you", "goodbye"],
    "Daily": [],  # default
}

def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def strip_html(text):
    if not text:
        return text
    return BeautifulSoup(text, "html.parser").get_text()

def classify_category(dialogues):
    text = " ".join(d.get("en", "") for d in dialogues).lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if cat == "Daily":
            continue
        if any(kw in text for kw in keywords):
            return cat
    return "Daily"

def determine_cefr(dialogues):
    total_words = sum(len(d.get("en", "").split()) for d in dialogues)
    avg_words = total_words / max(len(dialogues), 1)
    if avg_words <= 6:
        return "A1"
    elif avg_words <= 10:
        return "A2"
    elif avg_words <= 15:
        return "B1"
    else:
        return "B2"

def fetch_conversation(date_str):
    """네이버 오늘의회화 API에서 대화 데이터 가져오기"""
    url = NAVER_API.format(date=date_str)
    try:
        with httpx.Client(timeout=10) as client:
            resp = client.get(url, headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://learn.dict.naver.com/"
            })
            if resp.status_code != 200:
                return None
            data = resp.json()
            if not data or "items" not in data:
                return None

            dialogues = []
            key_expressions = []
            title_ko = data.get("title", "")
            title_en = data.get("titleEn", "")

            for item in data.get("items", []):
                if item.get("type") == "dialogue":
                    for entry in item.get("entries", []):
                        en = strip_html(entry.get("orgnc_sentence", ""))
                        ko = strip_html(entry.get("trans_sentence", ""))
                        speaker = entry.get("speaker", "")
                        if en and ko:
                            dialogues.append({"speaker": speaker, "en": en, "ko": ko})
                elif item.get("type") == "expression":
                    for entry in item.get("entries", []):
                        exp = strip_html(entry.get("orgnc_sentence", ""))
                        if exp:
                            key_expressions.append(exp)

            if not dialogues:
                return None

            return {
                "date": date_str,
                "title_ko": title_ko,
                "title_en": title_en,
                "dialogues": dialogues,
                "key_expressions": key_expressions,
            }
    except Exception as e:
        log(f"  Error fetching {date_str}: {e}")
        return None

def conversation_to_pattern(conv, difficulty_order):
    """대화 데이터를 패턴 형식으로 변환"""
    dialogues = conv["dialogues"]
    category = classify_category(dialogues)
    cefr = determine_cefr(dialogues)

    # 핵심 표현이 있으면 패턴 템플릿으로 사용
    if conv["key_expressions"]:
        pattern_template = conv["key_expressions"][0]
    elif conv["title_en"]:
        pattern_template = conv["title_en"]
    else:
        pattern_template = dialogues[0]["en"]

    # 예문 5개 생성 (대화에서 추출)
    examples = []
    for d in dialogues[:5]:
        examples.append({
            "sentence_en": d["en"],
            "sentence_ko": d["ko"],
            "native_tip": f"화자 {d['speaker']}의 표현" if d.get("speaker") else "대화 표현",
            "difficulty": cefr,
            "source": f"네이버 오늘의회화 {conv['date']}"
        })

    # 5개 미만이면 나머지 대화에서 추가
    for d in dialogues[5:]:
        if len(examples) >= 5:
            break
        examples.append({
            "sentence_en": d["en"],
            "sentence_ko": d["ko"],
            "native_tip": "추가 대화 표현",
            "difficulty": cefr,
            "source": f"네이버 오늘의회화 {conv['date']}"
        })

    return {
        "category": category,
        "subcategory": conv.get("title_ko", "일상 대화"),
        "pattern_template": pattern_template,
        "explanation_ko": conv.get("title_ko", "오늘의 회화 표현"),
        "dev_analogy": f"매일 새로운 API endpoint를 배우는 것처럼, 오늘의 패턴 '{pattern_template}'도 실전에서 자주 호출됩니다.",
        "cefr_level": cefr,
        "difficulty_order": difficulty_order,
        "examples": examples,
    }

def get_existing_dates(patterns):
    """이미 크롤링된 날짜 목록 반환"""
    dates = set()
    for p in patterns:
        for ex in p.get("examples", []):
            source = ex.get("source", "")
            if "네이버 오늘의회화" in source:
                date_part = source.replace("네이버 오늘의회화 ", "").strip()
                if date_part:
                    dates.add(date_part)
    return dates

def main():
    log("=== Daily crawl started ===")

    # 데이터 로드
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing_dates = get_existing_dates(data["patterns"])
    max_order = max((p["difficulty_order"] for p in data["patterns"]), default=0)

    # 최근 7일치 크롤링 시도 (이미 있는 날짜는 건너뜀)
    new_patterns = []
    today = datetime.now()

    for days_back in range(0, 7):
        target_date = today - timedelta(days=days_back)
        date_str = target_date.strftime("%Y%m%d")

        if date_str in existing_dates:
            log(f"  Skip {date_str} (already exists)")
            continue

        conv = fetch_conversation(date_str)
        if conv:
            max_order += 1
            pattern = conversation_to_pattern(conv, max_order)
            new_patterns.append(pattern)
            log(f"  Added: {date_str} - {conv['title_ko']} ({pattern['category']}, {pattern['cefr_level']})")
        else:
            log(f"  No data for {date_str}")

    if not new_patterns:
        log("No new patterns to add.")
        return False

    # 저장
    data["patterns"].extend(new_patterns)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 프론트엔드 데이터도 업데이트
    with open(FRONTEND_DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    log(f"=== Done: +{len(new_patterns)} patterns, total {len(data['patterns'])} ===")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
