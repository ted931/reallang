"use client";

import { useState } from "react";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface Section {
  id: string;
  icon: string;
  title: string;
  content: React.ReactNode;
  highlight?: boolean;
  highlightText?: string;
}

function HighlightBox({ text }: { text: string }) {
  return (
    <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-3.5 flex items-start gap-2.5">
      <span className="text-base shrink-0">⚠️</span>
      <div>
        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-0.5 font-mono">중요</p>
        <p className="text-sm text-amber-900 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function AccordionSection({
  section,
  idx,
  isOpen,
  onToggle,
}: {
  section: Section;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      id={section.id}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden scroll-mt-24"
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="w-10 h-10 rounded-xl bg-orange-50 grid place-items-center text-lg shrink-0">
          {section.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-orange-500 font-bold">
            {String(idx + 1).padStart(2, "0")}
          </p>
          <p className="font-extrabold text-slate-900 leading-tight">{section.title}</p>
        </div>
        <span
          className={`text-slate-400 text-xs transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 border-t border-slate-100">
            <div className="mt-3 text-sm text-slate-700 leading-relaxed space-y-2">
              {section.content}
            </div>
            {section.highlight && section.highlightText && (
              <HighlightBox text={section.highlightText} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TableOfContents({
  sections,
  activeId,
  onJump,
}: {
  sections: Section[];
  activeId: string;
  onJump: (id: string) => void;
}) {
  return (
    <nav aria-label="목차">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-2">
        목차 · {sections.length}
      </p>
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onJump(s.id)}
          className={`w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            activeId === s.id
              ? "bg-orange-50 text-orange-700 font-bold"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span className="font-mono text-[10px] text-slate-400 w-5 shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="shrink-0">{s.icon}</span>
          <span className="truncate">{s.title}</span>
        </button>
      ))}
    </nav>
  );
}

const SECTIONS: Section[] = [
  {
    id: "priv-1",
    icon: "🔍",
    title: "수집하는 개인정보 항목",
    highlight: true,
    highlightText: "주민등록번호는 수집하지 않습니다.",
    content: (
      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex gap-3">
          <span className="text-xs font-bold text-slate-500 w-20 shrink-0">필수 항목</span>
          <span>이름(닉네임), 휴대폰 번호, 결제 정보(카드번호 일부)</span>
        </div>
        <div className="flex gap-3">
          <span className="text-xs font-bold text-slate-500 w-20 shrink-0">자동 수집</span>
          <span>서비스 이용 기록, 접속 로그, IP 주소, 기기 정보</span>
        </div>
      </div>
    ),
  },
  {
    id: "priv-2",
    icon: "🎯",
    title: "개인정보의 이용 목적",
    content: (
      <ul className="space-y-2">
        {[
          "파티 개설·참여 매칭 및 본인 확인",
          "에스크로 결제 처리 및 환불",
          "파티 관련 알림(카카오톡 등) 발송",
          "고객 문의 응대 및 분쟁 해결",
          "서비스 개선 및 통계 분석 (비식별화 처리)",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "priv-3",
    icon: "⏱",
    title: "개인정보 보유 및 이용 기간",
    highlight: true,
    highlightText: "전자상거래법 결제 기록 5년 / 통신비밀보호법 접속 기록 3개월",
    content: (
      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex gap-3">
          <span className="text-xs font-bold text-slate-500 w-28 shrink-0">회원 정보</span>
          <span>회원 탈퇴 시까지 (탈퇴 후 30일 내 파기)</span>
        </div>
        <div className="flex gap-3">
          <span className="text-xs font-bold text-slate-500 w-28 shrink-0">결제 기록</span>
          <span>전자상거래법에 따라 5년 보관</span>
        </div>
        <div className="flex gap-3">
          <span className="text-xs font-bold text-slate-500 w-28 shrink-0">서비스 이용 로그</span>
          <span>통신비밀보호법에 따라 3개월 보관</span>
        </div>
      </div>
    ),
  },
  {
    id: "priv-4",
    icon: "🤝",
    title: "개인정보의 제3자 제공",
    content: (
      <div className="space-y-3">
        <p>
          서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
          다만, 아래의 경우에 한해 제공될 수 있습니다.
        </p>
        <ul className="space-y-2">
          {[
            "이용자가 사전에 동의한 경우",
            "파티 매칭을 위해 파티장/파티원에게 닉네임 및 연락처 일부 제공",
            "결제 처리를 위해 PG사(결제대행사)에 최소한의 정보 제공",
            "법령에 의해 요구되는 경우",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "priv-5",
    icon: "🗑",
    title: "개인정보 파기 절차 및 방법",
    content: (
      <ul className="space-y-2">
        {[
          { label: "파기 절차", desc: "보유 기간 만료 또는 처리 목적 달성 시 지체 없이 파기" },
          {
            label: "파기 방법",
            desc: "전자 파일은 복구 불가능한 방법으로 영구 삭제, 종이 문서는 분쇄 또는 소각",
          },
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
            <span>
              <strong>{item.label}:</strong> {item.desc}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "priv-6",
    icon: "👥",
    title: "이용자의 권리",
    content: (
      <p>
        이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
        고객센터(help@jejuparty.kr)로 문의해주시면 즉시 처리하겠습니다.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([SECTIONS[0].id]));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const jump = (id: string) => {
    setOpenIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const allOpen = openIds.size === SECTIONS.length;

  const toggleAll = () => {
    setOpenIds(allOpen ? new Set() : new Set(SECTIONS.map((s) => s.id)));
  };

  const activeId = [...openIds][0] ?? SECTIONS[0].id;

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* sticky header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center gap-3">
          <a href={base || "/"} className="text-slate-400 hover:text-slate-700 text-sm">
            ← 홈
          </a>
          <span className="text-slate-200">/</span>
          <h1 className="text-sm font-extrabold text-slate-900">개인정보처리방침</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        {/* doc header */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-2">
            JEJU-PARTY POLICY
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900">개인정보처리방침</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs font-mono text-slate-500">
            <span className="px-2 py-1 rounded-full bg-white border border-slate-200">v1.0.0</span>
            <span className="text-slate-300">·</span>
            <span>최종 업데이트 2026.04.01</span>
            <span className="text-slate-300">·</span>
            <span>시행일 2026.04.01</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* side TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 bg-white border border-slate-200 rounded-2xl p-4">
              <TableOfContents sections={SECTIONS} activeId={activeId} onJump={jump} />
              <div className="mt-4 px-2">
                <button
                  onClick={toggleAll}
                  className="text-xs text-orange-500 font-bold hover:text-orange-600"
                >
                  {allOpen ? "모두 접기" : "모두 펼치기"} ↕
                </button>
              </div>
            </div>
          </aside>

          {/* accordion list */}
          <div className="space-y-3 min-w-0">
            {/* mobile top TOC */}
            <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-4 mb-2">
              <div className="grid grid-cols-2 gap-2">
                {SECTIONS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => jump(s.id)}
                    className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-orange-50 text-left text-sm"
                  >
                    <span className="font-mono text-[10px] text-slate-400 w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="shrink-0">{s.icon}</span>
                    <span className="truncate text-slate-700">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end lg:hidden mb-1">
              <button
                onClick={toggleAll}
                className="text-xs text-orange-500 font-bold hover:text-orange-600"
              >
                {allOpen ? "모두 접기" : "모두 펼치기"} ↕
              </button>
            </div>

            {SECTIONS.map((s, i) => (
              <AccordionSection
                key={s.id}
                section={s}
                idx={i}
                isOpen={openIds.has(s.id)}
                onToggle={() => toggle(s.id)}
              />
            ))}

            {/* contact footer */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 mt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white grid place-items-center text-xl shrink-0">
                  📮
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-slate-900">문의처</p>
                  <p className="text-sm text-slate-600 mt-1">
                    약관 및 개인정보 처리에 관한 문의는 아래로 연락주세요.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                    <a
                      href="mailto:help@jejuparty.kr"
                      className="px-3 py-1.5 rounded-lg bg-white border border-orange-200 font-mono text-orange-600 font-bold hover:bg-orange-50"
                    >
                      help@jejuparty.kr
                    </a>
                    <span className="text-slate-500">평일 10:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 pt-4 border-t border-slate-100 text-right">
              시행일: 2026년 4월 1일
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
