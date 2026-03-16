"""
데이터 수집 파이프라인 오케스트레이터.

Tatoeba, VOA, Dictionary API 등 여러 데이터 소스를 통합하여
영어 학습 데이터를 수집, 정제, 저장하는 파이프라인입니다.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .dictionary import enrich_pairs_with_vocabulary, fetch_words_batch
from .tatoeba import (
    build_pairs,
    download_tatoeba_data,
    parse_sentences,
    save_pairs,
)
from .voa import extract_patterns, fetch_voa_articles, parse_article

logger = logging.getLogger(__name__)

# 기본 설정
DEFAULT_CONFIG: dict[str, Any] = {
    "data_dir": "data",
    "tatoeba_dir": "data/tatoeba",
    "tatoeba_output": "data/tatoeba_pairs.json",
    "voa_output": "data/voa_articles.json",
    "vocabulary_output": "data/vocabulary.json",
    "patterns_output": "data/patterns.json",
    "pipeline_output": "data/pipeline_result.json",
    "voa_max_pages": 3,
    "voa_sections": ["beginning", "intermediate", "lets_learn"],
    "max_vocabulary_words": 300,
    "min_sentence_length": 3,
    "max_sentence_length": 50,
    "enable_tatoeba": True,
    "enable_voa": True,
    "enable_dictionary": True,
    "supabase_upload": False,
}

# 패턴 분류에 사용되는 카테고리 정규식
CATEGORY_PATTERNS: dict[str, list[re.Pattern]] = {
    "Greeting": [
        re.compile(r"\b(hello|hi|hey|good morning|good afternoon|good evening)\b", re.I),
        re.compile(r"\bhow are you\b", re.I),
        re.compile(r"\bnice to meet\b", re.I),
    ],
    "Request": [
        re.compile(r"\b(could you|can you|would you|please)\b", re.I),
        re.compile(r"\bI'?d like\b", re.I),
        re.compile(r"\bI want to\b", re.I),
    ],
    "Question": [
        re.compile(r"\b(what|where|when|who|why|how|which)\b", re.I),
        re.compile(r"\bdo you\b", re.I),
        re.compile(r"\bhave you\b", re.I),
    ],
    "Opinion": [
        re.compile(r"\bI think\b", re.I),
        re.compile(r"\bI believe\b", re.I),
        re.compile(r"\bin my opinion\b", re.I),
        re.compile(r"\bI feel\b", re.I),
    ],
    "Suggestion": [
        re.compile(r"\byou should\b", re.I),
        re.compile(r"\bhow about\b", re.I),
        re.compile(r"\bwhy don'?t\b", re.I),
        re.compile(r"\blet'?s\b", re.I),
    ],
    "Daily": [
        re.compile(r"\b(eat|sleep|work|study|read|write|cook|clean)\b", re.I),
    ],
    "Travel": [
        re.compile(r"\b(airport|hotel|ticket|flight|train|bus|travel|trip)\b", re.I),
    ],
    "Shopping": [
        re.compile(r"\b(buy|price|cost|shop|store|pay|money|cheap|expensive)\b", re.I),
    ],
    "Food": [
        re.compile(r"\b(restaurant|cafe|coffee|food|menu|order|eat|drink|meal)\b", re.I),
    ],
}


async def run_pipeline(config: dict | None = None) -> dict:
    """전체 데이터 수집 파이프라인을 실행합니다.

    1. Tatoeba 데이터 다운로드 및 파싱
    2. VOA 기사 크롤링
    3. 사전 API로 단어 정보 보강
    4. 데이터 정제 및 중복 제거
    5. 결과를 data/ 디렉토리에 JSON으로 저장

    Args:
        config: 파이프라인 설정 딕셔너리. None이면 기본 설정 사용.

    Returns:
        파이프라인 실행 결과 요약.
    """
    cfg = {**DEFAULT_CONFIG, **(config or {})}
    start_time = datetime.now(timezone.utc)

    logger.info("=" * 60)
    logger.info("데이터 수집 파이프라인 시작: %s", start_time.isoformat())
    logger.info("=" * 60)

    # 데이터 디렉토리 생성
    Path(cfg["data_dir"]).mkdir(parents=True, exist_ok=True)

    result: dict[str, Any] = {
        "started_at": start_time.isoformat(),
        "config": {k: v for k, v in cfg.items() if not k.startswith("_")},
        "steps": {},
    }

    # -------------------------------------------------------
    # Step 1: Tatoeba 데이터
    # -------------------------------------------------------
    tatoeba_pairs: list[dict] = []
    if cfg["enable_tatoeba"]:
        logger.info("[Step 1/5] Tatoeba 데이터 수집")
        try:
            await download_tatoeba_data(cfg["tatoeba_dir"])

            sentences_path = os.path.join(cfg["tatoeba_dir"], "sentences.csv")
            links_path = os.path.join(cfg["tatoeba_dir"], "links.csv")

            sentences = parse_sentences(sentences_path, {"eng", "kor"})
            tatoeba_pairs = build_pairs(sentences, links_path)

            # 품질 필터링 적용
            tatoeba_pairs = filter_quality(
                tatoeba_pairs,
                min_len=cfg["min_sentence_length"],
                max_len=cfg["max_sentence_length"],
            )

            save_pairs(tatoeba_pairs, cfg["tatoeba_output"])

            result["steps"]["tatoeba"] = {
                "status": "success",
                "total_sentences": len(sentences),
                "total_pairs": len(tatoeba_pairs),
            }
            logger.info("[Step 1/5] Tatoeba 완료: %d개 문장쌍", len(tatoeba_pairs))
        except Exception as e:
            logger.error("[Step 1/5] Tatoeba 실패: %s", e)
            result["steps"]["tatoeba"] = {"status": "error", "error": str(e)}
    else:
        logger.info("[Step 1/5] Tatoeba 비활성화, 건너뜀")
        result["steps"]["tatoeba"] = {"status": "skipped"}

    # -------------------------------------------------------
    # Step 2: VOA 기사 크롤링
    # -------------------------------------------------------
    voa_articles: list[dict] = []
    voa_sentences: list[str] = []
    if cfg["enable_voa"]:
        logger.info("[Step 2/5] VOA Learning English 크롤링")
        try:
            article_list = await fetch_voa_articles(
                max_pages=cfg["voa_max_pages"],
                sections=cfg["voa_sections"],
            )

            # 개별 기사 파싱 (동시성 제한)
            semaphore = asyncio.Semaphore(3)

            async def _parse_with_limit(url: str) -> dict:
                async with semaphore:
                    return await parse_article(url)

            tasks = [_parse_with_limit(a["url"]) for a in article_list[:50]]
            parsed_articles = await asyncio.gather(*tasks, return_exceptions=True)

            for article in parsed_articles:
                if isinstance(article, Exception):
                    logger.warning("기사 파싱 오류: %s", article)
                    continue
                if article.get("content"):
                    voa_articles.append(article)
                    voa_sentences.extend(article.get("sentences", []))

            # VOA 기사 저장
            _save_json(
                {"total": len(voa_articles), "articles": voa_articles},
                cfg["voa_output"],
            )

            result["steps"]["voa"] = {
                "status": "success",
                "articles_found": len(article_list),
                "articles_parsed": len(voa_articles),
                "total_sentences": len(voa_sentences),
            }
            logger.info(
                "[Step 2/5] VOA 완료: %d개 기사, %d개 문장",
                len(voa_articles), len(voa_sentences),
            )
        except Exception as e:
            logger.error("[Step 2/5] VOA 실패: %s", e)
            result["steps"]["voa"] = {"status": "error", "error": str(e)}
    else:
        logger.info("[Step 2/5] VOA 비활성화, 건너뜀")
        result["steps"]["voa"] = {"status": "skipped"}

    # -------------------------------------------------------
    # Step 3: 사전 API로 단어 정보 보강
    # -------------------------------------------------------
    vocabulary: list[dict] = []
    if cfg["enable_dictionary"]:
        logger.info("[Step 3/5] 사전 API 단어 정보 수집")
        try:
            if tatoeba_pairs:
                vocabulary = await enrich_pairs_with_vocabulary(
                    tatoeba_pairs,
                    max_words=cfg["max_vocabulary_words"],
                )
            elif voa_sentences:
                # Tatoeba 데이터가 없으면 VOA 문장에서 단어 추출
                pseudo_pairs = [{"en": s} for s in voa_sentences]
                vocabulary = await enrich_pairs_with_vocabulary(
                    pseudo_pairs,
                    max_words=cfg["max_vocabulary_words"],
                )

            if vocabulary:
                _save_json(
                    {"total": len(vocabulary), "words": vocabulary},
                    cfg["vocabulary_output"],
                )

            result["steps"]["dictionary"] = {
                "status": "success",
                "words_collected": len(vocabulary),
            }
            logger.info("[Step 3/5] 사전 완료: %d개 단어", len(vocabulary))
        except Exception as e:
            logger.error("[Step 3/5] 사전 실패: %s", e)
            result["steps"]["dictionary"] = {"status": "error", "error": str(e)}
    else:
        logger.info("[Step 3/5] 사전 비활성화, 건너뜀")
        result["steps"]["dictionary"] = {"status": "skipped"}

    # -------------------------------------------------------
    # Step 4: 패턴 추출 및 분류
    # -------------------------------------------------------
    logger.info("[Step 4/5] 패턴 추출 및 문장 분류")
    try:
        # VOA 문장에서 패턴 추출
        patterns = extract_patterns(voa_sentences) if voa_sentences else []

        # Tatoeba 문장쌍을 패턴별로 분류
        classified = classify_by_pattern(tatoeba_pairs) if tatoeba_pairs else {}

        pattern_data = {
            "voa_patterns": patterns,
            "classified_pairs": {k: len(v) for k, v in classified.items()},
            "classified_samples": {
                k: v[:5] for k, v in classified.items()
            },
        }

        _save_json(pattern_data, cfg["patterns_output"])

        result["steps"]["patterns"] = {
            "status": "success",
            "voa_patterns": len(patterns),
            "categories": len(classified),
            "classified_total": sum(len(v) for v in classified.values()),
        }
        logger.info(
            "[Step 4/5] 패턴 완료: VOA %d종, 분류 %d 카테고리",
            len(patterns), len(classified),
        )
    except Exception as e:
        logger.error("[Step 4/5] 패턴 실패: %s", e)
        result["steps"]["patterns"] = {"status": "error", "error": str(e)}

    # -------------------------------------------------------
    # Step 5: 최종 결과 저장
    # -------------------------------------------------------
    logger.info("[Step 5/5] 최종 결과 저장")
    end_time = datetime.now(timezone.utc)
    elapsed = (end_time - start_time).total_seconds()

    result["completed_at"] = end_time.isoformat()
    result["elapsed_seconds"] = round(elapsed, 2)
    result["summary"] = {
        "tatoeba_pairs": len(tatoeba_pairs),
        "voa_articles": len(voa_articles),
        "voa_sentences": len(voa_sentences),
        "vocabulary_words": len(vocabulary),
    }

    _save_json(result, cfg["pipeline_output"])

    logger.info("=" * 60)
    logger.info("파이프라인 완료 (%.1f초)", elapsed)
    logger.info(
        "결과: Tatoeba %d쌍, VOA %d기사/%d문장, 어휘 %d개",
        len(tatoeba_pairs), len(voa_articles),
        len(voa_sentences), len(vocabulary),
    )
    logger.info("=" * 60)

    return result


def classify_by_pattern(pairs: list[dict]) -> dict[str, list[dict]]:
    """문장쌍을 패턴(카테고리)별로 분류합니다.

    CATEGORY_PATTERNS에 정의된 정규식을 사용하여 영어 문장을
    카테고리별로 분류합니다. 하나의 문장이 여러 카테고리에
    해당할 수 있습니다.

    Args:
        pairs: 문장쌍 리스트 ([{"en": str, "ko": str, ...}]).

    Returns:
        카테고리별 문장쌍 딕셔너리: {"Greeting": [...], "Request": [...], ...}
    """
    classified: dict[str, list[dict]] = {}

    for pair in pairs:
        en_text = pair.get("en", "")
        if not en_text:
            continue

        matched = False
        for category, patterns in CATEGORY_PATTERNS.items():
            for pattern in patterns:
                if pattern.search(en_text):
                    if category not in classified:
                        classified[category] = []
                    classified[category].append(pair)
                    matched = True
                    break  # 같은 카테고리 내 중복 매칭 방지

        # 어떤 카테고리에도 매칭되지 않으면 "Other"로 분류
        if not matched:
            if "Other" not in classified:
                classified["Other"] = []
            classified["Other"].append(pair)

    logger.info(
        "패턴 분류 완료: %d개 카테고리, 총 %d개 문장쌍",
        len(classified),
        sum(len(v) for v in classified.values()),
    )

    return classified


def filter_quality(
    pairs: list[dict],
    min_len: int = 3,
    max_len: int = 50,
) -> list[dict]:
    """품질 필터링을 적용하여 부적합한 문장쌍을 제거합니다.

    필터링 기준:
    - 영어/한국어 문장의 단어 수가 min_len ~ max_len 범위
    - 빈 문장 제거
    - 중복 문장쌍 제거
    - 특수문자만으로 구성된 문장 제거

    Args:
        pairs: 필터링할 문장쌍 리스트.
        min_len: 최소 단어 수 (기본: 3).
        max_len: 최대 단어 수 (기본: 50).

    Returns:
        필터링된 문장쌍 리스트.
    """
    original_count = len(pairs)
    filtered: list[dict] = []
    seen: set[str] = set()

    for pair in pairs:
        en_text = pair.get("en", "").strip()
        ko_text = pair.get("ko", "").strip()

        # 빈 문장 필터링
        if not en_text or not ko_text:
            continue

        # 단어 수 필터링
        en_words = en_text.split()
        if len(en_words) < min_len or len(en_words) > max_len:
            continue

        # 특수문자만으로 구성된 문장 필터링
        if not any(c.isalpha() for c in en_text):
            continue
        if not any(c.isalpha() or c >= "\uac00" for c in ko_text):
            continue

        # 중복 제거 (영어 문장 기준)
        en_lower = en_text.lower()
        if en_lower in seen:
            continue
        seen.add(en_lower)

        filtered.append(pair)

    removed_count = original_count - len(filtered)
    logger.info(
        "품질 필터링: %d개 중 %d개 유지 (%d개 제거, 단어 수 %d~%d)",
        original_count, len(filtered), removed_count, min_len, max_len,
    )

    return filtered


def _save_json(data: Any, filepath: str) -> None:
    """데이터를 JSON 파일로 저장합니다.

    Args:
        data: 저장할 데이터.
        filepath: 출력 파일 경로.
    """
    output = Path(filepath)
    output.parent.mkdir(parents=True, exist_ok=True)

    with open(output, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    logger.info("JSON 저장: %s", filepath)
