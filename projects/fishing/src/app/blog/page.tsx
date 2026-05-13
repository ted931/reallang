"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

/* ── 카테고리 ── */
const CATS = [
  { k: "all",    l: "전체" },
  { k: "catch",  l: "조황후기" },
  { k: "point",  l: "포인트" },
  { k: "gear",   l: "채비·장비" },
  { k: "guide",  l: "입문가이드" },
  { k: "news",   l: "낚시뉴스" },
];

const CAT_COLOR: Record<string, string> = {
  catch:  "#f59e0b",
  point:  "#22c55e",
  gear:   "#5fa3cf",
  guide:  "#a78bfa",
  news:   "#f87171",
};

/* ── 더미 포스트 ── */
const POSTS = [
  {
    id: "1", cat: "catch", hot: true,
    title: "한림 황금좌대 갈치 40마리 조황 — 새벽 4시 출조 완전 정복",
    summary: "5월 황금시즌 한림항 야간 갈치낚시 생생 후기. 꽁치 토막 미끼에 형광 발광체 조합으로 미친 조황을 경험했습니다. 물때부터 포인트까지 공개합니다.",
    date: "2026-05-13", read: 5,
    tags: ["갈치", "한림", "야간낚시"],
  },
  {
    id: "2", cat: "guide", hot: false,
    title: "제주 갯바위 찌낚시 완전 입문 가이드 — 장비 선택부터 현장 실전까지",
    summary: "낚시 한 번도 안 해본 분들을 위한 제주 갯바위 찌낚시 A to Z. 장비 구입 예산 20만원부터 시작하는 방법을 단계별로 정리했습니다.",
    date: "2026-05-11", read: 8,
    tags: ["입문", "찌낚시", "갯바위"],
  },
  {
    id: "3", cat: "point", hot: true,
    title: "성산 일출봉 앞 방파제 — 감성돔·벵에돔 숨겨진 명포인트 공개",
    summary: "제주 동쪽 숨겨진 명포인트. 10월~3월 감성돔 시즌에 상위 조과를 자랑하는 곳. 접근 방법과 주의사항, 최적 물때를 정리했습니다.",
    date: "2026-05-10", read: 6,
    tags: ["성산", "감성돔", "포인트"],
  },
  {
    id: "4", cat: "gear", hot: false,
    title: "2026 감성돔 찌낚시 채비 완전 정리 — 구멍찌부터 목줄 호수까지",
    summary: "시즌마다 헷갈리는 감성돔 채비를 한 번에 정리. 입문자용 세팅과 고수 세팅을 분리해서 설명합니다. 시마노 vs 다이와 비교도 포함.",
    date: "2026-05-09", read: 7,
    tags: ["감성돔", "채비", "릴"],
  },
  {
    id: "5", cat: "news", hot: false,
    title: "5월 제주 어황 예보 — 갈치·방어·광어 황금 시즌 진입",
    summary: "해양수산부 어황 예보 기반 5월 제주 낚시 전망. 수온 18도 진입으로 갈치·방어 포인트가 활성화되고 있습니다. 지역별 출조 추천 포함.",
    date: "2026-05-08", read: 4,
    tags: ["어황", "5월", "제주"],
  },
  {
    id: "6", cat: "catch", hot: false,
    title: "서귀포 외돌개 광어 루어낚시 — 65cm 대물 캐치 후기",
    summary: "아침 7시부터 11시까지 4시간 집중 공략. 워블러 계열 루어로 65cm 광어를 랜딩했습니다. 캐스팅 방향과 리트리브 속도 팁 공유.",
    date: "2026-05-07", read: 5,
    tags: ["광어", "루어", "서귀포"],
  },
  {
    id: "7", cat: "point", hot: false,
    title: "모슬포항 주변 방어 지깅 포인트 TOP 3",
    summary: "11월~2월 방어 시즌 모슬포에서 꼭 가야 할 포인트 3곳. 수심·조류 특성과 추천 지그 무게를 포인트별로 정리했습니다.",
    date: "2026-05-06", read: 6,
    tags: ["방어", "지깅", "모슬포"],
  },
  {
    id: "8", cat: "guide", hot: false,
    title: "낚시 초보도 쉽게 — 제주 좌대낚시 예약부터 현장까지 완벽 가이드",
    summary: "좌대가 뭔지도 모르는 분들을 위한 제주 좌대낚시 입문. 예약 방법, 준비물, 현장에서 생길 수 있는 상황들을 Q&A 형식으로 정리했습니다.",
    date: "2026-05-05", read: 9,
    tags: ["좌대", "입문", "예약"],
  },
  {
    id: "9", cat: "gear", hot: false,
    title: "갈치낚시 채비 묶는 법 — 단계별 사진으로 완전 정복",
    summary: "갈치 특유의 케미 발광 채비 묶는 방법을 사진으로 단계별 설명. 바늘 간격·목줄 길이까지 실전 세팅을 그대로 공개합니다.",
    date: "2026-05-04", read: 6,
    tags: ["갈치", "채비묶기", "입문"],
  },
  {
    id: "10", cat: "news", hot: false,
    title: "2026년 제주 낚시 규제 변경사항 완벽 정리",
    summary: "올해부터 바뀐 포획 금지 체장, 금지 어종, 허가 구역 변경사항을 한 번에 확인하세요. 모르고 낚시하다가 과태료 맞지 않도록 필수 확인.",
    date: "2026-05-03", read: 5,
    tags: ["규제", "법규", "제주"],
  },
  {
    id: "11", cat: "catch", hot: false,
    title: "애월 협재 볼락 야간 루어 — 손맛 최고의 포인트",
    summary: "저녁 8시부터 자정까지 협재 방파제 볼락 루어 조과 공유. 0.5g~1.5g 소형 지그헤드에 웜 조합으로 마릿수 폭발. 포인트 사진 포함.",
    date: "2026-05-02", read: 4,
    tags: ["볼락", "야간", "애월"],
  },
  {
    id: "12", cat: "point", hot: false,
    title: "제주 서쪽 해안 갯바위 포인트 지도 — 한림~모슬포 8곳",
    summary: "한림부터 모슬포까지 제주 서쪽 해안을 직접 발로 뛰며 정리한 갯바위 포인트 8곳. 접근 난이도, 추천 어종, 주차 정보 포함.",
    date: "2026-05-01", read: 7,
    tags: ["포인트지도", "서쪽해안", "갯바위"],
  },
];

/* ── 초안 작성기 (기존 기능) ── */
type TemplateKey = "catch" | "point" | "gear" | "guide";
type FormatKey = "text" | "naver";

const TEMPLATES = [
  { key: "catch" as TemplateKey, catColor: "#f59e0b", icon: "🐟", title: "조황 후기", desc: "날씨·어종·채비 총정리" },
  { key: "point" as TemplateKey, catColor: "#22c55e", icon: "📍", title: "포인트 소개", desc: "장소·물때·접근법 안내" },
  { key: "gear"  as TemplateKey, catColor: "#5fa3cf", icon: "🎣", title: "채비/장비 팁", desc: "채비·릴·낚싯대 추천" },
  { key: "guide" as TemplateKey, catColor: "#a78bfa", icon: "📚", title: "입문 가이드", desc: "초보자를 위한 단계별 안내" },
];

type FieldType = "text" | "textarea" | "multiline";
interface Field { key: string; label: string; type?: FieldType; placeholder?: string; }

const FIELDS: Record<TemplateKey, Field[]> = {
  catch: [
    { key: "date",    label: "날짜",           placeholder: "예) 2026-05-10" },
    { key: "place",   label: "장소",           placeholder: "예) 서귀포 외돌개" },
    { key: "species", label: "어종",           placeholder: "예) 감성돔, 벵에돔" },
    { key: "count",   label: "마릿수",         placeholder: "예) 3" },
    { key: "size",    label: "최대 사이즈(cm)", placeholder: "예) 42" },
    { key: "weather", label: "날씨",           placeholder: "예) 맑음, 북동풍 3m/s" },
    { key: "tide",    label: "물때",           placeholder: "예) 7물" },
    { key: "bait",    label: "미끼",           placeholder: "예) 크릴, 참갯지렁이" },
    { key: "rig",     label: "채비",           placeholder: "예) 구멍찌 채비 0호" },
    { key: "tip",     label: "포인트 팁",      type: "textarea", placeholder: "예) 썰물 시간대 외돌개 북쪽 암초 근처가 핫했습니다." },
    { key: "memo",    label: "추가 메모",      type: "textarea", placeholder: "자유롭게 후기를 작성하세요." },
  ],
  point: [
    { key: "name",    label: "포인트명",       placeholder: "예) 외돌개 갯바위" },
    { key: "region",  label: "지역",           placeholder: "예) 서귀포" },
    { key: "type",    label: "포인트 유형",    placeholder: "갯바위 / 방파제 / 선상 / 좌대" },
    { key: "species", label: "추천 어종",      placeholder: "예) 감성돔, 벵에돔" },
    { key: "season",  label: "최적 시기",      placeholder: "예) 10월~3월" },
    { key: "tide",    label: "물때",           placeholder: "예) 5~8물" },
    { key: "access",  label: "접근 방법",      type: "textarea", placeholder: "예) 주차장에서 도보 10분" },
    { key: "caution", label: "주의사항",       type: "textarea", placeholder: "예) 파도 높을 때 위험, 구명조끼 필수" },
    { key: "summary", label: "총평",           type: "textarea", placeholder: "이 포인트에 대한 전체 평가를 작성하세요." },
  ],
  gear: [
    { key: "fishType", label: "낚시 종류",    placeholder: "예) 찌낚시, 루어낚시" },
    { key: "target",   label: "대상어",       placeholder: "예) 감성돔" },
    { key: "rig",      label: "추천 채비",    placeholder: "예) 구멍찌 0호, 목줄 2호" },
    { key: "reel",     label: "추천 릴/낚싯대", placeholder: "예) 시마노 BB-X 3000" },
    { key: "bait",     label: "미끼",         placeholder: "예) 크릴, 참갯지렁이" },
    { key: "tips",     label: "팁 포인트",    type: "multiline", placeholder: "팁을 한 줄씩 입력하세요" },
    { key: "caution",  label: "주의사항",     type: "textarea", placeholder: "주의할 점을 작성하세요." },
  ],
  guide: [
    { key: "title",    label: "가이드 제목",  placeholder: "예) 제주 갯바위 찌낚시 입문 가이드" },
    { key: "audience", label: "대상 독자",    placeholder: "예) 낚시 첫 도전자" },
    { key: "content",  label: "핵심 내용",    type: "multiline", placeholder: "핵심 내용을 한 줄씩 입력하세요" },
    { key: "gear",     label: "추천 장비",    placeholder: "예) 입문용 세트 낚시대 + 3000번 릴" },
    { key: "caution",  label: "주의사항",     type: "textarea", placeholder: "초보자가 주의해야 할 사항" },
    { key: "closing",  label: "마무리 메시지", type: "textarea", placeholder: "독자에게 전하는 마무리 메시지" },
  ],
};

function generateText(template: TemplateKey, f: Record<string, string>): string {
  switch (template) {
    case "catch": return `📍 ${f.place||"장소"} 조황 후기\n\n안녕하세요, 퐁당입니다 🎣\n\n${f.date||"날짜"}에 ${f.place||"장소"}에서 낚시를 다녀왔습니다.\n\n🐟 오늘의 조과\n• 어종: ${f.species||"-"}\n• 마릿수: ${f.count||"-"}마리\n• 최대 사이즈: ${f.size||"-"}cm\n• 날씨: ${f.weather||"-"}\n• 물때: ${f.tide||"-"}\n\n🎣 사용한 채비\n• 미끼: ${f.bait||"-"}\n• 채비: ${f.rig||"-"}\n\n💡 포인트 팁\n${f.tip||"-"}\n\n📝 후기\n${f.memo||"-"}\n\n#낚시 #제주낚시 #${f.place||"제주"} #${f.species||"낚시"} #조황 #퐁당`;
    case "point": return `📍 ${f.name||"포인트명"} 포인트 소개\n\n안녕하세요, 퐁당입니다 🎣\n\n📌 포인트 정보\n• 포인트명: ${f.name||"-"}\n• 지역: ${f.region||"-"}\n• 유형: ${f.type||"-"}\n• 추천 어종: ${f.species||"-"}\n• 최적 시기: ${f.season||"-"}\n• 물때: ${f.tide||"-"}\n\n🗺 접근 방법\n${f.access||"-"}\n\n⚠️ 주의사항\n${f.caution||"-"}\n\n⭐ 총평\n${f.summary||"-"}\n\n#낚시 #제주낚시 #${f.region||"제주"} #${f.name||"포인트"} #퐁당`;
    case "gear": return `🎣 ${f.fishType||"낚시"} 채비/장비 팁\n\n안녕하세요, 퐁당입니다 🎣\n\n🎣 추천 세팅\n• 낚시 종류: ${f.fishType||"-"}\n• 대상어: ${f.target||"-"}\n• 추천 채비: ${f.rig||"-"}\n• 추천 릴/낚싯대: ${f.reel||"-"}\n• 미끼: ${f.bait||"-"}\n\n💡 팁 포인트\n${(f.tips||"-").split("\n").map((l,i)=>`${i+1}. ${l}`).join("\n")}\n\n⚠️ 주의사항\n${f.caution||"-"}\n\n#낚시 #채비팁 #${f.target||"낚시"} #장비추천 #퐁당`;
    case "guide": return `📚 ${f.title||"입문 가이드"}\n\n안녕하세요, 퐁당입니다 🎣\n\n대상 독자: ${f.audience||"-"}\n\n📋 핵심 내용\n${(f.content||"-").split("\n").map((l,i)=>`${i+1}. ${l}`).join("\n")}\n\n🎣 추천 장비\n${f.gear||"-"}\n\n⚠️ 주의사항\n${f.caution||"-"}\n\n💬 마무리\n${f.closing||"-"}\n\n#낚시입문 #제주낚시 #낚시가이드 #퐁당`;
    default: return "";
  }
}

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [showDraft, setShowDraft] = useState(false);

  // 초안 작성기 상태
  const [template, setTemplate] = useState<TemplateKey | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<FormatKey>("text");

  const filtered = useMemo(() =>
    activeCat === "all" ? POSTS : POSTS.filter(p => p.cat === activeCat),
    [activeCat]
  );

  async function handleCopy() {
    if (!preview) return;
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <style>{`
        .bl-wrap { max-width: 1080px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 28px); }
        .bl-hero {
          background: linear-gradient(180deg, #0a1628 0%, #0e2040 100%);
          padding: 48px 0 52px; margin-bottom: 0;
        }
        .bl-hero-kicker {
          font-size: 11px; font-weight: 800; letter-spacing: 3px;
          color: var(--hook); margin-bottom: 10px;
        }
        .bl-hero-title {
          font-size: clamp(28px, 5vw, 48px); font-weight: 900;
          color: #fff; letter-spacing: -1px; margin: 0 0 10px;
        }
        .bl-hero-sub { font-size: 14px; color: rgba(255,255,255,0.55); }
        .bl-hero-sub strong { color: #fbbf24; }

        .bl-cats {
          background: var(--ocean-950, #fff);
          border-bottom: 1px solid var(--line);
          position: sticky; top: 38px; z-index: 10;
        }
        .bl-cats-inner {
          max-width: 1080px; margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 28px);
          display: flex; gap: 6px; overflow-x: auto;
          scrollbar-width: none; padding-top: 14px; padding-bottom: 14px;
        }
        .bl-cats-inner::-webkit-scrollbar { display: none; }
        .bl-cat-btn {
          padding: 8px 20px; border-radius: 9px; font-size: 13px; font-weight: 700;
          border: 1.5px solid var(--line); background: var(--ocean-950, #fff);
          color: var(--text-dim); cursor: pointer; font-family: inherit;
          white-space: nowrap; transition: all 0.15s;
        }
        .bl-cat-btn:hover { border-color: #1e6595; color: #1e6595; }
        .bl-cat-btn.on { background: #1e6595; border-color: #1e6595; color: #fff; }

        .bl-list { padding: 32px 0 24px; }
        .bl-card {
          border-bottom: 1px solid var(--line);
          padding: 28px 0;
          cursor: pointer;
          transition: background 0.1s;
        }
        .bl-card:first-child { border-top: 1px solid var(--line); }
        .bl-card:hover .bl-card-title { color: #1e6595; }
        .bl-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .bl-cat-tag {
          font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px;
        }
        .bl-hot-badge {
          font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px;
          background: rgba(239,68,68,0.1); color: #ef4444;
          border: 1px solid rgba(239,68,68,0.25);
        }
        .bl-card-title {
          font-size: clamp(17px, 2.5vw, 22px); font-weight: 800;
          color: var(--text-strong); letter-spacing: -0.4px;
          line-height: 1.4; margin-bottom: 10px;
          transition: color 0.15s;
        }
        .bl-card-summary {
          font-size: 14px; color: var(--text-dim);
          line-height: 1.75; margin-bottom: 14px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bl-card-foot {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .bl-card-meta { font-size: 12px; color: var(--text-mute); font-weight: 500; }
        .bl-card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .bl-tag {
          font-size: 11px; font-weight: 600; padding: 2px 8px;
          background: var(--tint-06); border-radius: 4px;
          color: var(--text-dim);
        }

        /* PC: 2컬럼 그리드 */
        @media (min-width: 900px) {
          .bl-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 0 48px;
          }
          .bl-grid .bl-card:nth-child(odd) { border-right: 1px solid var(--line); padding-right: 48px; }
          .bl-grid .bl-card:nth-child(even) { padding-left: 0; }
        }

        /* 초안 작성기 */
        .bl-draft-wrap {
          border-top: 1px solid var(--line);
          padding: 32px 0 60px;
        }
        .bl-draft-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;
        }
        @media (min-width: 640px) { .bl-draft-grid { grid-template-columns: repeat(4, 1fr); } }
        .bl-tmpl-card {
          border: 2px solid var(--line); border-radius: 14px;
          padding: 18px 12px; background: var(--tint-03);
          cursor: pointer; transition: all 0.15s; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .bl-tmpl-card:hover { border-color: #5fa3cf; transform: translateY(-2px); }
        .bl-tmpl-card.on { border-color: #1e6595; background: rgba(30,101,149,0.08); }
        .bl-form { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .bl-field label { display: block; font-size: 12px; font-weight: 700; color: var(--text-dim); margin-bottom: 5px; }
        .bl-field input, .bl-field textarea {
          width: 100%; padding: 10px 14px; border-radius: 10px;
          background: var(--tint-06); border: 1px solid var(--line);
          color: var(--text-strong); font-size: 14px; font-family: inherit;
          outline: none; box-sizing: border-box; resize: vertical;
        }
        .bl-preview {
          background: var(--tint-04); border: 1px solid var(--line);
          border-radius: 14px; padding: 20px; margin-top: 20px;
        }
        .bl-preview pre {
          white-space: pre-wrap; font-size: 13px; line-height: 1.8;
          color: var(--text); font-family: inherit; margin: 0 0 16px;
        }
      `}</style>

      {/* 히어로 */}
      <div className="bl-hero">
        <div className="bl-wrap">
          <div className="bl-hero-kicker">PONGDANG BLOG</div>
          <h1 className="bl-hero-title">퐁당 낚시 블로그</h1>
          <p className="bl-hero-sub">
            조황후기 · 포인트 · 채비팁 · 입문가이드&nbsp;&nbsp;
            <strong>콘텐츠 {POSTS.length}+편</strong>
          </p>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="bl-cats">
        <div className="bl-cats-inner">
          {CATS.map(c => (
            <button
              key={c.k}
              className={`bl-cat-btn${activeCat === c.k ? " on" : ""}`}
              onClick={() => setActiveCat(c.k)}
            >
              {c.l}
            </button>
          ))}
        </div>
      </div>

      {/* 글 목록 */}
      <div className="bl-wrap">
        <div className="bl-list">
          <div style={{ fontSize: 13, color: "var(--text-mute)", marginBottom: 20, fontWeight: 600 }}>
            {filtered.length}개의 글
          </div>
          <div className="bl-grid">
            {filtered.map(post => {
              const color = CAT_COLOR[post.cat] ?? "#5fa3cf";
              const catLabel = CATS.find(c => c.k === post.cat)?.l ?? post.cat;
              return (
                <Link key={post.id} href={`/blog/${post.id}`} className="bl-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div className="bl-card-top">
                    <span className="bl-cat-tag" style={{ background: `${color}18`, color }}>
                      {catLabel}
                    </span>
                    {post.hot && <span className="bl-hot-badge">🔥 HOT</span>}
                  </div>
                  <div className="bl-card-title">{post.title}</div>
                  <div className="bl-card-summary">{post.summary}</div>
                  <div className="bl-card-foot">
                    <span className="bl-card-meta">{post.date} · {post.read}분 읽기</span>
                    <div className="bl-card-tags">
                      {post.tags.map(t => (
                        <span key={t} className="bl-tag">#{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 초안 작성 CTA */}
        <div className="bl-draft-wrap">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: "var(--text-strong)", letterSpacing: "-0.4px" }}>✍️ 블로그 초안 생성기</div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>템플릿 선택 → 내용 입력 → 자동 초안 생성</div>
            </div>
            <button
              onClick={() => setShowDraft(v => !v)}
              style={{
                padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: showDraft ? "var(--tint-08)" : "#1e6595",
                color: showDraft ? "var(--text-dim)" : "#fff",
                border: "none", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {showDraft ? "닫기" : "열기"}
            </button>
          </div>

          {showDraft && (
            <>
              {/* 템플릿 선택 */}
              <div className="bl-draft-grid">
                {TEMPLATES.map(t => (
                  <button
                    key={t.key}
                    className={`bl-tmpl-card${template === t.key ? " on" : ""}`}
                    onClick={() => { setTemplate(t.key); setForm({}); setPreview(""); }}
                    style={template === t.key ? { borderColor: t.catColor } : {}}
                  >
                    <span style={{ fontSize: 28 }}>{t.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: t.catColor }}>{t.title}</span>
                    <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{t.desc}</span>
                  </button>
                ))}
              </div>

              {/* 폼 */}
              {template && (
                <>
                  <div className="bl-form">
                    {FIELDS[template].map(field => (
                      <div key={field.key} className="bl-field">
                        <label>{field.label}</label>
                        {field.type === "textarea" || field.type === "multiline" ? (
                          <textarea
                            rows={field.type === "multiline" ? 4 : 3}
                            placeholder={field.placeholder}
                            value={form[field.key] ?? ""}
                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={form[field.key] ?? ""}
                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 포맷 + 생성 */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    {(["text", "naver"] as FormatKey[]).map(f => (
                      <button key={f} onClick={() => setFormat(f)} style={{
                        padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                        background: format === f ? "#1e6595" : "var(--tint-06)",
                        color: format === f ? "#fff" : "var(--text-dim)",
                        border: "none", cursor: "pointer", fontFamily: "inherit",
                      }}>
                        {f === "text" ? "일반 텍스트" : "네이버 HTML"}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPreview(generateText(template, form))}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 12,
                      background: "#1e6595", border: "none", color: "#fff",
                      fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    ✍️ 블로그 초안 생성
                  </button>
                </>
              )}

              {/* 미리보기 */}
              {preview && (
                <div className="bl-preview">
                  <pre>{preview}</pre>
                  <button
                    onClick={handleCopy}
                    style={{
                      padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                      background: copied ? "#22c55e" : "var(--tint-08)",
                      color: copied ? "#fff" : "var(--text)",
                      border: "1px solid var(--line)", cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {copied ? "✓ 복사완료!" : "📋 클립보드에 복사"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
