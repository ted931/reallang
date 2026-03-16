"""
네이버 오늘의 회화 크롤러 모듈.

네이버 사전의 "오늘의 회화" 데이터를 JSON API를 통해 수집합니다.
웹 페이지(https://learn.dict.naver.com/conversation#/endic/{date})는
AngularJS SPA로 구현되어 있어 서버사이드 HTML에 데이터가 포함되지 않습니다.
대신 내부 Gateway API(gateway.dict.naver.com)가 JSON 형태로 데이터를 반환합니다.

robots.txt 참고사항:
    gateway.dict.naver.com의 robots.txt는 "Disallow: /"로 설정되어 있습니다.
    이 크롤러는 개인 학습 목적으로만 사용하세요.
    대량 수집이나 상업적 용도로 사용하지 마세요.
    Naver 이용약관을 반드시 확인하시기 바랍니다.

SPA 관련 참고:
    learn.dict.naver.com/conversation 페이지는 AngularJS 기반 SPA입니다.
    서버에서 반환하는 HTML에는 빈 data-ui-view 컨테이너만 있고,
    실제 콘텐츠는 JavaScript가 Gateway API를 호출하여 렌더링합니다.
    따라서 Playwright/Selenium 등의 브라우저 자동화 없이는 HTML 파싱이 불가능합니다.
    이 모듈은 Gateway API를 직접 호출하는 방식으로 구현되어 있어
    httpx만으로 데이터를 수집할 수 있습니다.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

# 네이버 사전 Gateway API 기본 URL
NAVER_GATEWAY_BASE = "https://gateway.dict.naver.com"

# 오늘의 회화 API 경로 템플릿
# 형식: /{dictCode}/{skin}/{service}/today/{date}/conversation.dict
CONVERSATION_API_PATH = "/endic/en/enko/today/{date}/conversation.dict"

# 요청 간 대기 시간 (초) - 서버 부하 방지용 rate limiting
REQUEST_INTERVAL = 1.0

# 기본 User-Agent 헤더
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

# 기본 출력 경로
DEFAULT_OUTPUT_PATH = "data/naver_conversations.json"


def _strip_html_tags(text: str) -> str:
    """HTML 태그를 제거하고 순수 텍스트만 반환합니다.

    네이버 API 응답에는 <b>, <autoLink> 등의 HTML 태그가 포함되어 있어
    이를 제거하여 깨끗한 텍스트를 추출합니다.

    Args:
        text: HTML 태그가 포함된 문자열.

    Returns:
        태그가 제거된 순수 텍스트.
    """
    if not text:
        return ""
    soup = BeautifulSoup(text, "html.parser")
    return soup.get_text()


def _extract_key_expressions(entrys: list[dict]) -> list[str]:
    """API 응답의 entrys 필드에서 핵심 표현을 추출합니다.

    Args:
        entrys: API 응답의 entrys 리스트.

    Returns:
        핵심 표현 문자열 리스트.
    """
    expressions: list[str] = []
    for entry in entrys:
        orgnc_name = entry.get("orgnc_entry_name", "")
        if orgnc_name:
            expressions.append(orgnc_name)
    return expressions


def _parse_conversation_response(data: dict, date_str: str) -> dict | None:
    """API 응답 데이터를 정제된 대화 형식으로 파싱합니다.

    Args:
        data: API 응답의 data 필드.
        date_str: YYYYMMDD 형식의 날짜 문자열.

    Returns:
        정제된 대화 딕셔너리 또는 None (파싱 실패 시).
        형식:
        {
            "date": "2026-03-16",
            "title_ko": "몇 분만 가면 나와요.",
            "title_en": "Only a few minutes away.",
            "dialogues": [
                {"speaker": "A", "en": "...", "ko": "..."},
                ...
            ],
            "key_expressions": ["farmer's market", "Cornish", ...],
            "source_url": "https://learn.dict.naver.com/conversation#/endic/20260316"
        }
    """
    if not data:
        return None

    # 날짜 형식 변환: YYYYMMDD -> YYYY-MM-DD
    formatted_date = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"

    title_en = data.get("title", "")
    title_ko = data.get("title_translation", "")

    # 대화 문장 파싱
    dialogues: list[dict] = []
    sentences = data.get("sentences", [])

    # disp_seq 기준으로 정렬
    sorted_sentences = sorted(sentences, key=lambda s: s.get("disp_seq", 0))

    for sentence in sorted_sentences:
        # orgnc_sentence에서 HTML 태그 제거하여 원문 영어 문장 추출
        en_text = _strip_html_tags(sentence.get("orgnc_sentence", ""))
        ko_text = sentence.get("trsl_orgnc_sentence", "")
        speaker = sentence.get("speaker", "")

        if en_text and ko_text:
            dialogues.append({
                "speaker": speaker,
                "en": en_text.strip(),
                "ko": ko_text.strip(),
            })

    # 핵심 표현 추출
    entrys = data.get("entrys", []) or []
    key_expressions = _extract_key_expressions(entrys)

    if not dialogues:
        logger.warning("대화 문장이 없습니다: %s", date_str)
        return None

    return {
        "date": formatted_date,
        "title_ko": title_ko,
        "title_en": title_en,
        "dialogues": dialogues,
        "key_expressions": key_expressions,
        "source_url": f"https://learn.dict.naver.com/conversation#/endic/{date_str}",
    }


async def fetch_conversation(
    date_str: str,
    client: httpx.AsyncClient | None = None,
) -> dict | None:
    """특정 날짜의 오늘의 회화 데이터를 수집합니다.

    Args:
        date_str: YYYYMMDD 형식의 날짜 문자열.
        client: 재사용할 httpx.AsyncClient (None이면 새로 생성).

    Returns:
        파싱된 대화 딕셔너리 또는 None (수집 실패 시).
    """
    should_close = False
    if client is None:
        client = httpx.AsyncClient(
            timeout=httpx.Timeout(30.0),
            follow_redirects=True,
            headers={
                "User-Agent": DEFAULT_USER_AGENT,
                "Referer": "https://learn.dict.naver.com/conversation",
            },
        )
        should_close = True

    try:
        api_path = CONVERSATION_API_PATH.format(date=date_str)
        url = f"{NAVER_GATEWAY_BASE}{api_path}"

        logger.debug("API 요청: %s", url)
        response = await client.get(url)
        response.raise_for_status()

        result = response.json()

        # API 응답 상태 확인
        meta = result.get("meta", {})
        status = meta.get("status")

        if status != 1:
            message = meta.get("message", "알 수 없는 오류")
            logger.warning(
                "API 오류 응답 (%s): status=%s, message=%s",
                date_str, status, message,
            )
            return None

        data = result.get("data")
        if not data:
            logger.warning("데이터 없음: %s", date_str)
            return None

        return _parse_conversation_response(data, date_str)

    except httpx.HTTPStatusError as e:
        logger.error("HTTP 오류 (%s): %d %s", date_str, e.response.status_code, e)
        return None
    except httpx.RequestError as e:
        logger.error("요청 오류 (%s): %s", date_str, e)
        return None
    except json.JSONDecodeError as e:
        logger.error("JSON 파싱 오류 (%s): %s", date_str, e)
        return None
    except Exception as e:
        logger.error("예상치 못한 오류 (%s): %s", date_str, e)
        return None
    finally:
        if should_close:
            await client.aclose()


async def fetch_conversations(
    start_date: date,
    end_date: date,
    rate_limit: float = REQUEST_INTERVAL,
    output_path: str | None = DEFAULT_OUTPUT_PATH,
) -> list[dict]:
    """날짜 범위에 해당하는 오늘의 회화 데이터를 일괄 수집합니다.

    robots.txt 주의:
        gateway.dict.naver.com의 robots.txt는 Disallow: / 입니다.
        개인 학습 목적으로만 소량 수집하시고,
        대량 수집이나 상업적 용도로는 사용하지 마세요.

    Args:
        start_date: 수집 시작 날짜 (포함).
        end_date: 수집 종료 날짜 (포함).
        rate_limit: 요청 간 대기 시간 (초). 기본 1.0초.
        output_path: 결과 JSON 저장 경로. None이면 저장하지 않음.

    Returns:
        수집된 대화 리스트.

    Raises:
        ValueError: start_date가 end_date보다 이후인 경우.
    """
    if start_date > end_date:
        raise ValueError(
            f"start_date({start_date})가 end_date({end_date})보다 이후입니다."
        )

    # 날짜 범위 생성
    total_days = (end_date - start_date).days + 1
    dates: list[str] = []
    current = start_date
    while current <= end_date:
        dates.append(current.strftime("%Y%m%d"))
        current += timedelta(days=1)

    logger.info(
        "네이버 오늘의 회화 수집 시작: %s ~ %s (%d일)",
        start_date.isoformat(), end_date.isoformat(), total_days,
    )

    conversations: list[dict] = []

    async with httpx.AsyncClient(
        timeout=httpx.Timeout(30.0),
        follow_redirects=True,
        headers={
            "User-Agent": DEFAULT_USER_AGENT,
            "Referer": "https://learn.dict.naver.com/conversation",
        },
    ) as client:
        for idx, date_str in enumerate(dates):
            if idx > 0:
                await asyncio.sleep(rate_limit)

            logger.debug("수집 중 [%d/%d]: %s", idx + 1, len(dates), date_str)
            conversation = await fetch_conversation(date_str, client=client)

            if conversation is not None:
                conversations.append(conversation)

            # 진행 상황 로깅 (10일마다)
            if (idx + 1) % 10 == 0:
                logger.info(
                    "진행: %d/%d 완료 (성공: %d)",
                    idx + 1, len(dates), len(conversations),
                )

    logger.info(
        "네이버 오늘의 회화 수집 완료: %d/%d 성공",
        len(conversations), total_days,
    )

    # JSON 파일 저장
    if output_path and conversations:
        save_conversations(conversations, output_path)

    return conversations


def save_conversations(
    conversations: list[dict],
    output_path: str = DEFAULT_OUTPUT_PATH,
) -> None:
    """수집된 대화 데이터를 JSON 파일로 저장합니다.

    Args:
        conversations: 저장할 대화 리스트.
        output_path: 출력 JSON 파일 경로.
    """
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "source": "naver_daily_conversation",
        "source_url": "https://learn.dict.naver.com/conversation#/endic/",
        "total": len(conversations),
        "conversations": conversations,
    }

    with open(output, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    logger.info("네이버 회화 데이터 저장: %s (%d건)", output_path, len(conversations))


def convert_to_seed_patterns(
    conversations: list[dict],
    output_path: str = "data/seed_patterns_naver.json",
) -> list[dict]:
    """네이버 회화 데이터를 RealLang의 seed_patterns.json 형식으로 변환합니다.

    각 대화에서 핵심 표현(key_expressions)을 패턴으로 추출하고,
    대화 문장을 예문으로 구성합니다.

    RealLang seed_patterns.json 형식:
    {
        "patterns": [
            {
                "category": str,
                "subcategory": str,
                "pattern_template": str,
                "explanation_ko": str,
                "dev_analogy": str,
                "cefr_level": str,
                "difficulty_order": int,
                "examples": [
                    {
                        "sentence_en": str,
                        "sentence_ko": str,
                        "native_tip": str,
                        "difficulty": int,
                        "source": str,
                    }
                ]
            }
        ]
    }

    Args:
        conversations: 네이버 회화 데이터 리스트.
        output_path: 출력 JSON 파일 경로.

    Returns:
        변환된 패턴 리스트.
    """
    patterns: list[dict] = []
    seen_patterns: set[str] = set()

    for conversation in conversations:
        title_ko = conversation.get("title_ko", "")
        title_en = conversation.get("title_en", "")
        dialogues = conversation.get("dialogues", [])
        key_expressions = conversation.get("key_expressions", [])
        conv_date = conversation.get("date", "")

        # 카테고리 자동 분류
        category = _classify_category(dialogues)

        # 핵심 표현이 있는 경우 각각을 패턴으로 변환
        if key_expressions:
            for expression in key_expressions:
                # 중복 방지
                pattern_key = expression.lower().strip()
                if pattern_key in seen_patterns:
                    continue
                seen_patterns.add(pattern_key)

                # 해당 표현이 포함된 대화 문장을 예문으로 선택
                examples = _find_examples_for_expression(
                    expression, dialogues, conv_date,
                )

                if not examples:
                    continue

                pattern_template = _generate_pattern_template(expression)

                patterns.append({
                    "category": category,
                    "subcategory": title_ko or title_en,
                    "pattern_template": pattern_template,
                    "explanation_ko": f"'{expression}'의 실제 대화 사용법 (네이버 오늘의 회화)",
                    "dev_analogy": "",
                    "cefr_level": "A2",
                    "difficulty_order": len(patterns) + 1,
                    "examples": examples,
                })
        else:
            # 핵심 표현이 없으면 전체 대화를 하나의 패턴으로
            if not dialogues:
                continue

            pattern_key = title_en.lower().strip()
            if pattern_key in seen_patterns:
                continue
            seen_patterns.add(pattern_key)

            examples = []
            for dlg in dialogues[:5]:
                examples.append({
                    "sentence_en": dlg["en"],
                    "sentence_ko": dlg["ko"],
                    "native_tip": "",
                    "difficulty": 2,
                    "source": f"naver_conversation_{conv_date}",
                })

            patterns.append({
                "category": category,
                "subcategory": title_ko or title_en,
                "pattern_template": title_en,
                "explanation_ko": title_ko or "네이버 오늘의 회화",
                "dev_analogy": "",
                "cefr_level": "A2",
                "difficulty_order": len(patterns) + 1,
                "examples": examples,
            })

    # JSON 저장
    if output_path and patterns:
        output = Path(output_path)
        output.parent.mkdir(parents=True, exist_ok=True)

        payload = {"patterns": patterns}
        with open(output, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

        logger.info(
            "seed_patterns 변환 저장: %s (%d개 패턴)",
            output_path, len(patterns),
        )

    return patterns


def _classify_category(dialogues: list[dict]) -> str:
    """대화 내용을 기반으로 카테고리를 자동 분류합니다.

    Args:
        dialogues: 대화 문장 리스트.

    Returns:
        분류된 카테고리 문자열.
    """
    combined_text = " ".join(d.get("en", "") for d in dialogues).lower()

    category_keywords: dict[str, list[str]] = {
        "Greeting": [
            "nice to meet", "hello", "hi ", "how are you", "good morning",
            "good afternoon", "good evening",
        ],
        "Request": [
            "could you", "can you", "would you", "please", "i'd like",
            "i want to", "help me",
        ],
        "Travel": [
            "airport", "hotel", "flight", "train", "bus", "travel",
            "trip", "ticket", "direction", "map", "market",
        ],
        "Shopping": [
            "buy", "price", "cost", "shop", "store", "pay", "expensive",
            "cheap", "sale", "discount",
        ],
        "Food": [
            "restaurant", "cafe", "coffee", "food", "menu", "order",
            "eat", "drink", "meal", "delicious", "try the",
        ],
        "Daily": [
            "work", "study", "school", "home", "morning", "evening",
            "weekend", "plan", "schedule",
        ],
        "Opinion": [
            "i think", "i believe", "in my opinion", "i feel",
        ],
        "Suggestion": [
            "you should", "how about", "why don't", "let's", "make sure",
        ],
    }

    # 가장 많은 키워드가 매칭되는 카테고리 선택
    best_category = "Daily"
    best_count = 0

    for category, keywords in category_keywords.items():
        count = sum(1 for kw in keywords if kw in combined_text)
        if count > best_count:
            best_count = count
            best_category = category

    return best_category


def _find_examples_for_expression(
    expression: str,
    dialogues: list[dict],
    conv_date: str,
) -> list[dict]:
    """특정 표현이 포함된 대화 문장을 예문 형식으로 반환합니다.

    Args:
        expression: 찾을 핵심 표현.
        dialogues: 대화 문장 리스트.
        conv_date: 대화 날짜 (YYYY-MM-DD).

    Returns:
        seed_patterns 형식의 예문 리스트.
    """
    examples: list[dict] = []
    expression_lower = expression.lower()

    # 먼저 해당 표현이 직접 포함된 문장 찾기
    for dlg in dialogues:
        if expression_lower in dlg.get("en", "").lower():
            examples.append({
                "sentence_en": dlg["en"],
                "sentence_ko": dlg["ko"],
                "native_tip": "",
                "difficulty": 2,
                "source": f"naver_conversation_{conv_date}",
            })

    # 직접 포함된 문장이 없으면 전체 대화의 첫 2문장을 예문으로
    if not examples:
        for dlg in dialogues[:2]:
            examples.append({
                "sentence_en": dlg["en"],
                "sentence_ko": dlg["ko"],
                "native_tip": "",
                "difficulty": 2,
                "source": f"naver_conversation_{conv_date}",
            })

    return examples[:5]  # 최대 5개


def _generate_pattern_template(expression: str) -> str:
    """핵심 표현에서 패턴 템플릿을 생성합니다.

    Args:
        expression: 핵심 표현 문자열.

    Returns:
        패턴 템플릿 문자열.
    """
    # 이미 충분히 짧은 표현은 그대로 사용
    if len(expression.split()) <= 4:
        return expression

    # 긴 표현은 "..." 으로 축약
    words = expression.split()
    return " ".join(words[:3]) + " + ..."


async def run_naver_conversation_pipeline(
    start_date: date | None = None,
    end_date: date | None = None,
    days_back: int = 7,
    output_path: str = DEFAULT_OUTPUT_PATH,
    seed_patterns_output: str = "data/seed_patterns_naver.json",
) -> dict[str, Any]:
    """네이버 오늘의 회화 수집 파이프라인을 실행합니다.

    Args:
        start_date: 수집 시작 날짜. None이면 end_date로부터 days_back일 전.
        end_date: 수집 종료 날짜. None이면 오늘.
        days_back: start_date가 None일 때 오늘로부터 며칠 전까지 수집할지.
        output_path: 대화 데이터 JSON 저장 경로.
        seed_patterns_output: seed_patterns 형식 JSON 저장 경로.

    Returns:
        파이프라인 실행 결과 요약.
    """
    if end_date is None:
        end_date = date.today()
    if start_date is None:
        start_date = end_date - timedelta(days=days_back - 1)

    logger.info("네이버 오늘의 회화 파이프라인 시작")

    # 대화 데이터 수집
    conversations = await fetch_conversations(
        start_date=start_date,
        end_date=end_date,
        output_path=output_path,
    )

    # seed_patterns 변환
    patterns: list[dict] = []
    if conversations:
        patterns = convert_to_seed_patterns(
            conversations,
            output_path=seed_patterns_output,
        )

    result = {
        "source": "naver_daily_conversation",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "total_days": (end_date - start_date).days + 1,
        "conversations_collected": len(conversations),
        "patterns_generated": len(patterns),
        "output_path": output_path,
        "seed_patterns_output": seed_patterns_output,
    }

    logger.info(
        "네이버 오늘의 회화 파이프라인 완료: %d개 대화, %d개 패턴",
        len(conversations), len(patterns),
    )

    return result
