import Link from "next/link";

const PERSONA_EXAMPLES = [
  { emoji: "🍖", label: "대기 감수형 미식가", desc: "기다려도 좋으니 제대로 된 맛집·빵집만" },
  { emoji: "📸", label: "인파 감수형 관광객", desc: "사람 많아도 OK, 유명 명소 다 가볼래" },
  { emoji: "🌅", label: "경치 우선 힐링러", desc: "대충 먹어도 되니까 경치만 예쁜 카페로" },
  { emoji: "👨‍👩‍👧", label: "효율 중시 가족", desc: "이동 최소, 아이도 즐길 수 있는 코스" },
];

export default function Home() {
  return (
    <div className="page" style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 60px" }}>

      {/* Hero */}
      <div style={{ paddingTop: 56, paddingBottom: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
          나에게 맞는<br />제주를 찾아드려요
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-dim)", marginTop: 14, lineHeight: 1.7 }}>
          대기 감수도, 인파 감수도, 경치 vs 맛 성향을<br />
          90초 안에 입력하면 딱 맞는 여행지를 추천해요.
        </p>
        <Link href="/onboarding">
          <button className="btn-primary" style={{ marginTop: 24, width: "100%", fontSize: 17, padding: "16px 0" }}>
            내 성향 찾기 →
          </button>
        </Link>
        <p style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 10 }}>
          90초 · 광고 없음 · 무료
        </p>
      </div>

      {/* Persona cards */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dim)", marginBottom: 14, letterSpacing: "0.05em" }}>
          이런 여행자에게 맞아요
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PERSONA_EXAMPLES.map((p) => (
            <div key={p.label} className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
              <span style={{ fontSize: 28 }}>{p.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{p.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 2 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ padding: "20px 20px 24px" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dim)", marginBottom: 16, letterSpacing: "0.05em" }}>
          어떻게 작동하나요?
        </h2>
        {[
          ["1", "성향 입력", "대기, 인파, 경치/맛, 동행 유형을 5단계로"],
          ["2", "장소 추천", "성향에 맞는 맛집·카페·관광지 TOP 3씩"],
          ["3", "코스 저장", "추천 장소로 1박 2일 코스 만들고 공유"],
        ].map(([n, title, desc]) => (
          <div key={n} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: "var(--jeju-500)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>{n}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 2 }}>{desc}</div>
            </div>
          </div>
        ))}
        <Link href="/onboarding">
          <button className="btn-primary" style={{ width: "100%", marginTop: 4 }}>
            시작하기
          </button>
        </Link>
      </div>
    </div>
  );
}
