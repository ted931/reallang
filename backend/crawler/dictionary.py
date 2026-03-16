"""
Free Dictionary API를 활용한 단어 정보 수집 모듈.

API: https://api.dictionaryapi.dev/api/v2/entries/en/{word}
무료 API로 단어의 정의, 발음(phonetic), 예문, 유의어를 수집합니다.
Rate limiting(0.5초 간격)을 적용하여 서버 부하를 방지합니다.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en"

# Rate limiting 간격 (초)
REQUEST_INTERVAL = 0.5


async def fetch_word_info(
    word: str,
    client: httpx.AsyncClient | None = None,
) -> dict | None:
    """단어 정보를 Free Dictionary API에서 조회합니다.

    Args:
        word: 조회할 영어 단어.
        client: 재사용할 httpx.AsyncClient (None이면 새로 생성).

    Returns:
        단어 정보 딕셔너리 또는 None (조회 실패 시).
        형식: {
            "word": str,
            "phonetic": str,
            "meanings": [
                {
                    "partOfSpeech": str,
                    "definitions": [
                        {
                            "definition": str,
                            "example": str | None,
                            "synonyms": [str],
                        }
                    ]
                }
            ]
        }
    """
    should_close = False
    if client is None:
        client = httpx.AsyncClient(timeout=httpx.Timeout(30.0))
        should_close = True

    try:
        url = f"{DICTIONARY_API_BASE}/{word.strip().lower()}"
        response = await client.get(url)

        if response.status_code == 404:
            logger.warning("단어를 찾을 수 없음: %s", word)
            return None

        response.raise_for_status()
        data = response.json()

        if not isinstance(data, list) or len(data) == 0:
            logger.warning("빈 응답: %s", word)
            return None

        return _parse_word_response(word, data)

    except httpx.HTTPStatusError as e:
        logger.error("HTTP 오류 (%s): %d %s", word, e.response.status_code, e)
        return None
    except httpx.RequestError as e:
        logger.error("요청 오류 (%s): %s", word, e)
        return None
    except Exception as e:
        logger.error("예상치 못한 오류 (%s): %s", word, e)
        return None
    finally:
        if should_close:
            await client.aclose()


def _parse_word_response(word: str, data: list[dict[str, Any]]) -> dict:
    """API 응답을 정제된 형식으로 파싱합니다.

    Args:
        word: 조회한 단어.
        data: API 응답 데이터 (리스트).

    Returns:
        정제된 단어 정보 딕셔너리.
    """
    entry = data[0]

    # phonetic 추출: phonetic 필드 또는 phonetics 배열에서 찾기
    phonetic = entry.get("phonetic", "")
    if not phonetic:
        phonetics_list = entry.get("phonetics", [])
        for p in phonetics_list:
            if p.get("text"):
                phonetic = p["text"]
                break

    # meanings 추출
    meanings: list[dict] = []
    for meaning in entry.get("meanings", []):
        part_of_speech = meaning.get("partOfSpeech", "")
        definitions: list[dict] = []

        for defn in meaning.get("definitions", []):
            definition_text = defn.get("definition", "")
            example = defn.get("example")
            synonyms = defn.get("synonyms", [])

            if definition_text:
                definitions.append({
                    "definition": definition_text,
                    "example": example,
                    "synonyms": synonyms[:5],  # 유의어 최대 5개
                })

        if definitions:
            meanings.append({
                "partOfSpeech": part_of_speech,
                "definitions": definitions,
            })

    return {
        "word": word.strip().lower(),
        "phonetic": phonetic,
        "meanings": meanings,
    }


async def fetch_words_batch(
    words: list[str],
    rate_limit: float = REQUEST_INTERVAL,
) -> list[dict]:
    """여러 단어를 일괄 조회합니다 (rate limiting 적용).

    Args:
        words: 조회할 단어 리스트.
        rate_limit: 요청 간 대기 시간 (초). 기본 0.5초.

    Returns:
        조회 성공한 단어 정보 리스트 (실패한 단어는 제외).
    """
    results: list[dict] = []
    total = len(words)

    # 중복 제거
    unique_words = list(dict.fromkeys(w.strip().lower() for w in words if w.strip()))
    logger.info("단어 일괄 조회 시작: %d개 (중복 제거 후 %d개)", total, len(unique_words))

    async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
        for idx, word in enumerate(unique_words):
            if idx > 0:
                await asyncio.sleep(rate_limit)

            logger.debug("조회 중 [%d/%d]: %s", idx + 1, len(unique_words), word)
            result = await fetch_word_info(word, client=client)

            if result is not None:
                results.append(result)

            # 진행 상황 로깅 (50개마다)
            if (idx + 1) % 50 == 0:
                logger.info(
                    "진행: %d/%d 완료 (성공: %d)",
                    idx + 1, len(unique_words), len(results),
                )

    logger.info(
        "단어 일괄 조회 완료: %d/%d 성공",
        len(results), len(unique_words),
    )
    return results


async def enrich_pairs_with_vocabulary(
    pairs: list[dict],
    max_words: int = 500,
) -> list[dict]:
    """문장쌍에서 주요 단어를 추출하고 사전 정보를 보강합니다.

    Args:
        pairs: 영-한 문장쌍 리스트 ([{"en": str, "ko": str, ...}]).
        max_words: 조회할 최대 단어 수.

    Returns:
        사전 정보가 포함된 단어 리스트.
    """
    # 문장에서 단어 추출 (빈도순 정렬)
    word_freq: dict[str, int] = {}
    stop_words = {
        "i", "me", "my", "we", "our", "you", "your", "he", "she", "it",
        "they", "them", "the", "a", "an", "is", "am", "are", "was", "were",
        "be", "been", "being", "have", "has", "had", "do", "does", "did",
        "will", "would", "could", "should", "may", "might", "shall", "can",
        "to", "of", "in", "for", "on", "with", "at", "by", "from", "as",
        "into", "through", "during", "before", "after", "and", "but", "or",
        "not", "no", "if", "then", "than", "that", "this", "these", "those",
        "what", "which", "who", "whom", "how", "when", "where", "why",
        "all", "each", "every", "both", "few", "more", "most", "other",
        "some", "such", "only", "own", "same", "so", "very", "just",
        "don", "t", "s", "d", "ll", "re", "ve", "m",
    }

    for pair in pairs:
        en_text = pair.get("en", "")
        # 간단한 토큰화: 알파벳만 남기고 소문자로
        tokens = en_text.lower().split()
        for token in tokens:
            cleaned = "".join(c for c in token if c.isalpha())
            if cleaned and len(cleaned) > 2 and cleaned not in stop_words:
                word_freq[cleaned] = word_freq.get(cleaned, 0) + 1

    # 빈도순 정렬 후 상위 max_words개 선택
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    target_words = [w for w, _ in sorted_words[:max_words]]

    logger.info("고유 단어 %d개 중 상위 %d개 조회 예정", len(word_freq), len(target_words))

    return await fetch_words_batch(target_words)
