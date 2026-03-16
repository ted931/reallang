"""
Breaking News English 크롤러 모듈.

URL: https://breakingnewsenglish.com/
뉴스 기반 ESL 학습 사이트에서 다양한 난이도(Level 0-6)의
기사, 빈칸 채우기 연습, 어휘를 수집합니다.

robots.txt 확인 완료: 모든 경로 허용 (Disallow 없음).
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup, Tag

logger = logging.getLogger(__name__)

BNE_BASE_URL = "https://breakingnewsenglish.com"

# 난이도 레벨 범위
BNE_LEVELS = list(range(7))  # Level 0-6

# Breaking News English 레벨 → CEFR 레벨 매핑
BNE_LEVEL_TO_CEFR: dict[str, str] = {
    "0": "A1",
    "1": "A1",
    "2": "A2",
    "3": "A2",
    "4": "B1",
    "5": "B1",
    "6": "B2",
}

# 기본 출력 경로
DEFAULT_OUTPUT_PATH = "data/breakingnews_articles.json"

# 문장 분리 정규식
SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")

# 빈칸 채우기 패턴: (1) ________________ 또는 (1) _____
GAP_FILL_RE = re.compile(r"\((\d+)\)\s*_{3,}")

# 요청 간 대기 시간 (초) - rate limiting
REQUEST_DELAY = 1.0

# HTTP 클라이언트 설정
HTTP_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
}
HTTP_TIMEOUT = httpx.Timeout(30.0)


async def fetch_article_links(
    max_articles: int = 50,
) -> list[dict[str, str]]:
    """메인 페이지에서 기사 링크를 수집합니다.

    Args:
        max_articles: 수집할 최대 기사 수.

    Returns:
        기사 정보 리스트: [{"title": str, "url": str, "date_text": str}]
    """
    logger.info("Breaking News English 메인 페이지에서 기사 링크 수집 시작")

    async with httpx.AsyncClient(
        timeout=HTTP_TIMEOUT,
        follow_redirects=True,
        headers=HTTP_HEADERS,
    ) as client:
        try:
            response = await client.get(BNE_BASE_URL)
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            logger.error("메인 페이지 로드 실패: %s", e)
            return []
        except httpx.RequestError as e:
            logger.error("메인 페이지 요청 오류: %s", e)
            return []

    soup = BeautifulSoup(response.text, "html.parser")
    articles: list[dict[str, str]] = []
    seen_urls: set[str] = set()

    # 기사 링크는 h3 > a 태그로 구성됨
    # URL 패턴: /YYMM/YYMMDD-slug.html
    article_link_re = re.compile(r"^\d{4}/\d{6}-[\w-]+\.html$")

    for a_tag in soup.find_all("a", href=True):
        href = a_tag.get("href", "")
        if isinstance(href, list):
            href = href[0] if href else ""

        # 기사 URL 패턴 매칭 (레벨별 URL 제외: -0.html, -1.html 등)
        if not article_link_re.match(href):
            continue

        # 레벨별 URL 제외 (예: ...-0.html, ...-1.html)
        if re.search(r"-\d\.html$", href):
            continue

        full_url = urljoin(BNE_BASE_URL + "/", href)
        if full_url in seen_urls:
            continue
        seen_urls.add(full_url)

        title = a_tag.get_text(strip=True)
        if not title or len(title) < 5:
            continue

        # 날짜 텍스트 추출: 다음 형제 요소에서 날짜 패턴 찾기
        date_text = _extract_date_near_element(a_tag)

        articles.append({
            "title": title,
            "url": full_url,
            "date_text": date_text,
        })

        if len(articles) >= max_articles:
            break

    logger.info("기사 링크 수집 완료: %d개", len(articles))
    return articles


def _extract_date_near_element(tag: Tag) -> str:
    """태그 주변에서 날짜 텍스트를 추출합니다.

    Args:
        tag: 기준 HTML 태그.

    Returns:
        날짜 텍스트 또는 빈 문자열.
    """
    date_re = re.compile(
        r"\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|"
        r"June|July|August|September|October|November|December)"
        r"(?:\s+\d{4})?",
        re.IGNORECASE,
    )

    # 부모 요소에서 날짜 찾기
    parent = tag.parent
    if parent:
        parent_text = parent.get_text(" ", strip=True)
        match = date_re.search(parent_text)
        if match:
            return match.group(0)

    # 이전/다음 형제 요소에서 날짜 찾기
    for sibling in [tag.next_sibling, tag.previous_sibling]:
        if sibling and hasattr(sibling, "get_text"):
            sib_text = sibling.get_text(strip=True)
            match = date_re.search(sib_text)
            if match:
                return match.group(0)
        elif isinstance(sibling, str):
            match = date_re.search(sibling)
            if match:
                return match.group(0)

    return ""


async def fetch_article_by_level(
    base_url: str,
    level: int,
    client: httpx.AsyncClient,
) -> dict[str, Any] | None:
    """특정 레벨의 기사 페이지를 가져와 파싱합니다.

    Args:
        base_url: 기사의 기본 URL (레벨 없는 URL).
        level: 난이도 레벨 (0-6).
        client: httpx 비동기 클라이언트.

    Returns:
        파싱된 레벨별 데이터 또는 None (실패 시).
    """
    # URL 생성: base.html → base-{level}.html
    level_url = re.sub(r"\.html$", f"-{level}.html", base_url)

    logger.debug("레벨 %d 페이지 요청: %s", level, level_url)

    try:
        response = await client.get(level_url)
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        logger.warning("레벨 %d 페이지 로드 실패 (%s): %s", level, level_url, e)
        return None
    except httpx.RequestError as e:
        logger.warning("레벨 %d 요청 오류 (%s): %s", level, level_url, e)
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # 본문 추출
    content = _extract_article_content(soup)

    # 문장 분리
    sentences = _split_sentences(content)

    # 빈칸 채우기 추출
    fill_blanks = _extract_fill_blanks(soup, content)

    return {
        "content": content,
        "sentences": sentences,
        "fill_blanks": fill_blanks,
    }


def _extract_article_content(soup: BeautifulSoup) -> str:
    """기사 본문 텍스트를 추출합니다.

    Breaking News English 기사는 주로 <p> 태그 안에 본문이 있으며,
    h3 제목 아래에 위치합니다. 연습 문제와 네비게이션을 제외한
    순수 본문만 추출합니다.

    Args:
        soup: 파싱된 HTML.

    Returns:
        기사 본문 텍스트.
    """
    # 불필요한 요소 제거 (스크립트, 스타일)
    for tag in soup.find_all(["script", "style"]):
        tag.decompose()

    # 본문 단락 수집: 연습 문제 섹션(Listening, Phrase Matching 등) 앞의
    # <p> 태그들이 본문임
    paragraphs: list[str] = []
    exercise_headings = {
        "phrase matching", "listening", "discussion", "writing",
        "gap fill", "gap-fill", "spell", "homework",
        "student a", "student b", "role play",
        "after reading", "before reading",
    }

    # 본문은 보통 첫 h3(제목) 이후, 연습 섹션(h3/h4) 이전에 위치
    in_body = False
    for element in soup.find_all(["h3", "h4", "h5", "p", "blockquote"]):
        tag_name = element.name
        text = element.get_text(strip=True)
        text_lower = text.lower()

        # 제목(h3)을 만나면 본문 영역 시작 판단
        if tag_name == "h3":
            # 연습 문제 제목이면 본문 영역 종료
            if any(kw in text_lower for kw in exercise_headings):
                break
            # 날짜가 포함된 제목은 기사 제목이므로 본문 영역 시작
            if re.search(r"\d{4}\)", text) or "marks" in text_lower or len(text) > 20:
                in_body = True
                continue

        if tag_name in ("h4", "h5"):
            if any(kw in text_lower for kw in exercise_headings):
                break

        # 본문 단락 수집
        if tag_name == "p" and in_body:
            # 짧은 텍스트나 링크/네비 텍스트 필터링
            if len(text) > 30 and not text.startswith("http"):
                paragraphs.append(text)

    # in_body가 활성화되지 않았으면 폴백: 긴 <p> 태그만 수집
    if not paragraphs:
        for p_tag in soup.find_all("p"):
            text = p_tag.get_text(strip=True)
            if len(text) > 80:
                paragraphs.append(text)
            # 본문은 보통 2-4개 단락이므로 충분히 모이면 중단
            if len(paragraphs) >= 4:
                break

    return "\n\n".join(paragraphs)


def _extract_fill_blanks(
    soup: BeautifulSoup,
    article_content: str,
) -> list[dict[str, str]]:
    """빈칸 채우기 연습을 추출합니다.

    'Listening — Listen and fill in the gaps' 섹션에서
    빈칸 문장과 정답(가능한 경우)을 추출합니다.

    Args:
        soup: 파싱된 HTML.
        article_content: 이미 추출된 기사 본문 (정답 참조용).

    Returns:
        빈칸 채우기 리스트: [{"sentence": str, "answer": str}]
    """
    fill_blanks: list[dict[str, str]] = []

    # "Listening" 또는 "fill in the gaps" 섹션 찾기
    gap_section_start = None
    for heading in soup.find_all(["h3", "h4"]):
        heading_text = heading.get_text(strip=True).lower()
        if "listen" in heading_text and "gap" in heading_text:
            gap_section_start = heading
            break
        if "fill" in heading_text and "gap" in heading_text:
            gap_section_start = heading
            break

    if not gap_section_start:
        return fill_blanks

    # 빈칸이 포함된 단락들을 수집
    gap_paragraphs: list[str] = []
    for sibling in gap_section_start.find_next_siblings():
        if isinstance(sibling, Tag):
            # 다음 섹션 제목이 나오면 중단
            if sibling.name in ("h3", "h4") and sibling != gap_section_start:
                break
            if sibling.name == "p":
                text = sibling.get_text(strip=True)
                if GAP_FILL_RE.search(text):
                    gap_paragraphs.append(text)

    # 빈칸 문장 추출
    gap_text = " ".join(gap_paragraphs)
    if not gap_text:
        return fill_blanks

    # 각 빈칸을 개별 항목으로 분리
    # 빈칸 패턴 기준으로 문장 분할
    parts = GAP_FILL_RE.split(gap_text)

    # parts는 [앞부분, 번호, 뒷부분, 번호, ...] 형태
    # 빈칸 문장을 재구성
    for i in range(1, len(parts) - 1, 2):
        gap_num = parts[i]
        before = parts[i - 1].strip() if i > 0 else ""
        after = parts[i + 1].strip() if i + 1 < len(parts) else ""

        # 문맥에서 빈칸 문장 구성
        sentence_parts = []
        # 앞부분의 마지막 문장
        if before:
            last_sentence = before.rsplit(".", 1)[-1].strip()
            if last_sentence:
                sentence_parts.append(last_sentence)

        sentence_parts.append("___")

        # 뒷부분의 첫 문장/구
        if after:
            first_part = after.split(".")[0].strip()
            # 다음 빈칸 번호 이전까지만
            next_gap = GAP_FILL_RE.search(after)
            if next_gap:
                first_part = after[:next_gap.start()].strip()
            if first_part:
                sentence_parts.append(first_part)

        sentence = " ".join(sentence_parts)

        fill_blanks.append({
            "sentence": sentence,
            "answer": "",  # 정답은 별도 answer 키 페이지에서만 제공
            "gap_number": gap_num,
        })

    logger.debug("빈칸 채우기 %d개 추출", len(fill_blanks))
    return fill_blanks


def _extract_vocabulary(soup: BeautifulSoup) -> list[str]:
    """기사 페이지에서 어휘 목록을 추출합니다.

    기사의 vocabulary 또는 phrase matching 섹션에서 주요 단어/구문을 추출합니다.

    Args:
        soup: 파싱된 HTML.

    Returns:
        어휘 리스트.
    """
    vocabulary: list[str] = []
    seen: set[str] = set()

    # "Phrase Matching" 또는 "WORDS" 섹션 찾기
    for heading in soup.find_all(["h3", "h4", "h5"]):
        heading_text = heading.get_text(strip=True).lower()
        if "phrase match" in heading_text or "words" == heading_text:
            # 다음 형제 ol/ul에서 항목 수집
            for sibling in heading.find_next_siblings():
                if isinstance(sibling, Tag):
                    if sibling.name in ("h3", "h4", "h5"):
                        break
                    if sibling.name in ("ol", "ul"):
                        for li in sibling.find_all("li"):
                            word = li.get_text(strip=True)
                            # 짧은 구문만 어휘로 취급
                            if word and len(word) < 60 and word.lower() not in seen:
                                seen.add(word.lower())
                                vocabulary.append(word)

    # 기사 본문에서 굵은 글씨(b, strong)로 강조된 단어도 수집
    for bold in soup.find_all(["b", "strong"]):
        word = bold.get_text(strip=True)
        if (
            word
            and 2 <= len(word) <= 40
            and word.lower() not in seen
            and not word.isupper()  # 전체 대문자(섹션 제목) 제외
        ):
            seen.add(word.lower())
            vocabulary.append(word)

    return vocabulary


def _extract_title(soup: BeautifulSoup) -> str:
    """기사 제목을 추출합니다.

    Args:
        soup: 파싱된 HTML.

    Returns:
        기사 제목 문자열.
    """
    # h3 태그에서 제목 추출 (날짜 포함 제목)
    for h3 in soup.find_all("h3"):
        text = h3.get_text(strip=True)
        if len(text) > 15:
            # 날짜 부분 제거: "(12th March 2025)" 등
            cleaned = re.sub(r"\s*\(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}\)\s*$", "", text)
            if cleaned:
                return cleaned.strip()

    # title 태그 폴백
    title_tag = soup.find("title")
    if title_tag:
        return title_tag.get_text(strip=True)

    return ""


def _split_sentences(text: str) -> list[str]:
    """텍스트를 개별 문장으로 분리합니다.

    Args:
        text: 분리할 텍스트.

    Returns:
        문장 리스트 (빈 문장 제외).
    """
    if not text:
        return []

    paragraphs = text.split("\n")
    sentences: list[str] = []

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        parts = SENTENCE_SPLIT_RE.split(para)
        for part in parts:
            cleaned = part.strip()
            if cleaned and len(cleaned) > 5:
                sentences.append(cleaned)

    return sentences


async def crawl_article(
    article_info: dict[str, str],
    client: httpx.AsyncClient,
    levels: list[int] | None = None,
) -> dict[str, Any]:
    """개별 기사를 모든(또는 지정된) 레벨로 크롤링합니다.

    Args:
        article_info: fetch_article_links가 반환한 기사 정보.
        client: httpx 비동기 클라이언트.
        levels: 수집할 레벨 목록 (None이면 전체 0-6).

    Returns:
        기사 데이터 딕셔너리.
    """
    if levels is None:
        levels = BNE_LEVELS

    base_url = article_info["url"]
    title = article_info.get("title", "")
    date_text = article_info.get("date_text", "")

    logger.info("기사 크롤링: '%s'", title[:60])

    article_data: dict[str, Any] = {
        "title": title,
        "url": base_url,
        "date": date_text or str(date.today()),
        "levels": {},
        "exercises": {"fill_blanks": []},
        "vocabulary": [],
    }

    # 먼저 기본 페이지(레벨 없는 URL)에서 제목과 어휘 추출
    try:
        base_response = await client.get(base_url)
        base_response.raise_for_status()
        base_soup = BeautifulSoup(base_response.text, "html.parser")

        if not title:
            article_data["title"] = _extract_title(base_soup)

        article_data["vocabulary"] = _extract_vocabulary(base_soup)
    except (httpx.HTTPStatusError, httpx.RequestError) as e:
        logger.warning("기본 페이지 로드 실패 (%s): %s", base_url, e)

    await asyncio.sleep(REQUEST_DELAY)

    # 각 레벨 페이지 수집
    fill_blanks_collected = False
    for level in levels:
        level_data = await fetch_article_by_level(base_url, level, client)

        if level_data:
            article_data["levels"][str(level)] = {
                "content": level_data["content"],
                "sentences": level_data["sentences"],
            }

            # 빈칸 채우기는 첫 번째로 발견된 것만 수집
            if not fill_blanks_collected and level_data.get("fill_blanks"):
                article_data["exercises"]["fill_blanks"] = level_data["fill_blanks"]
                fill_blanks_collected = True

        # rate limiting
        await asyncio.sleep(REQUEST_DELAY)

    logger.info(
        "기사 크롤링 완료: '%s' (%d개 레벨, %d개 어휘)",
        article_data["title"][:40],
        len(article_data["levels"]),
        len(article_data["vocabulary"]),
    )

    return article_data


async def crawl_breakingnews(
    max_articles: int = 20,
    levels: list[int] | None = None,
    output_path: str = DEFAULT_OUTPUT_PATH,
) -> list[dict[str, Any]]:
    """Breaking News English를 크롤링하여 JSON으로 저장합니다.

    Args:
        max_articles: 수집할 최대 기사 수.
        levels: 수집할 레벨 목록 (None이면 전체 0-6).
        output_path: JSON 출력 파일 경로.

    Returns:
        수집된 기사 데이터 리스트.
    """
    logger.info("=" * 60)
    logger.info("Breaking News English 크롤링 시작")
    logger.info("최대 기사 수: %d, 레벨: %s", max_articles, levels or "전체")
    logger.info("=" * 60)

    # 1. 기사 링크 수집
    article_links = await fetch_article_links(max_articles=max_articles)
    if not article_links:
        logger.warning("수집된 기사 링크가 없습니다.")
        return []

    # 2. 각 기사를 순차적으로 크롤링 (rate limiting 준수)
    articles: list[dict[str, Any]] = []

    async with httpx.AsyncClient(
        timeout=HTTP_TIMEOUT,
        follow_redirects=True,
        headers=HTTP_HEADERS,
    ) as client:
        for i, article_info in enumerate(article_links, 1):
            logger.info("[%d/%d] 기사 크롤링 중...", i, len(article_links))

            try:
                article_data = await crawl_article(
                    article_info, client, levels=levels,
                )
                # 본문이 있는 레벨이 하나라도 있으면 수집
                if article_data["levels"]:
                    articles.append(article_data)
                else:
                    logger.warning(
                        "본문 없는 기사 건너뜀: '%s'",
                        article_info.get("title", "")[:40],
                    )
            except Exception as e:
                logger.error(
                    "기사 크롤링 오류 (%s): %s",
                    article_info.get("url", ""),
                    e,
                )

    # 3. JSON 저장
    if articles:
        _save_json(
            {"total": len(articles), "articles": articles},
            output_path,
        )

    logger.info("=" * 60)
    logger.info(
        "Breaking News English 크롤링 완료: %d개 기사 수집",
        len(articles),
    )
    logger.info("=" * 60)

    return articles


def convert_to_reallang_patterns(
    articles: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """크롤링된 기사 데이터를 RealLang 패턴 형식으로 변환합니다.

    Breaking News English 레벨을 CEFR 레벨로 매핑합니다:
        - Level 0-1 → A1
        - Level 2-3 → A2
        - Level 4-5 → B1
        - Level 6   → B2

    Args:
        articles: crawl_breakingnews가 반환한 기사 데이터 리스트.

    Returns:
        RealLang 패턴 형식 리스트:
        [
            {
                "source": "breakingnews",
                "title": str,
                "url": str,
                "level": str,          # CEFR 레벨 (A1, A2, B1, B2)
                "bne_level": int,      # 원본 BNE 레벨 (0-6)
                "sentences": [str],
                "content": str,
                "exercises": [...],
                "vocabulary": [str],
            }
        ]
    """
    patterns: list[dict[str, Any]] = []

    for article in articles:
        title = article.get("title", "")
        url = article.get("url", "")
        vocabulary = article.get("vocabulary", [])
        exercises = article.get("exercises", {})

        for level_str, level_data in article.get("levels", {}).items():
            cefr_level = BNE_LEVEL_TO_CEFR.get(level_str, "B1")

            pattern_entry = {
                "source": "breakingnews",
                "title": title,
                "url": url,
                "level": cefr_level,
                "bne_level": int(level_str),
                "sentences": level_data.get("sentences", []),
                "content": level_data.get("content", ""),
                "exercises": exercises,
                "vocabulary": vocabulary,
            }
            patterns.append(pattern_entry)

    # CEFR 레벨, 그다음 BNE 레벨 순으로 정렬
    level_order = {"A1": 0, "A2": 1, "B1": 2, "B2": 3}
    patterns.sort(
        key=lambda p: (level_order.get(p["level"], 99), p["bne_level"]),
    )

    logger.info(
        "RealLang 패턴 변환 완료: %d개 항목 (A1: %d, A2: %d, B1: %d, B2: %d)",
        len(patterns),
        sum(1 for p in patterns if p["level"] == "A1"),
        sum(1 for p in patterns if p["level"] == "A2"),
        sum(1 for p in patterns if p["level"] == "B1"),
        sum(1 for p in patterns if p["level"] == "B2"),
    )

    return patterns


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

    logger.info("JSON 저장 완료: %s", filepath)
