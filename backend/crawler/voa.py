"""
VOA Learning English 크롤러 모듈.

URL: https://learningenglish.voanews.com/
"Let's Learn English" 시리즈와 일반 기사를 크롤링하여
제목, 본문, 레벨, 개별 문장을 추출합니다.
"""

from __future__ import annotations

import logging
import re
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup, Tag

logger = logging.getLogger(__name__)

VOA_BASE_URL = "https://learningenglish.voanews.com"

# VOA Learning English의 주요 섹션 URL
VOA_SECTIONS = {
    "beginning": f"{VOA_BASE_URL}/z/3521",
    "intermediate": f"{VOA_BASE_URL}/z/3526",
    "advanced": f"{VOA_BASE_URL}/z/3524",
    "lets_learn": f"{VOA_BASE_URL}/z/4729",
}

# 레벨 매핑
SECTION_LEVEL_MAP = {
    "beginning": "A1",
    "intermediate": "B1",
    "advanced": "B2",
    "lets_learn": "A2",
}

# 문장 분리 정규식
SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")

# 패턴 추출 정규식 모음
PATTERN_REGEXES = [
    {
        "name": "I'd like to + verb",
        "regex": re.compile(r"\bI'?d like to\s+(\w+)", re.IGNORECASE),
        "template": "I'd like to + [verb]",
    },
    {
        "name": "I want to + verb",
        "regex": re.compile(r"\bI want to\s+(\w+)", re.IGNORECASE),
        "template": "I want to + [verb]",
    },
    {
        "name": "Could you + verb",
        "regex": re.compile(r"\bCould you\s+(\w+)", re.IGNORECASE),
        "template": "Could you + [verb]?",
    },
    {
        "name": "Can I + verb",
        "regex": re.compile(r"\bCan I\s+(\w+)", re.IGNORECASE),
        "template": "Can I + [verb]?",
    },
    {
        "name": "Would you like to + verb",
        "regex": re.compile(r"\bWould you like to\s+(\w+)", re.IGNORECASE),
        "template": "Would you like to + [verb]?",
    },
    {
        "name": "Have you ever + past participle",
        "regex": re.compile(r"\bHave you ever\s+(\w+)", re.IGNORECASE),
        "template": "Have you ever + [past participle]?",
    },
    {
        "name": "I've been + verb-ing",
        "regex": re.compile(r"\bI'?ve been\s+(\w+ing)", re.IGNORECASE),
        "template": "I've been + [verb-ing]",
    },
    {
        "name": "Let me + verb",
        "regex": re.compile(r"\bLet me\s+(\w+)", re.IGNORECASE),
        "template": "Let me + [verb]",
    },
    {
        "name": "It is + adjective + to + verb",
        "regex": re.compile(r"\bIt(?:'s| is)\s+(\w+)\s+to\s+(\w+)", re.IGNORECASE),
        "template": "It is + [adjective] + to + [verb]",
    },
    {
        "name": "I'm going to + verb",
        "regex": re.compile(r"\bI'?m going to\s+(\w+)", re.IGNORECASE),
        "template": "I'm going to + [verb]",
    },
    {
        "name": "Do you mind + verb-ing",
        "regex": re.compile(r"\bDo you mind\s+(\w+ing)", re.IGNORECASE),
        "template": "Do you mind + [verb-ing]?",
    },
    {
        "name": "How about + verb-ing",
        "regex": re.compile(r"\bHow about\s+(\w+ing)", re.IGNORECASE),
        "template": "How about + [verb-ing]?",
    },
    {
        "name": "I used to + verb",
        "regex": re.compile(r"\bI used to\s+(\w+)", re.IGNORECASE),
        "template": "I used to + [verb]",
    },
    {
        "name": "If I were + noun/adjective",
        "regex": re.compile(r"\bIf I were\s+(.+?)(?:,|$)", re.IGNORECASE),
        "template": "If I were + [noun/adjective], ...",
    },
    {
        "name": "You should + verb",
        "regex": re.compile(r"\bYou should\s+(\w+)", re.IGNORECASE),
        "template": "You should + [verb]",
    },
]


async def fetch_voa_articles(
    max_pages: int = 5,
    sections: list[str] | None = None,
) -> list[dict]:
    """VOA Learning English 기사 목록을 수집합니다.

    Args:
        max_pages: 섹션당 수집할 최대 페이지 수.
        sections: 수집할 섹션 목록 (None이면 전체).
            가능한 값: "beginning", "intermediate", "advanced", "lets_learn"

    Returns:
        기사 정보 리스트: [{"url": str, "title": str, "level": str}]
    """
    if sections is None:
        sections = list(VOA_SECTIONS.keys())

    articles: list[dict] = []

    async with httpx.AsyncClient(
        timeout=httpx.Timeout(30.0),
        follow_redirects=True,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
        },
    ) as client:
        for section_key in sections:
            section_url = VOA_SECTIONS.get(section_key)
            if not section_url:
                logger.warning("알 수 없는 섹션: %s", section_key)
                continue

            level = SECTION_LEVEL_MAP.get(section_key, "B1")
            logger.info("섹션 크롤링 시작: %s (%s)", section_key, section_url)

            for page in range(1, max_pages + 1):
                page_url = section_url if page == 1 else f"{section_url}?p={page}"

                try:
                    response = await client.get(page_url)
                    response.raise_for_status()
                except httpx.HTTPStatusError as e:
                    logger.warning(
                        "페이지 로드 실패 (%s, p%d): %s", section_key, page, e
                    )
                    break
                except httpx.RequestError as e:
                    logger.warning(
                        "요청 오류 (%s, p%d): %s", section_key, page, e
                    )
                    break

                soup = BeautifulSoup(response.text, "html.parser")
                page_articles = _parse_article_list(soup, level)

                if not page_articles:
                    logger.info(
                        "섹션 %s: 페이지 %d에 기사 없음, 중단", section_key, page
                    )
                    break

                articles.extend(page_articles)
                logger.info(
                    "섹션 %s 페이지 %d: %d개 기사 발견",
                    section_key, page, len(page_articles),
                )

    # URL 기준 중복 제거
    seen_urls: set[str] = set()
    unique_articles: list[dict] = []
    for article in articles:
        if article["url"] not in seen_urls:
            seen_urls.add(article["url"])
            unique_articles.append(article)

    logger.info("VOA 기사 수집 완료: %d개 (중복 제거 후)", len(unique_articles))
    return unique_articles


def _parse_article_list(soup: BeautifulSoup, level: str) -> list[dict]:
    """기사 목록 페이지에서 개별 기사 링크를 추출합니다.

    Args:
        soup: 파싱된 HTML.
        level: CEFR 레벨.

    Returns:
        기사 정보 리스트.
    """
    articles: list[dict] = []

    # VOA 기사 목록의 일반적인 셀렉터들
    selectors = [
        "div.media-block a.img-wrap",
        "li.leFT a",
        "div.content-offset a",
        "div#articles a[href]",
        "div.media-block__content a",
    ]

    found_links: set[str] = set()

    for selector in selectors:
        for link_tag in soup.select(selector):
            if not isinstance(link_tag, Tag):
                continue
            href = link_tag.get("href", "")
            if isinstance(href, list):
                href = href[0] if href else ""
            if not href or href in found_links:
                continue

            full_url = urljoin(VOA_BASE_URL, href)

            # VOA Learning English 기사 URL 패턴 필터링
            if "/a/" not in full_url:
                continue

            found_links.add(href)

            # 제목 추출
            title = ""
            title_tag = link_tag.find("span") or link_tag.find("h4") or link_tag
            if title_tag:
                title = title_tag.get_text(strip=True)

            articles.append({
                "url": full_url,
                "title": title,
                "level": level,
            })

    # 셀렉터로 못 찾으면 일반적인 기사 링크 패턴으로 폴백
    if not articles:
        for a_tag in soup.find_all("a", href=True):
            href = a_tag.get("href", "")
            if isinstance(href, list):
                href = href[0] if href else ""
            full_url = urljoin(VOA_BASE_URL, href)

            if "/a/" in full_url and full_url not in found_links:
                found_links.add(full_url)
                title = a_tag.get_text(strip=True)
                if title and len(title) > 10:
                    articles.append({
                        "url": full_url,
                        "title": title,
                        "level": level,
                    })

    return articles


async def parse_article(url: str) -> dict:
    """개별 VOA 기사를 파싱합니다.

    Args:
        url: 기사 URL.

    Returns:
        파싱된 기사 정보:
        {
            "title": str,
            "url": str,
            "content": str,
            "level": str,
            "sentences": [str],
        }
    """
    logger.info("기사 파싱: %s", url)

    try:
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(30.0),
            follow_redirects=True,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
            },
        ) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.HTTPStatusError as e:
        logger.error("기사 로드 실패 (%s): %s", url, e)
        return {"title": "", "url": url, "content": "", "level": "", "sentences": []}
    except httpx.RequestError as e:
        logger.error("요청 오류 (%s): %s", url, e)
        return {"title": "", "url": url, "content": "", "level": "", "sentences": []}

    soup = BeautifulSoup(response.text, "html.parser")

    # 제목 추출
    title = ""
    title_tag = soup.find("h1")
    if title_tag:
        title = title_tag.get_text(strip=True)

    # 본문 추출 - VOA의 여러 가능한 본문 컨테이너
    content = ""
    body_selectors = [
        "div.wsw",  # VOA의 주요 본문 클래스
        "div.body-container",
        "div#article-content",
        "article",
    ]

    for selector in body_selectors:
        body_tag = soup.select_one(selector)
        if body_tag:
            # 불필요한 요소 제거
            for unwanted in body_tag.find_all(["script", "style", "aside", "figure"]):
                unwanted.decompose()

            paragraphs = body_tag.find_all("p")
            if paragraphs:
                content = "\n\n".join(
                    p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)
                )
                break

    # 본문이 비어있으면 모든 <p> 태그에서 추출
    if not content:
        paragraphs = soup.find_all("p")
        content = "\n\n".join(
            p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)
        )

    # 문장 분리
    sentences = _split_sentences(content)

    # 레벨 추출 (URL이나 메타 태그에서 힌트)
    level = _detect_level(url, soup)

    logger.info("기사 파싱 완료: '%s' (%d 문장)", title[:50], len(sentences))

    return {
        "title": title,
        "url": url,
        "content": content,
        "level": level,
        "sentences": sentences,
    }


def _split_sentences(text: str) -> list[str]:
    """텍스트를 개별 문장으로 분리합니다.

    Args:
        text: 분리할 텍스트.

    Returns:
        문장 리스트 (빈 문장 제외).
    """
    if not text:
        return []

    # 단락 구분자로 먼저 분리
    paragraphs = text.split("\n")
    sentences: list[str] = []

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        # 문장 종결 기호로 분리
        parts = SENTENCE_SPLIT_RE.split(para)
        for part in parts:
            cleaned = part.strip()
            if cleaned and len(cleaned) > 5:
                sentences.append(cleaned)

    return sentences


def _detect_level(url: str, soup: BeautifulSoup) -> str:
    """기사의 난이도 레벨을 추정합니다.

    Args:
        url: 기사 URL.
        soup: 파싱된 HTML.

    Returns:
        CEFR 레벨 문자열 (기본: "B1").
    """
    url_lower = url.lower()

    if "beginning" in url_lower or "level-1" in url_lower:
        return "A1"
    if "intermediate" in url_lower or "level-2" in url_lower:
        return "B1"
    if "advanced" in url_lower or "level-3" in url_lower:
        return "B2"
    if "lets-learn" in url_lower or "let-s-learn" in url_lower:
        return "A2"

    # 메타 태그에서 레벨 힌트 찾기
    for meta in soup.find_all("meta"):
        content = meta.get("content", "")
        if isinstance(content, list):
            content = " ".join(content)
        content_lower = content.lower()
        if "beginning" in content_lower:
            return "A1"
        if "intermediate" in content_lower:
            return "B1"
        if "advanced" in content_lower:
            return "B2"

    return "B1"  # 기본값


def extract_patterns(sentences: list[str]) -> list[dict]:
    """문장 리스트에서 영어 패턴을 추출합니다.

    미리 정의된 정규식 패턴을 사용하여 문장에서 학습 가능한
    영어 패턴을 식별합니다.

    Args:
        sentences: 분석할 문장 리스트.

    Returns:
        추출된 패턴 리스트:
        [
            {
                "pattern": str,       # 패턴 이름
                "template": str,      # 패턴 템플릿
                "examples": [str],    # 해당 패턴이 사용된 문장들
                "count": int,         # 발견 횟수
            }
        ]
    """
    pattern_results: dict[str, dict] = {}

    for sentence in sentences:
        if not sentence:
            continue

        for pat in PATTERN_REGEXES:
            match = pat["regex"].search(sentence)
            if match:
                pat_name = pat["name"]
                if pat_name not in pattern_results:
                    pattern_results[pat_name] = {
                        "pattern": pat_name,
                        "template": pat["template"],
                        "examples": [],
                        "count": 0,
                    }

                result = pattern_results[pat_name]
                result["count"] += 1
                # 예문은 최대 10개까지만 저장
                if len(result["examples"]) < 10:
                    result["examples"].append(sentence)

    # 발견 횟수 기준 내림차순 정렬
    sorted_patterns = sorted(
        pattern_results.values(),
        key=lambda x: x["count"],
        reverse=True,
    )

    logger.info(
        "%d개 문장에서 %d종 패턴 추출 (총 %d건)",
        len(sentences),
        len(sorted_patterns),
        sum(p["count"] for p in sorted_patterns),
    )

    return sorted_patterns
