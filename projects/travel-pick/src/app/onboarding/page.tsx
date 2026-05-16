"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PreferenceProfile } from "@/lib/types";

const COMPANION_OPTIONS = [
  { value: "solo", emoji: "🧍", label: "혼자" },
  { value: "couple", emoji: "👫", label: "커플" },
  { value: "family", emoji: "👨‍👩‍👧", label: "가족" },
  { value: "friends", emoji: "👯", label: "친구" },
  { value: "parents", emoji: "👵", label: "부모님" },
] as const;

const TRANSPORT_OPTIONS = [
  { value: "car", emoji: "🚗", label: "렌터카" },
  { value: "transit", emoji: "🚌", label: "대중교통" },
  { value: "walk", emoji: "🚶", label: "도보 위주" },
] as const;

const CARD_PAIRS = [
  {
    a: { emoji: "🌊", label: "오션뷰 카페", sub: "경치가 전부인 카페" },
    b: { emoji: "🍰", label: "유명 디저트 카페", sub: "줄 서도 먹는 맛집" },
  },
  {
    a: { emoji: "🌿", label: "한적한 오름", sub: "나 혼자 걷는 풍경" },
    b: { emoji: "🏔", label: "성산일출봉", sub: "사람 많아도 필수 명소" },
  },
  {
    a: { emoji: "☕", label: "무이름 숲속 카페", sub: "경치만 예쁜 곳" },
    b: { emoji: "🍖", label: "흑돼지 줄서기", sub: "기다려도 최고 맛집" },
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pref, setPref] = useState<Partial<PreferenceProfile>>({
    waitTolerance: 50,
    crowdTolerance: 50,
    sceneryVsFood: 50,
    activityLevel: 40,
  });
  const [cardScores, setCardScores] = useState<number[]>([]);

  const totalSteps = 5;

  const update = useCallback((key: keyof PreferenceProfile, val: unknown) => {
    setPref((p) => ({ ...p, [key]: val }));
  }, []);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleCardPick = (choiceIsA: boolean) => {
    // A=경치, B=맛  → sceneryVsFood 보정
    const newScores = [...cardScores, choiceIsA ? 0 : 100];
    setCardScores(newScores);
    if (newScores.length < CARD_PAIRS.length) {
      // show next card pair
      setStep(4); // stay on step 4 with next pair
    } else {
      const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length;
      setPref((p) => ({ ...p, sceneryVsFood: Math.round((p.sceneryVsFood! + avg) / 2) }));
      finalize({ ...pref, sceneryVsFood: Math.round(((pref.sceneryVsFood ?? 50) + avg) / 2) });
    }
  };

  const finalize = (finalPref: Partial<PreferenceProfile>) => {
    localStorage.setItem("tp_pref", JSON.stringify(finalPref));
    router.push("/recommend");
  };

  const currentCardPair = CARD_PAIRS[cardScores.length] ?? CARD_PAIRS[CARD_PAIRS.length - 1];

  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="page" style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 60px" }}>
      <div style={{ paddingTop: 28 }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          {step > 0 && (
            <button onClick={prev} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 20, color: "var(--text-dim)", padding: 4,
            }}>←</button>
          )}
          <div style={{ flex: 1, height: 4, background: "var(--line)", borderRadius: 2 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "var(--jeju-500)", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--text-mute)", fontWeight: 600 }}>{step + 1}/{totalSteps}</span>
        </div>

        {/* Step 0: companion */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>누구와 함께인가요?</h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 24 }}>함께하는 사람에 따라 추천이 달라져요.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {COMPANION_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { update("companion", o.value); next(); }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: "20px 12px", borderRadius: 14, cursor: "pointer",
                    background: pref.companion === o.value ? "var(--jeju-50)" : "var(--bg-card)",
                    border: `2px solid ${pref.companion === o.value ? "var(--jeju-500)" : "var(--line)"}`,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 32 }}>{o.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: transport */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>이동 방식은요?</h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 24 }}>주차 편의, 이동 거리 추천에 반영돼요.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TRANSPORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { update("transportMode", o.value); next(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                    borderRadius: 14, cursor: "pointer", textAlign: "left",
                    background: "var(--bg-card)",
                    border: `2px solid var(--line)`,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 28 }}>{o.emoji}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: sliders */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>성향을 알려주세요</h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 28 }}>슬라이더를 움직여 내 성향을 표현해보세요.</p>
            <SliderBlock
              label="대기 시간"
              leftLabel="바로 들어가고 싶어" rightLabel="1시간도 기다려"
              value={pref.waitTolerance ?? 50}
              onChange={(v) => update("waitTolerance", v)}
            />
            <SliderBlock
              label="인파"
              leftLabel="조용한 곳이 좋아" rightLabel="북적이는 게 활기차"
              value={pref.crowdTolerance ?? 50}
              onChange={(v) => update("crowdTolerance", v)}
            />
            <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={next}>다음</button>
          </div>
        )}

        {/* Step 3: sliders 2 */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>여행 스타일은요?</h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 28 }}>조금만 더 알려주세요!</p>
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
            <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={next}>다음</button>
          </div>
        )}

        {/* Step 4: card picks */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
              어느 쪽에 더 끌리나요?
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 6 }}>
              {cardScores.length + 1} / {CARD_PAIRS.length}
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[
                { data: currentCardPair.a, isA: true },
                { data: currentCardPair.b, isA: false },
              ].map(({ data, isA }) => (
                <button
                  key={isA ? "a" : "b"}
                  onClick={() => handleCardPick(isA)}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 10, padding: "28px 16px", borderRadius: 18,
                    border: "2px solid var(--line)", background: "var(--bg-card)", cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--jeju-500)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                >
                  <span style={{ fontSize: 40 }}>{data.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{data.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{data.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SliderBlock({
  label, leftLabel, rightLabel, value, onChange,
}: {
  label: string; leftLabel: string; rightLabel: string;
  value: number; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "var(--text)" }}>{label}</div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--jeju-500)", cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{leftLabel}</span>
        <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{rightLabel}</span>
      </div>
    </div>
  );
}
