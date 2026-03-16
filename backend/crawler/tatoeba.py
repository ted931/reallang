"""
Tatoeba 영-한 병렬 문장쌍 다운로드 및 파싱 모듈.

Tatoeba(https://tatoeba.org)에서 제공하는 TSV 데이터를 다운로드하여
영어-한국어 병렬 문장쌍을 추출합니다.

필요 파일:
  - sentences.tar.bz2 -> sentences.csv (id, lang, text)
  - links.tar.bz2 -> links.csv (sentence_id, translation_id)
"""

from __future__ import annotations

import csv
import json
import logging
import os
import tarfile
from pathlib import Path

import httpx

logger = logging.getLogger(__name__)

TATOEBA_BASE_URL = "https://downloads.tatoeba.org/exports"
SENTENCES_ARCHIVE = "sentences.tar.bz2"
LINKS_ARCHIVE = "links.tar.bz2"

# 아카이브 내부의 실제 파일명
SENTENCES_FILENAME = "sentences.csv"
LINKS_FILENAME = "links.csv"


async def download_tatoeba_data(data_dir: str) -> None:
    """Tatoeba TSV 파일(sentences, links)을 다운로드합니다.

    이미 다운로드된 파일이 존재하면 건너뜁니다.

    Args:
        data_dir: 다운로드 파일을 저장할 디렉토리 경로.
    """
    data_path = Path(data_dir)
    data_path.mkdir(parents=True, exist_ok=True)

    files_to_download = [
        (SENTENCES_ARCHIVE, SENTENCES_FILENAME),
        (LINKS_ARCHIVE, LINKS_FILENAME),
    ]

    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0), follow_redirects=True) as client:
        for archive_name, extracted_name in files_to_download:
            extracted_path = data_path / extracted_name
            archive_path = data_path / archive_name

            # 이미 추출된 파일이 있으면 건너뛰기
            if extracted_path.exists():
                logger.info("이미 존재: %s, 다운로드 건너뜀", extracted_path)
                continue

            url = f"{TATOEBA_BASE_URL}/{archive_name}"
            logger.info("다운로드 시작: %s", url)

            try:
                # 스트리밍 다운로드로 메모리 절약
                async with client.stream("GET", url) as response:
                    response.raise_for_status()
                    total_size = int(response.headers.get("content-length", 0))
                    downloaded = 0

                    with open(archive_path, "wb") as f:
                        async for chunk in response.aiter_bytes(chunk_size=8192):
                            f.write(chunk)
                            downloaded += len(chunk)
                            if total_size > 0 and downloaded % (10 * 1024 * 1024) < 8192:
                                pct = (downloaded / total_size) * 100
                                logger.info(
                                    "다운로드 진행: %s %.1f%% (%d / %d bytes)",
                                    archive_name, pct, downloaded, total_size,
                                )

                logger.info("다운로드 완료: %s", archive_path)

                # tar.bz2 압축 해제
                logger.info("압축 해제 시작: %s", archive_path)
                _extract_tar_bz2(str(archive_path), str(data_path), extracted_name)
                logger.info("압축 해제 완료: %s", extracted_path)

                # 아카이브 파일 삭제하여 디스크 공간 절약
                archive_path.unlink(missing_ok=True)
                logger.info("아카이브 삭제: %s", archive_path)

            except httpx.HTTPStatusError as e:
                logger.error("HTTP 오류 (%s): %s", archive_name, e)
                raise
            except Exception as e:
                logger.error("다운로드 실패 (%s): %s", archive_name, e)
                # 불완전한 파일 정리
                archive_path.unlink(missing_ok=True)
                raise


def _extract_tar_bz2(archive_path: str, dest_dir: str, target_filename: str) -> None:
    """tar.bz2 아카이브에서 대상 파일을 추출합니다.

    Args:
        archive_path: 아카이브 파일 경로.
        dest_dir: 추출 대상 디렉토리.
        target_filename: 추출할 파일명.
    """
    with tarfile.open(archive_path, "r:bz2") as tar:
        for member in tar.getmembers():
            # 아카이브 내부 경로에서 파일명만 비교
            if os.path.basename(member.name) == target_filename:
                # 파일을 dest_dir에 직접 추출 (경로 평탄화)
                member.name = target_filename
                tar.extract(member, path=dest_dir)
                return

        # 정확한 파일명이 없으면 .tsv 확장자도 시도
        tsv_name = target_filename.replace(".csv", ".tsv")
        for member in tar.getmembers():
            if os.path.basename(member.name) == tsv_name:
                member.name = target_filename
                tar.extract(member, path=dest_dir)
                return

        raise FileNotFoundError(
            f"아카이브에서 '{target_filename}' 파일을 찾을 수 없습니다: {archive_path}"
        )


def parse_sentences(filepath: str, languages: set[str]) -> dict[int, dict]:
    """sentences.csv에서 특정 언어의 문장만 추출합니다.

    Tatoeba sentences.csv 형식: id(TAB)lang(TAB)text

    Args:
        filepath: sentences.csv 파일 경로.
        languages: 추출할 언어 코드 집합 (예: {"eng", "kor"}).

    Returns:
        {sentence_id: {"lang": str, "text": str}} 형태의 딕셔너리.
    """
    sentences: dict[int, dict] = {}
    filepath = str(filepath)

    logger.info("문장 파싱 시작: %s (언어: %s)", filepath, languages)

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            reader = csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE)
            line_count = 0
            for row in reader:
                line_count += 1
                if len(row) < 3:
                    continue

                try:
                    sentence_id = int(row[0])
                except ValueError:
                    continue

                lang = row[1].strip()
                text = row[2].strip()

                if lang in languages and text:
                    sentences[sentence_id] = {"lang": lang, "text": text}

            logger.info(
                "문장 파싱 완료: 전체 %d줄 중 %d개 문장 추출",
                line_count, len(sentences),
            )
    except FileNotFoundError:
        logger.error("파일을 찾을 수 없습니다: %s", filepath)
        raise
    except Exception as e:
        logger.error("문장 파싱 오류: %s", e)
        raise

    return sentences


def build_pairs(
    sentences: dict[int, dict],
    links_path: str,
    src_lang: str = "eng",
    tgt_lang: str = "kor",
) -> list[dict]:
    """링크 파일을 기반으로 영-한 문장쌍을 생성합니다.

    Tatoeba links.csv 형식: sentence_id(TAB)translation_id

    Args:
        sentences: parse_sentences()에서 반환된 문장 딕셔너리.
        links_path: links.csv 파일 경로.
        src_lang: 소스 언어 코드 (기본: "eng").
        tgt_lang: 타겟 언어 코드 (기본: "kor").

    Returns:
        [{"en": str, "ko": str, "en_id": int, "ko_id": int}] 형태의 리스트.
    """
    pairs: list[dict] = []
    seen: set[tuple[int, int]] = set()

    logger.info("문장쌍 생성 시작: %s -> %s", src_lang, tgt_lang)

    try:
        with open(links_path, "r", encoding="utf-8") as f:
            reader = csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE)
            for row in reader:
                if len(row) < 2:
                    continue

                try:
                    id_a = int(row[0])
                    id_b = int(row[1])
                except ValueError:
                    continue

                # 양방향 확인: (eng->kor) 또는 (kor->eng)
                src_id: int | None = None
                tgt_id: int | None = None

                if id_a in sentences and id_b in sentences:
                    sent_a = sentences[id_a]
                    sent_b = sentences[id_b]

                    if sent_a["lang"] == src_lang and sent_b["lang"] == tgt_lang:
                        src_id, tgt_id = id_a, id_b
                    elif sent_a["lang"] == tgt_lang and sent_b["lang"] == src_lang:
                        src_id, tgt_id = id_b, id_a

                if src_id is not None and tgt_id is not None:
                    pair_key = (src_id, tgt_id)
                    if pair_key not in seen:
                        seen.add(pair_key)
                        pairs.append({
                            "en": sentences[src_id]["text"],
                            "ko": sentences[tgt_id]["text"],
                            "en_id": src_id,
                            "ko_id": tgt_id,
                        })

        logger.info("문장쌍 생성 완료: %d개 쌍", len(pairs))
    except FileNotFoundError:
        logger.error("링크 파일을 찾을 수 없습니다: %s", links_path)
        raise
    except Exception as e:
        logger.error("문장쌍 생성 오류: %s", e)
        raise

    return pairs


def save_pairs(pairs: list[dict], output_path: str) -> None:
    """문장쌍을 JSON 파일로 저장합니다.

    Args:
        pairs: 저장할 문장쌍 리스트.
        output_path: 출력 JSON 파일 경로.
    """
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(output, "w", encoding="utf-8") as f:
            json.dump(
                {"total": len(pairs), "pairs": pairs},
                f,
                ensure_ascii=False,
                indent=2,
            )
        logger.info("문장쌍 저장 완료: %s (%d개)", output_path, len(pairs))
    except Exception as e:
        logger.error("저장 실패: %s", e)
        raise


async def run_tatoeba_pipeline(
    data_dir: str = "data/tatoeba",
    output_path: str = "data/tatoeba_pairs.json",
) -> list[dict]:
    """Tatoeba 데이터 다운로드부터 문장쌍 추출까지 전체 파이프라인을 실행합니다.

    Args:
        data_dir: Tatoeba 원본 데이터 저장 디렉토리.
        output_path: 결과 JSON 파일 경로.

    Returns:
        추출된 문장쌍 리스트.
    """
    logger.info("Tatoeba 파이프라인 시작")

    # 1. 데이터 다운로드
    await download_tatoeba_data(data_dir)

    # 2. 문장 파싱 (영어 + 한국어만)
    sentences_path = os.path.join(data_dir, SENTENCES_FILENAME)
    sentences = parse_sentences(sentences_path, {"eng", "kor"})

    # 3. 문장쌍 생성
    links_path = os.path.join(data_dir, LINKS_FILENAME)
    pairs = build_pairs(sentences, links_path, src_lang="eng", tgt_lang="kor")

    # 4. JSON 저장
    save_pairs(pairs, output_path)

    logger.info("Tatoeba 파이프라인 완료: %d개 문장쌍", len(pairs))
    return pairs
