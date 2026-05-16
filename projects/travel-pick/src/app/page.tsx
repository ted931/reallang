import Link from "next/link";

const PERSONAS = [
  {
    num: "01",
    label: "대기 감수형 미식가",
    desc: "기다려도 좋으니 제대로 된 맛집·빵집만",
    bg: "#1e3a2f",
    accent: "#4db8a0",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
  },
  {
    num: "02",
    label: "인파 감수형 관광객",
    desc: "사람 많아도 OK, 유명 명소 전부 가볼래",
    bg: "#2a1f1a",
    accent: "#c8a882",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    num: "03",
    label: "경치 우선 힐링러",
    desc: "대충 먹어도 되니까 뷰만 예쁜 카페로",
    bg: "#1a2535",
    accent: "#80b4cf",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
  },
  {
    num: "04",
    label: "효율 중시 가족 여행자",
    desc: "이동 최소, 아이도 즐길 수 있는 코스",
    bg: "#2a1f30",
    accent: "#b89fd4",
    img: "https://images.unsplash.com/photo-1544191696-15693ec89c34?w=400&q=80",
  },
];

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "88dvh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {/* 배경 이미지 */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85)",
          backgroundSize: "cover", backgroundPosition: "center 30%",
        }} />
        {/* 오버레이 그라데이션 */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(11,31,26,0.3) 0%, rgba(11,31,26,0.85) 70%, #0b1f1a 100%)",
        }} />

        {/* 콘텐츠 */}
        <div style={{ position: "relative", padding: "0 24px 56px", maxWidth: 520, margin: "0 auto", width: "100%" }}>
          <p className="t-label anim-up" style={{ color: "var(--green-light)", marginBottom: 16 }}>
            제주 여행 성향 추천
          </p>
          <h1 className="t-display t-hero anim-up d-100" style={{ color: "#fff", margin: "0 0 20px" }}>
            나에게<br />맞는 제주
          </h1>
          <p className="anim-up d-200" style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 32, maxWidth: 340 }}>
            대기 감수도, 인파 감수도, 경치 vs 맛—
            성향을 90초 안에 입력하면 딱 맞는 여행지를 추천해요.
          </p>
          <div className="anim-up d-300" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/onboarding">
              <button className="btn btn-primary" style={{ fontSize: 16, padding: "17px 32px" }}>
                내 성향 찾기 →
              </button>
            </Link>
            <Link href="/recommend">
              <button className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                바로 추천 보기
              </button>
            </Link>
          </div>
          <p className="anim-up d-400" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
            90초 · 광고 없음 · 무료
          </p>
        </div>
      </section>

      {/* ── PERSONA GRID ── */}
      <section style={{ background: "var(--bg-warm)", padding: "64px 0" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 24px" }}>
          <p className="t-label" style={{ color: "var(--green-main)", marginBottom: 12 }}>여행자 유형</p>
          <h2 className="t-display t-h1" style={{ margin: "0 0 40px" }}>
            어떤 여행자인가요?
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {PERSONAS.map((p, i) => (
            <Link key={p.num} href="/onboarding" style={{ textDecoration: "none" }}>
              <div
                style={{
                  position: "relative", overflow: "hidden",
                  display: "flex", alignItems: "center",
                  padding: "0 24px", height: 96,
                  background: p.bg,
                  transition: "all 0.2s ease",
                }}
                className={`anim-up d-${(i + 1) * 100}`}
              >
                {/* 배경 이미지 */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${p.img})`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  opacity: 0.25,
                }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${p.bg} 40%, transparent)` }} />

                {/* 번호 */}
                <span style={{
                  position: "relative", fontSize: 11, fontWeight: 900,
                  color: p.accent, letterSpacing: "0.1em", minWidth: 32,
                }}>{p.num}</span>

                {/* 텍스트 */}
                <div style={{ position: "relative", flex: 1, paddingLeft: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{p.desc}</div>
                </div>

                {/* 화살표 */}
                <span style={{ position: "relative", color: p.accent, fontSize: 18, fontWeight: 300 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "64px 24px 80px", maxWidth: 520, margin: "0 auto" }}>
        <p className="t-label" style={{ color: "var(--green-main)", marginBottom: 12 }}>작동 방식</p>
        <h2 className="t-display t-h1" style={{ margin: "0 0 48px" }}>
          3단계면<br />충분해요
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { n: "1", title: "성향 입력", body: "대기·인파·경치/맛·동행 유형을 5단계 질문으로.", accent: "var(--green-main)" },
            { n: "2", title: "맞춤 추천", body: "성향에 맞는 맛집·카페·관광지를 카테고리별 TOP 3.", accent: "var(--green-mid)" },
            { n: "3", title: "코스 저장", body: "추천 장소로 1박 2일 코스를 만들고 링크로 공유.", accent: "var(--green-deep)" },
          ].map(({ n, title, body, accent }) => (
            <div key={n} style={{ display: "flex", gap: 20, paddingBottom: 36, borderLeft: `2px solid var(--ink-06)`, paddingLeft: 24, position: "relative", marginLeft: 16 }}>
              <div style={{
                position: "absolute", left: -14, top: 0,
                width: 28, height: 28, borderRadius: "50%",
                background: accent, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900,
              }}>{n}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 14, color: "var(--ink-70)", lineHeight: 1.65 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/onboarding" style={{ display: "block" }}>
          <button className="btn btn-primary" style={{ width: "100%", fontSize: 16, padding: "18px 0", marginTop: 8 }}>
            지금 시작하기 →
          </button>
        </Link>
      </section>
    </div>
  );
}
