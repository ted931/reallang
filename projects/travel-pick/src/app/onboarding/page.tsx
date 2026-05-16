"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PreferenceProfile } from "@/lib/types";

const COMPANION_OPTIONS = [
  { value: "solo",    label: "혼자",   sub: "자유롭게" },
  { value: "couple",  label: "커플",   sub: "둘이서" },
  { value: "family",  label: "가족",   sub: "아이 동반" },
  { value: "friends", label: "친구",   sub: "여럿이서" },
  { value: "parents", label: "부모님", sub: "효도 여행" },
] as const;

const TRANSPORT_OPTIONS = [
  { value: "car",     label: "렌터카",    sub: "자유롭게 이동" },
  { value: "transit", label: "대중교통",  sub: "버스·택시" },
  { value: "walk",    label: "도보 위주", sub: "가까운 곳만" },
] as const;

const CARD_PAIRS = [
  {
    a: { label: "오션뷰 카페", sub: "경치가 전부인 카페", img: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400&q=80" },
    b: { label: "유명 디저트", sub: "줄 서도 먹는 맛집", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
  },
  {
    a: { label: "한적한 오름", sub: "나 혼자 걷는 풍경", img: "https://images.unsplash.com/photo-1501786223405-6d024d7c3b8d?w=400&q=80" },
    b: { label: "성산일출봉", sub: "사람 많아도 필수", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  },
  {
    a: { label: "숲속 무명 카페", sub: "경치만 예쁜 곳", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80" },
    b: { label: "흑돼지 줄서기", sub: "기다려도 최고 맛집", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80" },
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pref, setPref] = useState<Partial<PreferenceProfile>>({
    waitTolerance: 50, crowdTolerance: 50, sceneryVsFood: 50, activityLevel: 40,
  });
  const [cardScores, setCardScores] = useState<number[]>([]);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const update = useCallback((key: keyof PreferenceProfile, val: unknown) => {
    setPref((p) => ({ ...p, [key]: val }));
  }, []);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleCardPick = (choiceIsA: boolean) => {
    const newScores = [...cardScores, choiceIsA ? 0 : 100];
    setCardScores(newScores);
    if (newScores.length < CARD_PAIRS.length) {
      setStep(4);
    } else {
      const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length;
      const final = { ...pref, sceneryVsFood: Math.round(((pref.sceneryVsFood ?? 50) + avg) / 2) };
      localStorage.setItem("tp_pref", JSON.stringify(final));
      router.push("/recommend");
    }
  };

  const currentPair = CARD_PAIRS[cardScores.length] ?? CARD_PAIRS[CARD_PAIRS.length - 1];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* 상단 진행 바 */}
      <div style={{ padding: "20px 24px 0", maxWidth: 520, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          {step > 0 && (
            <button onClick={prev} style={{
              background: "none", border: "none", cursor: "pointer",
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "var(--ink-70)",
              background: "var(--ink-06)",
            }}>←</button>
          )}
          <div style={{ flex: 1, height: 3, background: "var(--ink-06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              background: "var(--green-main)", borderRadius: 2,
              transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-40)", letterSpacing: "0.05em" }}>
            {step + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, padding: "0 24px 60px", maxWidth: 520, margin: "0 auto", width: "100%" }}>

        {/* Step 0: 동행 */}
        {step === 0 && (
          <div className="anim-up">
            <p className="t-label" style={{ color: "var(--green-main)", marginBottom: 12 }}>STEP 1</p>
            <h2 className="t-display t-h1" style={{ marginBottom: 8 }}>누구와 함께인가요?</h2>
            <p style={{ fontSize: 14, color: "var(--ink-70)", marginBottom: 32, lineHeight: 1.6 }}>
              함께하는 사람에 따라 추천이 달라져요.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COMPANION_OPTIONS.map((o) => (
                <button key={o.value} onClick={() => { update("companion", o.value); next(); }} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 20px", borderRadius: "var(--r-md)", cursor: "pointer",
                  background: "var(--surface)", border: "1.5px solid var(--ink-12)",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green-main)"; e.currentTarget.style.background = "var(--green-tint)"; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--ink-12)"; e.currentTarget.style.background = "var(--surface)"; }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>{o.label}</span>
                  <span style={{ fontSize: 13, color: "var(--ink-40)" }}>{o.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: 이동 */}
        {step === 1 && (
          <div className="anim-up">
            <p className="t-label" style={{ color: "var(--green-main)", marginBottom: 12 }}>STEP 2</p>
            <h2 className="t-display t-h1" style={{ marginBottom: 8 }}>이동 방식은요?</h2>
            <p style={{ fontSize: 14, color: "var(--ink-70)", marginBottom: 32, lineHeight: 1.6 }}>
              주차 편의와 이동 거리 추천에 반영돼요.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TRANSPORT_OPTIONS.map((o) => (
                <button key={o.value} onClick={() => { update("transportMode", o.value); next(); }} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 22px", borderRadius: "var(--r-md)", cursor: "pointer",
                  background: "var(--surface)", border: "1.5px solid var(--ink-12)",
                  transition: "all 0.15s", fontFamily: "inherit",
                }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green-main)"; e.currentTarget.style.background = "var(--green-tint)"; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--ink-12)"; e.currentTarget.style.background = "var(--surface)"; }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>{o.label}</span>
                  <span style={{ fontSize: 13, color: "var(--ink-40)" }}>{o.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 슬라이더 1 */}
        {step === 2 && (
          <div className="anim-up">
            <p className="t-label" style={{ color: "var(--green-main)", marginBottom: 12 }}>STEP 3</p>
            <h2 className="t-display t-h1" style={{ marginBottom: 8 }}>성향을 알려주세요</h2>
            <p style={{ fontSize: 14, color: "var(--ink-70)", marginBottom: 40, lineHeight: 1.6 }}>
              슬라이더를 움직여 내 성향을 표현해보세요.
            </p>
            <SliderBlock
              label="대기 시간 감수도"
              leftLabel="바로 들어가고 싶어" rightLabel="1시간도 기다려"
              value={pref.waitTolerance ?? 50}
              onChange={(v) => update("waitTolerance", v)}
            />
            <SliderBlock
              label="인파 감수도"
              leftLabel="조용한 곳이 좋아" rightLabel="북적이는 게 활기차"
              value={pref.crowdTolerance ?? 50}
              onChange={(v) => update("crowdTolerance", v)}
            />
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={next}>다음</button>
          </div>
        )}

        {/* Step 3: 슬라이더 2 */}
        {step === 3 && (
          <div className="anim-up">
            <p className="t-label" style={{ color: "var(--green-main)", marginBottom: 12 }}>STEP 4</p>
            <h2 className="t-display t-h1" style={{ marginBottom: 8 }}>여행 스타일은요?</h2>
            <p style={{ fontSize: 14, color: "var(--ink-70)", marginBottom: 40, lineHeight: 1.6 }}>
              조금만 더 알려주세요!
            </p>
            <SliderBlock
              label="경치 vs 맛"
              leftLabel="경치만 예뻐도 OK" rightLabel="맛이 최우선"
              value={pref.sceneryVsFood ?? 50}
              onChange={(v) => update("sceneryVsFood", v)}
            />
            <SliderBlock
              label="활동량"
              leftLabel="완전 휴식" rightLabel="하루 종일 움직여"
              value={pref.activityLevel ?? 40}
              onChange={(v) => update("activityLevel", v)}
            />
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={next}>다음</button>
          </div>
        )}

        {/* Step 4: 카드 선택 */}
        {step === 4 && (
          <div className="anim-up">
            <p className="t-label" style={{ color: "var(--green-main)", marginBottom: 12 }}>STEP 5 · {cardScores.length + 1}/{CARD_PAIRS.length}</p>
            <h2 className="t-display t-h1" style={{ marginBottom: 8 }}>어느 쪽에 더 끌리나요?</h2>
            <p style={{ fontSize: 14, color: "var(--ink-70)", marginBottom: 32, lineHeight: 1.6 }}>
              직관적으로 골라주세요.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ data: currentPair.a, isA: true }, { data: currentPair.b, isA: false }].map(({ data, isA }) => (
                <button key={isA ? "a" : "b"} onClick={() => handleCardPick(isA)} style={{
                  position: "relative", overflow: "hidden",
                  height: 200, borderRadius: "var(--r-lg)", cursor: "pointer",
                  border: "none", padding: 0,
                  transition: "transform 0.15s, box-shadow 0.15s",
                }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)"; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                  {/* 이미지 */}
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${data.img})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                  }} />
                  {/* 오버레이 */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)" }} />
                  {/* 텍스트 */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 14px", textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{data.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{data.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SliderBlock({ label, leftLabel, rightLabel, value, onChange }: {
  label: string; leftLabel: string; rightLabel: string;
  value: number; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <span style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green-main)" }}>{value}</span>
      </div>
      <div style={{ position: "relative", paddingBottom: 4 }}>
        {/* 트랙 배경 */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, background: "var(--ink-06)", borderRadius: 2, transform: "translateY(-50%)" }} />
        {/* 채워진 트랙 */}
        <div style={{ position: "absolute", top: "50%", left: 0, width: `${value}%`, height: 4, background: "var(--green-main)", borderRadius: 2, transform: "translateY(-50%)", transition: "width 0.05s" }} />
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "relative", width: "100%", cursor: "pointer",
            appearance: "none", background: "transparent", height: 24,
            accentColor: "var(--green-main)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: "var(--ink-40)", fontWeight: 600 }}>{leftLabel}</span>
        <span style={{ fontSize: 11, color: "var(--ink-40)", fontWeight: 600 }}>{rightLabel}</span>
      </div>
    </div>
  );
}
