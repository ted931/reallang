"use client";
import Link from "next/link";

export default function MyPage() {
  return (
    <div className="page" style={{ maxWidth: 480, margin: "0 auto", padding: "28px 20px 60px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>마이페이지</h1>

      <div className="card" style={{ padding: "20px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🌿</div>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7 }}>
          로그인하면 저장한 코스와<br />성향 히스토리를 볼 수 있어요.
        </p>
        <button className="btn-primary" style={{ marginTop: 16, width: "100%" }}>
          카카오로 시작하기
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/onboarding" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>🎯</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>성향 다시 테스트</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>90초만에 내 여행 성향 파악</div>
            </div>
            <span style={{ marginLeft: "auto", color: "var(--text-mute)" }}>→</span>
          </div>
        </Link>
        <Link href="/recommend" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>🗺</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>추천 결과 보기</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>마지막 성향 기반 추천</div>
            </div>
            <span style={{ marginLeft: "auto", color: "var(--text-mute)" }}>→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
