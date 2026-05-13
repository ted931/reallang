"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const MATCH_POSTS = [
  { id: "m1", authorNick: "갈치왕김씨", authorLevel: "Lv.34 고수", date: "2026-05-14", dday: 2, region: "한림", targetFish: "갈치", totalSlots: 4, takenSlots: 2, status: "모집중" as const, message: "야간 갈치 전문입니다. 채비 없어도 OK, 같이 즐겁게 낚시해요! 포인트는 한림항 인근 갯바위 및 방파제. 여럿이 가면 더 재밌어요. 초보자도 환영합니다.", gear: "낚시대 있으면 좋지만 없어도 OK — 여벌 대 빌려드림", cost: "교통비 1/N 나눔", meetAt: "한림항 2번 게이트", meetTime: "오후 8시" },
  { id: "m2", authorNick: "서귀포바다", authorLevel: "Lv.18 중급", date: "2026-05-12", dday: 0, region: "서귀포", targetFish: "감성돔", totalSlots: 3, takenSlots: 2, status: "마감임박" as const, message: "오늘 새벽 출발! 마지막 1자리. 찌낚시 경험자 우대. 감성돔 포인트 아는 곳 안내해드립니다.", gear: "릴대 + 찌채비 필수", cost: "선비 없음, 미끼 각자", meetAt: "서귀포항 입구", meetTime: "오전 4시 30분" },
  { id: "m3", authorNick: "성산출조대장", authorLevel: "Lv.52 마스터", date: "2026-05-13", dday: 1, region: "성산", targetFish: "참돔", totalSlots: 5, takenSlots: 3, status: "마감임박" as const, message: "내일 아침 일출 참돔 도전. 배 대절 비용 1/5 나눕니다. 입문자도 환영! 포인트 및 채비법 현장 지도 가능.", gear: "타이라바 or 지깅 채비 권장", cost: "선비 1/5 나눔 (약 4만원)", meetAt: "성산포항 3번 부두", meetTime: "오전 5시" },
  { id: "m4", authorNick: "모슬포방어팀", authorLevel: "Lv.41 고수", date: "2026-05-15", dday: 3, region: "모슬포", targetFish: "방어", totalSlots: 6, takenSlots: 2, status: "모집중" as const, message: "방어 루어 지깅 팀 구합니다. 지깅 장비 필수. 체력 자신 있는 분! 대물 방어 시즌 놓치지 마세요.", gear: "지깅 장비 필수 (80~150g 지그)", cost: "선비 1/6 나눔", meetAt: "모슬포항", meetTime: "오전 6시" },
  { id: "m5", authorNick: "애월혼낚러", authorLevel: "Lv.9 입문", date: "2026-05-16", dday: 4, region: "애월", targetFish: "광어", totalSlots: 2, takenSlots: 0, status: "모집중" as const, message: "처음이라 혼자 가기 무서워요 ㅜㅜ 같이 광어 좌대 가실 분 구해요. 초보자끼리 같이 배워요!", gear: "좌대에서 대여 가능", cost: "좌대 비용 1/2 나눔", meetAt: "애월읍 협재 좌대", meetTime: "오전 7시" },
  { id: "m6", authorNick: "구좌갯바위", authorLevel: "Lv.27 중급", date: "2026-05-11", dday: -1, region: "구좌", targetFish: "벵에돔", totalSlots: 3, takenSlots: 3, status: "마감" as const, message: "구좌 갯바위 벵에돔 전문 팀. 이번 출조 마감됐어요, 다음 기회에!", gear: "-", cost: "-", meetAt: "-", meetTime: "-" },
  { id: "m7", authorNick: "한림새벽꾼", authorLevel: "Lv.63 레전드", date: "2026-05-17", dday: 5, region: "한림", targetFish: "갈치", totalSlots: 4, takenSlots: 1, status: "모집중" as const, message: "17년 경력 갈치 고수입니다. 포인트 아는 분, 모르는 분 모두 환영. 채비 공유 가능.", gear: "갈치 채비 (공유 가능)", cost: "교통비 각자", meetAt: "한림항", meetTime: "오후 9시" },
  { id: "m8", authorNick: "서귀포쌍방어", authorLevel: "Lv.38 고수", date: "2026-05-10", dday: -2, region: "서귀포", targetFish: "방어", totalSlots: 5, takenSlots: 5, status: "마감" as const, message: "지난주 출조 완료. 방어 대물 4마리 작살냈습니다. 다음번 공지 올릴게요!", gear: "-", cost: "-", meetAt: "-", meetTime: "-" },
];

const LEVEL_BADGE: Record<string, { bg: string; color: string }> = {
  입문: { bg: "rgba(134,239,172,0.15)", color: "#86efac" },
  중급: { bg: "rgba(96,165,250,0.15)", color: "#60a5fa" },
  고수: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  마스터: { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
  레전드: { bg: "rgba(251,113,133,0.15)", color: "#fb7185" },
};

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const post = MATCH_POSTS.find((p) => p.id === id);
  const [applied, setApplied] = useState(false);
  const [msg, setMsg] = useState("");

  if (!post) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-mute)" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🎣</div>
        모집글을 찾을 수 없습니다.
        <br />
        <Link href="/match" style={{ color: "var(--hook)", marginTop: 16, display: "inline-block" }}>← 목록으로</Link>
      </div>
    );
  }

  const closed = post.status === "마감";
  const full = post.takenSlots >= post.totalSlots;
  const pct = Math.min((post.takenSlots / post.totalSlots) * 100, 100);
  const lvlKey = post.authorLevel.split(" ")[1] ?? "중급";
  const lvlStyle = LEVEL_BADGE[lvlKey] ?? LEVEL_BADGE["중급"];

  const statusColor = closed ? "#94a3b8" : post.status === "마감임박" ? "#fbbf24" : "#86efac";
  const ddayLabel = post.dday === 0 ? "오늘!" : post.dday < 0 ? "종료" : `D-${post.dday}`;

  return (
    <>
      <style>{`
        .md-grid { display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 768px) {
          .md-grid { flex-direction: row; align-items: flex-start; }
          .md-main { flex: 1; }
          .md-side { width: 320px; flex-shrink: 0; }
        }
      `}</style>

      {/* 뒤로 가기 */}
      <div style={{ padding: "16px 20px 0" }}>
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
        >
          ← 목록으로
        </button>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 20px 100px" }}>
        <div className="md-grid">
          {/* 메인 영역 */}
          <div className="md-main">
            {/* 헤더 카드 */}
            <div style={{ background: "var(--tint-04)", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: 20, marginBottom: 12 }}>
              {/* 상태 배지 */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                  {ddayLabel}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: `${statusColor}18`, color: statusColor }}>
                  {post.status}
                </span>
              </div>

              {/* 어종·지역·날짜 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: "var(--ocean-300,#7dd3fc)", fontWeight: 700 }}>🐟 {post.targetFish}</span>
                <span style={{ fontSize: 14, color: "var(--text-dim)" }}>📍 {post.region}</span>
                <span style={{ fontSize: 14, color: "var(--text-dim)" }}>📅 {post.date}</span>
              </div>

              {/* 작성자 */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--tint-08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                  {post.authorNick[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>{post.authorNick}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: lvlStyle.bg, color: lvlStyle.color, border: `1px solid ${lvlStyle.color}44` }}>
                    {post.authorLevel}
                  </span>
                </div>
              </div>

              {/* 한마디 */}
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text)", margin: "16px 0 0" }}>{post.message}</p>
            </div>

            {/* 상세 정보 */}
            <div style={{ background: "var(--tint-04)", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: 20, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-strong)", marginBottom: 14 }}>출조 정보</div>
              {[
                { label: "집합 장소", value: post.meetAt },
                { label: "집합 시간", value: post.meetTime },
                { label: "필요 장비", value: post.gear },
                { label: "비용", value: post.cost },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: "var(--text-mute)", minWidth: 72, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: "var(--text)", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 사이드 — 참여 신청 */}
          <div className="md-side">
            <div style={{ background: "var(--tint-04)", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: 20, position: "sticky", top: 60 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-strong)", marginBottom: 14 }}>모집 현황</div>

              {/* 인원 프로그레스 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "var(--text-dim)" }}>참여 인원</span>
                  <span style={{ fontWeight: 700, color: full ? "var(--text-mute)" : "var(--text-strong)" }}>
                    {post.takenSlots}/{post.totalSlots}명
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: "var(--tint-08)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: full ? "rgba(100,116,139,0.5)" : pct >= 66 ? "#fbbf24" : "var(--hook)", transition: "width 0.3s" }} />
                </div>
                <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 6 }}>
                  잔여 {post.totalSlots - post.takenSlots}자리
                </div>
              </div>

              {/* 신청 메시지 */}
              {!closed && !applied && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", marginBottom: 6 }}>
                    한마디 (선택)
                  </label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="경험 수준이나 장비 상황을 알려주세요"
                    rows={3}
                    style={{ width: "100%", background: "var(--tint-08)", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>
              )}

              {applied ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 700, color: "#22c55e", fontSize: 15 }}>참여 신청 완료!</div>
                  <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 4 }}>
                    작성자가 수락하면 알림을 보내드려요
                  </div>
                  <button
                    onClick={() => setApplied(false)}
                    style={{ marginTop: 12, background: "none", border: "1px solid var(--line)", borderRadius: 8, padding: "6px 16px", color: "var(--text-mute)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    신청 취소
                  </button>
                </div>
              ) : (
                <button
                  disabled={closed || full}
                  onClick={() => setApplied(true)}
                  style={{ width: "100%", minHeight: 48, borderRadius: "var(--r-sm)", background: closed || full ? "var(--tint-08)" : "var(--hook)", color: closed || full ? "var(--text-mute)" : "var(--ocean-950,#0a1628)", fontWeight: 800, fontSize: 15, border: "none", cursor: closed || full ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
                >
                  {closed ? "마감된 모집" : full ? "인원 마감" : "참여 신청하기"}
                </button>
              )}

              <Link href="/match" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 13, color: "var(--text-mute)", textDecoration: "none" }}>
                ← 다른 모집글 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
