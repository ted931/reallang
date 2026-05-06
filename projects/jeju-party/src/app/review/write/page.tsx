"use client";

import { useState, useEffect } from "react";

// --- 더미 데이터 ---
const DUMMY_PARTY = {
  emoji: "🏄",
  title: "서핑 입문 클래스",
  date: "2026.05.12",
  location: "협재",
  host: "서핑왕민준",
};

const POS_TAGS = [
  "친절해요",
  "시간 잘 지켜요",
  "설명 자세해요",
  "분위기 좋아요",
  "초보 환영",
  "사진 잘 찍어줘요",
  "안전해요",
  "가성비 좋아요",
];

const NEG_TAGS = ["시간이 짧아요", "설명이 부족", "대기가 길어요", "시설 아쉬워요"];

const RATING_REMARKS: Record<number, string> = {
  1: "별로예요",
  2: "아쉬웠어요",
  3: "괜찮았어요",
  4: "만족스러워요",
  5: "최고였어요!",
};

// 4단계 스텝 정의
const STEPS = ["별점", "태그", "사진", "후기"];

// 더미 사진 placeholder 데이터
const DUMMY_PHOTOS: { id: number; isPrimary: boolean }[] = [
  { id: 1, isPrimary: true },
  { id: 2, isPrimary: false },
  { id: 3, isPrimary: false },
];

// --- 메인 페이지 ---
export default function ReviewWritePage() {
  const [step, setStep] = useState(1); // 1~4
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(["친절해요", "시간 잘 지켜요", "분위기 좋아요"])
  );
  const [photos, setPhotos] = useState(DUMMY_PHOTOS);
  const [reviewText, setReviewText] = useState(
    "처음 서핑이라 긴장했는데 강사님이 정말 친절하게 알려주셔서 한 번에 일어섰어요! 협재 바다도 너무 예뻤고 사진도 많이 찍어주셨습니다."
  );
  const [agreeNameExposure, setAgreeNameExposure] = useState(true);
  const [agreeRecommend, setAgreeRecommend] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const tags = rating >= 4 ? POS_TAGS : NEG_TAGS;
  const progressPct = (step / 4) * 100;
  const MIN_CHARS = 20;
  const charCount = reviewText.length;
  const isTextValid = charCount >= MIN_CHARS;

  // 자동저장 시뮬레이션
  useEffect(() => {
    setAutoSaved(false);
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const t = setTimeout(() => setAutoSaved(true), 1500);
    setAutoSaveTimer(t);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating, selectedTags, reviewText]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function removePhoto(id: number) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function addPhoto() {
    const newId = Math.max(0, ...photos.map((p) => p.id)) + 1;
    setPhotos((prev) => [...prev, { id: newId, isPrimary: false }]);
  }

  const canProceed =
    step === 1
      ? rating > 0
      : step === 2
      ? selectedTags.size > 0
      : step === 3
      ? true // 사진은 선택
      : isTextValid;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 진행률 */}
        <div className="flex items-center gap-2 mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
            {step} / 4
          </span>
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className={`text-[10px] font-mono transition-opacity duration-300 ${autoSaved ? "text-emerald-600 opacity-100" : "text-slate-300 opacity-50"}`}>
            {autoSaved ? "자동저장됨" : "저장 중..."}
          </span>
        </div>

        {/* 스텝 탭 */}
        <nav aria-label="리뷰 작성 단계">
          <ol className="flex items-center gap-1 mb-6">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <li key={s} className="flex items-center gap-1">
                  <button
                    onClick={() => n <= step && setStep(n)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      active
                        ? "bg-orange-500 text-white"
                        : done
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                    disabled={n > step}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? "✓ " : ""}{s}
                  </button>
                  {i < STEPS.length - 1 && (
                    <span className="text-slate-300 text-xs" aria-hidden="true">→</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* 파티 컨텍스트 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 mb-6">
          <div
            className="w-14 h-14 rounded-xl bg-cyan-100 grid place-items-center text-2xl flex-shrink-0"
            aria-hidden="true"
          >
            {DUMMY_PARTY.emoji}
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-sm">{DUMMY_PARTY.title}</p>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
              {DUMMY_PARTY.date} · {DUMMY_PARTY.location} · 호스트 {DUMMY_PARTY.host}
            </p>
          </div>
        </div>

        {/* STEP 01: 별점 */}
        {step === 1 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
              STEP 01
            </p>
            <h2 className="text-2xl font-black mb-1">전체적으로 어떠셨어요?</h2>
            <p className="text-sm text-slate-500 mb-6">별점을 눌러 평가해 주세요</p>

            <div className="flex justify-center gap-1.5 mb-3" role="group" aria-label="별점 선택">
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = n <= (hoveredStar || rating);
                return (
                  <button
                    key={n}
                    aria-label={`${n}점`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoveredStar(n)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={`text-5xl transition-all hover:scale-110 ${
                      filled ? "text-amber-400 scale-110" : "text-slate-200"
                    }`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            <p
              className={`text-sm font-extrabold ${
                rating >= 4
                  ? "text-orange-600"
                  : rating >= 3
                  ? "text-slate-700"
                  : "text-slate-500"
              }`}
            >
              {rating}점 — {RATING_REMARKS[rating]}
            </p>
          </section>
        )}

        {/* STEP 02: 태그 */}
        {step === 2 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
              STEP 02
            </p>
            <h3 className="font-extrabold mb-3">
              {rating >= 4 ? "어떤 점이 좋았나요?" : "어떤 점이 아쉬웠나요?"}{" "}
              <span className="text-xs font-normal text-slate-400">중복 가능</span>
            </h3>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="태그 선택">
              {tags.map((tag) => {
                const on = selectedTags.has(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={on}
                    className={`px-3 py-2 rounded-full text-sm font-bold transition-all ${
                      on
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {on && "✓ "}
                    {tag}
                  </button>
                );
              })}
            </div>
            {selectedTags.size > 0 && (
              <p className="text-xs font-mono text-emerald-600 mt-3">
                {selectedTags.size}개 선택됨
              </p>
            )}
          </section>
        )}

        {/* STEP 03: 사진 */}
        {step === 3 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
              STEP 03
            </p>
            <h3 className="font-extrabold mb-1">
              사진을 추가해 주세요{" "}
              <span className="text-xs font-normal text-slate-400">선택 · 최대 5장</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              사진을 첨부하면 더 도움 되는 리뷰가 돼요
            </p>
            <div className="grid grid-cols-5 gap-2">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg relative overflow-hidden"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, #fef3e8, #fef3e8 8px, #fed7aa 8px, #fed7aa 16px)",
                  }}
                >
                  <button
                    onClick={() => removePhoto(photo.id)}
                    aria-label="사진 삭제"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/70 text-white text-xs grid place-items-center hover:bg-slate-900 transition-colors"
                  >
                    ×
                  </button>
                  {photo.isPrimary && (
                    <span className="absolute bottom-1 left-1 font-mono text-[9px] px-1.5 py-0.5 rounded bg-orange-500 text-white">
                      대표
                    </span>
                  )}
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  onClick={addPhoto}
                  aria-label="사진 추가"
                  className="aspect-square rounded-lg border-2 border-dashed border-slate-300 grid place-items-center text-slate-400 hover:border-orange-300 hover:text-orange-500 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl" aria-hidden="true">＋</div>
                    <p className="text-[10px] font-mono">
                      {photos.length} / 5
                    </p>
                  </div>
                </button>
              )}
            </div>
          </section>
        )}

        {/* STEP 04: 텍스트 */}
        {step === 4 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">
              STEP 04
            </p>
            <h3 className="font-extrabold mb-3">
              자세한 후기{" "}
              <span className="text-xs font-normal text-slate-400">최소 {MIN_CHARS}자</span>
            </h3>
            <textarea
              className="w-full p-4 border border-slate-200 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
              rows={6}
              placeholder="어떤 점이 좋았는지, 다음에 가는 분께 도움될 팁을 적어주세요."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              aria-label="리뷰 내용"
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span
                className={`font-mono ${
                  isTextValid ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {isTextValid ? "✓ " : ""}
                {charCount} / 1000자
                {!isTextValid && ` (최소 ${MIN_CHARS}자)`}
              </span>
              <button className="text-slate-500 underline text-xs">예시 보기</button>
            </div>
          </section>
        )}

        {/* STEP 04에서만 옵션 표시 */}
        {step === 4 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded"
                checked={agreeNameExposure}
                onChange={(e) => setAgreeNameExposure(e.target.checked)}
              />
              호스트가 이름·프로필 노출에 동의
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded"
                checked={agreeRecommend}
                onChange={(e) => setAgreeRecommend(e.target.checked)}
              />
              다른 사람에게도 추천할게요
            </label>
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-3.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              ← 이전
            </button>
          )}
          {step < 4 ? (
            <button
              disabled={!canProceed}
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 py-3.5 bg-orange-500 text-white font-extrabold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음 단계 →
            </button>
          ) : (
            <div className="flex-1 flex gap-2">
              <button className="px-5 py-3.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
                임시저장
              </button>
              <button
                disabled={!isTextValid}
                className="flex-1 py-3.5 bg-orange-500 text-white font-extrabold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => {
                  window.location.href = "/party/p3";
                }}
              >
                리뷰 등록 → 500P 적립
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
