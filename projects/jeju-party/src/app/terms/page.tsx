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
            제 {String(idx + 1).padStart(2, "0")} 조
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
    id: "sec-1",
    icon: "📋",
    title: "목적",
    content: (
      <p>
        본 약관은 &quot;제주 취미 파티&quot;(이하 &quot;서비스&quot;)가 제공하는 취미 모임 매칭, 결제 대행, 카페패스 등
        관련 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무, 책임사항 등을 규정함을 목적으로 합니다.
      </p>
    ),
  },
  {
    id: "sec-2",
    icon: "🛠",
    title: "서비스의 내용",
    content: (
      <ol className="list-none space-y-2">
        {[
          "취미 활동 파티(모임) 개설 및 참여 매칭",
          "에스크로(안전결제) 방식의 참여비 결제 대행",
          "카페패스 판매 및 제휴 카페 이용권 제공",
          "파티장(호스트)과 파티원(참여자) 간 커뮤니케이션 지원",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="font-mono text-[11px] text-slate-400 mt-0.5 shrink-0">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "sec-3",
    icon: "👤",
    title: "이용자의 의무",
    content: (
      <ol className="list-none space-y-2">
        {[
          "정확한 본인 정보를 제공해야 합니다.",
          "휴대폰 본인인증을 완료해야 파티 개설 및 참여가 가능합니다.",
          "타인의 권리를 침해하거나 불쾌감을 주는 행위를 해서는 안 됩니다.",
          "파티 참여 시 파티장의 안내에 협조해야 합니다.",
          "만 14세 이상만 서비스를 이용할 수 있습니다.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="font-mono text-[11px] text-slate-400 mt-0.5 shrink-0">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "sec-4",
    icon: "🚫",
    title: "금지행위",
    content: (
      <ol className="list-none space-y-2">
        {[
          "허위 정보를 이용한 파티 개설 또는 참여",
          "상업적 목적(영업, 홍보, 종교, 정치 등)으로의 서비스 이용",
          "타 이용자에 대한 성희롱, 폭언, 협박, 스토킹 등 부적절한 행위",
          "노쇼(사전 연락 없는 불참)",
          "서비스 운영을 방해하는 일체의 행위",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="font-mono text-[11px] text-slate-400 mt-0.5 shrink-0">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "sec-5",
    icon: "💳",
    title: "에스크로 결제 및 환불 규정",
    highlight: true,
    highlightText: "파티 완료 후 파티장에게 정산됩니다. 환불은 시간 기준으로 차등 적용됩니다.",
    content: (
      <div className="space-y-4">
        <p>
          서비스는 안전한 거래를 위해 <strong>에스크로(안전결제) 방식</strong>을 사용합니다.
          결제 금액은 파티가 정상적으로 완료될 때까지 플랫폼에 안전하게 보관되며,
          파티 완료 후 파티장에게 정산됩니다.
        </p>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="font-bold text-slate-900 mb-3">환불 규정</p>
          <ul className="space-y-2">
            {[
              { label: "파티 48시간 전 취소", value: "전액 환불", color: "text-emerald-600" },
              { label: "파티 24시간 전 취소", value: "50% 환불", color: "text-orange-500" },
              { label: "당일 취소", value: "환불 불가", color: "text-red-500" },
              { label: "파티장이 취소한 경우", value: "전액 환불", color: "text-emerald-600" },
            ].map((row, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">
                  <strong>{row.label}</strong>
                </span>
                <span className={`font-bold ${row.color}`}>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "sec-6",
    icon: "🚗",
    title: "렌터카 동승 면책",
    content: (
      <div className="space-y-2">
        <p>
          파티장이 제공하는 렌터카 동승은 서비스의 부수적 편의사항이며,
          서비스는 렌터카 운행 중 발생하는 교통사고, 차량 손해, 신체 상해 등에 대해
          직접적인 책임을 지지 않습니다.
        </p>
        <p>
          동승자는 자발적 의사에 따라 탑승하는 것이며, 운전자(파티장)의 보험 범위 내에서
          처리됩니다. 동승 전 보험 가입 여부를 확인하시기를 권장합니다.
        </p>
      </div>
    ),
  },
  {
    id: "sec-7",
    icon: "⚖️",
    title: "면책조항",
    content: (
      <ol className="list-none space-y-2">
        {[
          "서비스는 파티장과 파티원 간 매칭 플랫폼을 제공하며, 파티 진행 중 발생하는 사고·분쟁에 대해 직접적 책임을 지지 않습니다.",
          "천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.",
          "이용자 간 분쟁은 당사자 간 해결을 원칙으로 하며, 서비스는 분쟁 해결을 위한 중재 노력을 합니다.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="font-mono text-[11px] text-slate-400 mt-0.5 shrink-0">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "sec-8",
    icon: "🤝",
    title: "분쟁해결",
    content: (
      <ol className="list-none space-y-2">
        {[
          "서비스 이용과 관련된 분쟁은 서비스 내 신고·접수 시스템을 통해 우선 처리합니다.",
          "당사자 간 합의가 이루어지지 않는 경우, 한국소비자원 또는 관할 법원을 통해 해결합니다.",
          "본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="font-mono text-[11px] text-slate-400 mt-0.5 shrink-0">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    ),
  },
];

export default function TermsPage() {
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
          <h1 className="text-sm font-extrabold text-slate-900">서비스 이용약관</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        {/* doc header */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-2">
            JEJU-PARTY POLICY
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900">서비스 이용약관</h2>
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
