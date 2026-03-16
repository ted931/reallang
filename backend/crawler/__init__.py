"""
RealLang 데이터 수집 크롤러 패키지.

Tatoeba, Free Dictionary API, VOA Learning English,
Breaking News English 등 다양한 소스에서 영어 학습 데이터를
수집하고 정제합니다.
"""

from .breakingnews import (
    convert_to_reallang_patterns,
    crawl_breakingnews,
    fetch_article_links,
)
from .dictionary import fetch_word_info, fetch_words_batch
from .naver_conversation import (
    convert_to_seed_patterns,
    fetch_conversation,
    fetch_conversations,
    run_naver_conversation_pipeline,
    save_conversations,
)
from .pipeline import run_pipeline
from .tatoeba import build_pairs, download_tatoeba_data, parse_sentences
from .voa import extract_patterns, fetch_voa_articles, parse_article

__all__ = [
    "download_tatoeba_data",
    "parse_sentences",
    "build_pairs",
    "fetch_word_info",
    "fetch_words_batch",
    "fetch_voa_articles",
    "parse_article",
    "extract_patterns",
    "run_pipeline",
    "fetch_article_links",
    "crawl_breakingnews",
    "convert_to_reallang_patterns",
    "fetch_conversation",
    "fetch_conversations",
    "save_conversations",
    "convert_to_seed_patterns",
    "run_naver_conversation_pipeline",
]
