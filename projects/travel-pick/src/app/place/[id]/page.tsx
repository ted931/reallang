import { DUMMY_PLACES, CATEGORY_EMOJI, CATEGORY_LABEL } from "@/lib/dummy-places";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = DUMMY_PLACES.find((p) => p.id === id);
  if (!place) notFound();

  const stars = (score: number) => "★".repeat(Math.round(score)) + "☆".repeat(5 - Math.round(score));

  return (
    <div className="page" style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 80 }}>
      {/* Hero image */}
      <div style={{ position: "relative", height: 240 }}>
        <img src={place.image} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <span className="chip" style={{ background: "rgba(0,0,0,0.55)", color: "#fff", marginBottom: 6 }}>
            {CATEGORY_EMOJI[place.category]} {CATEGORY_LABEL[place.category]}
          </span>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>{place.name}</h1>
        </div>
        <Link href="/recommend" style={{
          position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.5)",
          color: "#fff", borderRadius: 10, padding: "6px 12px", fontSize: 13, fontWeight: 700, textDecoration: "none",
        }}>
          ← 뒤로
        </Link>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 20 }}>
          {place.description}
        </p>

        {/* Scores */}
        <div className="card" style={{ padding: "16px 18px", marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)", marginBottom: 12 }}>성향 점수</h3>
          {[
            { label: "경치", score: place.sceneryScore },
            { label: "맛/메뉴", score: place.foodScore },
            { label: "혼잡도", score: place.crowdScore },
          ].map(({ label, score }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)", minWidth: 48 }}>{label}</span>
              <span style={{ color: "#f59e0b", fontSize: 14, letterSpacing: 1 }}>{stars(score)}</span>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="card" style={{ padding: "16px 18px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)", marginBottom: 12 }}>기본 정보</h3>
          {[
            ["📍 위치", place.address],
            ["⏰ 영업시간", place.operatingHours],
            ["⏳ 평균 대기", place.avgWaitMinutes > 0 ? `약 ${place.avgWaitMinutes}분` : "대기 없음"],
            ["🅿️ 주차", { easy: "편함", medium: "보통", hard: "어려움" }[place.parkingEase]],
            ["💰 가격대", place.priceRange],
            ["👶 어린이", place.childFriendly ? "가능" : "비추천"],
          ].map(([key, val]) => (
            <div key={String(key)} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: "var(--text-dim)", minWidth: 80 }}>{key}</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {place.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
        </div>

        <button className="btn-primary" style={{ width: "100%" }}
          onClick={() => {
            if (typeof window !== "undefined") {
              const saved = localStorage.getItem("tp_pref");
              alert("코스 추가 기능은 추천 결과 페이지에서 이용해주세요.");
            }
          }}
        >
          + 내 코스에 추가
        </button>
      </div>
    </div>
  );
}
