"use client";

import { useState } from "react";
import DevNav from "@/components/dev-nav";

// --- 더미 데이터 ---
const DUMMY_BOOKING = {
  id: "JP-2026-051203",
  party: {
    emoji: "🏄",
    title: "서핑 입문 클래스",
    headcount: 2,
    total: 117000,
  },
  date: "2026년 5월 12일 (월) 14:00",
  location: "협재해변 주차장 입구",
  host: "서핑왕민준",
  hostPhone: "010-XXXX-1234",
  supplies: "수영복 · 수건 · 자외선 차단제",
  includes: "보드 · 슈트 · 강습 · 보험",
  paymentMethod: "카카오페이",
  user: "박지원",
  hostNote: "5/12 14:00 협재해변 주차장 입구에서 만나요. 비 와도 진행하니 가벼운 마음으로 오세요!",
};

const NEXT_ACTIONS = [
  { icon: "📅", label: "캘린더에 추가", sub: "iCal · Google" },
  { icon: "💬", label: "카톡으로 일행에게 공유", sub: "함께 가는 친구에게" },
  { icon: "📄", label: "영수증 / 세금계산서", sub: "PDF 다운로드" },
  { icon: "📍", label: "만남 장소 길찾기", sub: "카카오맵 열기" },
];

const UPSELL_ITEMS = [
  {
    icon: "🚗",
    label: "렌터카",
    sub: "5/12 픽업 · 협재 가까운 차량",
    cta: "15% 할인",
    href: "/",
  },
  {
    icon: "☕",
    label: "카페패스",
    sub: "5일권 · 협재 인근 12개 카페",
    cta: "₩19,900",
    href: "/",
  },
  {
    icon: "🏨",
    label: "근처 숙소",
    sub: "협재 도보 5분 · 평점 4.7+",
    cta: "검색하기",
    href: "/",
  },
];

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
        {label}
      </span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const [confettiShown] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-slate-50">
      <DevNav />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* 성공 헤더 */}
        <div className="text-center mb-10">
          <div
            className="inline-grid place-items-center w-20 h-20 rounded-full bg-emerald-500 text-white text-4xl mb-4 shadow-lg shadow-emerald-200"
            aria-hidden="true"
          >
            ✓
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">예약 확정!</h1>
          <p className="text-slate-600 mt-2">{DUMMY_BOOKING.user} 님, 멋진 제주 여행 되세요 🌊</p>
          <p className="font-mono text-xs text-slate-400 mt-2">
            예약번호{" "}
            <span className="font-bold text-slate-700">#{DUMMY_BOOKING.id}</span> ·{" "}
            {DUMMY_BOOKING.paymentMethod} 결제
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* QR 티켓 */}
          <div
            className="bg-white rounded-2xl overflow-hidden border border-slate-200"
            style={{
              backgroundImage:
                "radial-gradient(circle at 0 50%, transparent 8px, white 8px), radial-gradient(circle at 100% 50%, transparent 8px, white 8px)",
              backgroundSize: "50% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center, right center",
            }}
          >
            {/* 티켓 헤더 */}
            <div className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">
                  e-Ticket
                </p>
                <p className="font-extrabold mt-0.5">{DUMMY_BOOKING.party.title}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] opacity-80">
                  {DUMMY_BOOKING.party.headcount}명
                </p>
                <p className="font-extrabold">
                  ₩{DUMMY_BOOKING.party.total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 티켓 본문 */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-start">
              {/* QR 코드 더미 */}
              <div
                className="bg-slate-900 rounded-xl p-3 aspect-square w-full max-w-[160px] grid place-items-center"
                style={{
                  backgroundImage:
                    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "8px 8px",
                }}
                aria-label="QR 코드"
              >
                <div className="bg-white rounded p-2 font-mono text-[9px] text-center leading-tight">
                  QR
                  <br />
                  SCAN
                  <br />
                  HERE
                </div>
              </div>

              {/* 예약 상세 */}
              <div className="space-y-3 text-sm">
                <TicketRow label="일시" value={DUMMY_BOOKING.date} />
                <TicketRow label="만남 장소" value={DUMMY_BOOKING.location} />
                <TicketRow
                  label="호스트"
                  value={`${DUMMY_BOOKING.host} · ${DUMMY_BOOKING.hostPhone}`}
                />
                <TicketRow label="준비물" value={DUMMY_BOOKING.supplies} />
                <TicketRow label="포함" value={DUMMY_BOOKING.includes} />
              </div>
            </div>

            {/* 티켓 하단 */}
            <div className="border-t-2 border-dashed border-slate-200 px-6 py-4 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">
                결제 완료 · {DUMMY_BOOKING.paymentMethod}
              </span>
              <span className="font-extrabold">{DUMMY_BOOKING.id}</span>
            </div>
          </div>

          {/* 사이드바 */}
          <aside className="space-y-4">
            {/* 다음 액션 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">
                다음 액션
              </p>
              <div className="space-y-2">
                {NEXT_ACTIONS.map(({ icon, label, sub }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left border border-slate-100 transition-colors"
                  >
                    <span className="text-2xl" aria-hidden="true">{icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{label}</p>
                      <p className="text-[11px] font-mono text-slate-500">{sub}</p>
                    </div>
                    <span className="text-slate-300" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 호스트 안내 */}
            <div className="bg-slate-900 text-white rounded-2xl p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2">
                호스트 안내
              </p>
              <p className="text-sm leading-relaxed">"{DUMMY_BOOKING.hostNote}"</p>
              <button className="mt-3 px-3 py-1.5 bg-white text-slate-900 text-xs font-extrabold rounded-lg hover:bg-slate-100 transition-colors">
                호스트에게 메시지
              </button>
            </div>
          </aside>
        </div>

        {/* 업셀 — 함께 준비하면 좋아요 */}
        <div className="mt-10">
          <h2 className="text-lg font-extrabold mb-3">함께 준비하면 좋아요</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {UPSELL_ITEMS.map(({ icon, label, sub, cta, href }) => (
              <a
                key={label}
                href={href}
                className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition-all block"
              >
                <div className="text-3xl mb-2" aria-hidden="true">{icon}</div>
                <p className="font-extrabold">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                <p className="mt-2 text-xs font-extrabold text-orange-600">{cta} →</p>
              </a>
            ))}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <a
            href="/party/p3"
            className="px-8 py-3.5 bg-orange-500 text-white font-extrabold rounded-xl text-center hover:bg-orange-600 transition-colors"
          >
            파티 상세 보기
          </a>
          <a
            href="/"
            className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-center hover:bg-slate-50 transition-colors"
          >
            다른 파티 둘러보기
          </a>
        </div>

        {/* 문의 */}
        <div className="text-center mt-10 font-mono text-xs text-slate-400">
          <p>문의: help@jeju.party · 1588-0000 · 평일 09–18시</p>
          <p className="mt-1">예약 내역은 마이페이지에서 언제든 확인 가능합니다.</p>
        </div>
      </div>
    </div>
  );
}
