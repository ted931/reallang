"use client";

import { useState } from "react";

// ─── 더미 데이터 ───────────────────────────────────────────────
const TONE_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  slate: "bg-slate-100 text-slate-600",
  violet: "bg-violet-100 text-violet-700",
  cyan: "bg-cyan-100 text-cyan-700",
};

type NotifType = "booking" | "msg" | "review" | "promo" | "system" | "party";

interface Notif {
  id: number;
  type: NotifType;
  icon: string;
  tone: keyof typeof TONE_CLASSES;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  sender?: boolean;
}

const DUMMY_NOTIFS: Notif[] = [
  {
    id: 1,
    type: "booking",
    icon: "✓",
    tone: "emerald",
    title: "예약 확정",
    body: "서핑 입문 클래스 — 5/12 (월) 14:00 협재",
    time: "2분 전",
    unread: true,
  },
  {
    id: 2,
    type: "msg",
    icon: "💬",
    tone: "blue",
    title: "서핑왕민준",
    body: "안녕하세요! 내일 일정 확인 부탁드려요. 11시까지 협재해변 입구로 오시면…",
    time: "18분 전",
    unread: true,
    sender: true,
  },
  {
    id: 3,
    type: "review",
    icon: "★",
    tone: "amber",
    title: "리뷰 요청",
    body: "어제 다녀온 봄날 카페는 어떠셨나요? 리뷰를 남기면 1,000P 적립",
    time: "2시간 전",
    unread: true,
  },
  {
    id: 4,
    type: "party",
    icon: "🎉",
    tone: "violet",
    title: "파티 신청 완료",
    body: "한라산 새벽 등반 파티에 신청하셨습니다. 출발 전날 리마인드 알림을 보내드릴게요.",
    time: "어제",
    unread: true,
  },
  {
    id: 5,
    type: "promo",
    icon: "🎁",
    tone: "rose",
    title: "5월 한정 프로모션",
    body: "렌터카 + 파티 동시 예약 시 20% 할인. 5/15까지",
    time: "어제",
    unread: false,
  },
  {
    id: 6,
    type: "booking",
    icon: "✓",
    tone: "emerald",
    title: "예약 취소",
    body: "4/28 한라산 등반 클래스 예약이 호스트에 의해 취소되었습니다.",
    time: "4/27",
    unread: false,
  },
  {
    id: 7,
    type: "system",
    icon: "🔔",
    tone: "slate",
    title: "시스템 안내",
    body: "개인정보 처리방침이 5/01 자로 일부 변경되었습니다.",
    time: "5/01",
    unread: false,
  },
  {
    id: 8,
    type: "msg",
    icon: "💬",
    tone: "blue",
    title: "카페패스 운영팀",
    body: "카페패스 5월 정산 명세서가 도착했어요.",
    time: "5/01",
    unread: false,
    sender: true,
  },
  {
    id: 9,
    type: "party",
    icon: "🎉",
    tone: "violet",
    title: "파티 모집 마감 임박",
    body: "내가 신청한 '우도 자전거 투어' 파티가 1자리만 남았어요!",
    time: "4/30",
    unread: false,
  },
  {
    id: 10,
    type: "review",
    icon: "★",
    tone: "amber",
    title: "리뷰 작성 완료",
    body: "협재 서핑 클래스 리뷰 작성에 감사드려요. 500P가 적립되었습니다.",
    time: "4/29",
    unread: false,
  },
  {
    id: 11,
    type: "promo",
    icon: "🎁",
    tone: "rose",
    title: "카페패스 특가",
    body: "이번 주말 카페패스 이용 시 아메리카노 무료 업그레이드!",
    time: "4/28",
    unread: false,
  },
  {
    id: 12,
    type: "booking",
    icon: "✓",
    tone: "emerald",
    title: "파티 시작 리마인더",
    body: "내일 오전 9시 '한라산 등반' 파티가 시작됩니다. 준비물을 확인하세요.",
    time: "4/27",
    unread: false,
  },
];

const TABS = [
  { id: "all" as const, label: "전체" },
  { id: "booking" as const, label: "예약" },
  { id: "party" as const, label: "파티" },
  { id: "msg" as const, label: "메시지" },
  { id: "promo" as const, label: "프로모션" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── 컴포넌트 ───────────────────────────────────────────────────
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [notifs, setNotifs] = useState<Notif[]>(DUMMY_NOTIFS);
  const [selectedId, setSelectedId] = useState<number | null>(2);

  const filtered =
    activeTab === "all" ? notifs : notifs.filter((n) => n.type === activeTab);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const tabCount = (id: TabId) => {
    if (id === "all") return notifs.filter((n) => n.unread).length;
    return notifs.filter((n) => n.type === id && n.unread).length;
  };

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id: number) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

  const selectedNotif = notifs.find((n) => n.id === selectedId) ?? null;

  // 스레드 메시지 더미
  const THREAD = [
    { who: "host", text: "안녕하세요! 내일 일정 확인 부탁드려요.", time: "14:02" },
    {
      who: "host",
      text: "11시까지 협재해변 입구로 오시면 됩니다. 슈트와 보드는 제가 다 챙겨갈게요.",
      time: "14:02",
    },
    {
      who: "me",
      text: "네 안녕하세요! 11시 도착이면 점심은 끝나고 먹게 될까요?",
      time: "14:18",
    },
    {
      who: "host",
      text: "네, 1시쯤 클래스 끝나고 근처 맛집 추천드릴게요 :) 수영복은 안에 입고 오시면 편해요.",
      time: "14:21",
    },
    {
      who: "me",
      text: "알겠습니다. 비 예보 있던데 우산 챙겨야 할까요?",
      time: "14:25",
    },
    {
      who: "host",
      text: "아침 9시쯤 다시 확인 후 알려드릴게요. 가벼운 비는 클래스 진행 가능합니다.",
      time: "14:27",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              jeju<span className="text-orange-500">.party</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">알림 센터</p>
          </div>
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`}
            className="text-sm font-bold text-slate-500 hover:text-slate-800"
          >
            ← 피드로
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[680px] grid grid-cols-1 md:grid-cols-[340px_1fr]">
          {/* ── 왼쪽: 알림 리스트 ─────────────────────────── */}
          <div className="border-r border-slate-200 flex flex-col">
            {/* 헤더 */}
            <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold">알림</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-extrabold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  모두 읽음
                </button>
              </div>
              {/* 탭 */}
              <div
                className="flex gap-1 overflow-x-auto -mx-1 px-1"
                style={{ scrollbarWidth: "none" }}
              >
                {TABS.map((tab) => {
                  const on = activeTab === tab.id;
                  const cnt = tabCount(tab.id);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                        on
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab.label}
                      {cnt > 0 && (
                        <span
                          className={`ml-1 font-mono text-[10px] ${
                            on ? "text-white/70" : "text-slate-400"
                          }`}
                        >
                          {cnt}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 알림 아이템 목록 */}
            <ul className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <li className="p-12 text-center text-slate-400 text-sm">
                  알림이 없습니다
                </li>
              ) : (
                filtered.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => {
                        setSelectedId(n.id);
                        markRead(n.id);
                      }}
                      className={`w-full text-left px-5 py-4 flex gap-3 hover:bg-slate-50 transition-colors ${
                        selectedId === n.id ? "bg-orange-50/60" : ""
                      } ${n.unread ? "bg-orange-50/30" : ""}`}
                    >
                      {/* 아이콘 */}
                      <div
                        className={`w-9 h-9 rounded-lg grid place-items-center text-sm shrink-0 ${
                          TONE_CLASSES[n.tone]
                        }`}
                      >
                        {n.icon}
                      </div>
                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-extrabold text-sm text-slate-900 truncate">
                            {n.title}
                          </p>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.body}
                        </p>
                      </div>
                      {/* 미읽음 점 */}
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* ── 오른쪽: 상세 / 스레드 ──────────────────────── */}
          <div className="flex flex-col bg-slate-50">
            {selectedNotif?.sender ? (
              <>
                {/* 채팅 헤더 */}
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-400 grid place-items-center text-white font-extrabold shrink-0">
                    민
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold">{selectedNotif.title}</p>
                    <p className="text-[11px] font-mono text-emerald-600">
                      ● 활성 · 보통 12분 내 응답
                    </p>
                  </div>
                  <button className="text-slate-400 text-xl">⋯</button>
                </div>

                {/* 예약 카드 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-amber-200 grid place-items-center text-lg shrink-0">
                      🏄
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-slate-900">
                        서핑 입문 클래스 · 5/12 (월) 14:00
                      </p>
                      <p className="text-amber-700 font-mono">협재해변 · 4시간 · ₩65,000</p>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-white font-bold shrink-0">
                      확정
                    </span>
                  </div>
                  {THREAD.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm ${
                          m.who === "me"
                            ? "bg-orange-500 text-white rounded-br-md"
                            : "bg-white border border-slate-200 rounded-bl-md"
                        }`}
                      >
                        <p>{m.text}</p>
                        <p
                          className={`font-mono text-[10px] mt-1 ${
                            m.who === "me" ? "text-orange-100" : "text-slate-400"
                          }`}
                        >
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 메시지 입력 */}
                <div className="bg-white border-t border-slate-200 p-4 flex items-center gap-2">
                  <button className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center text-slate-500 text-lg shrink-0">
                    📎
                  </button>
                  <input
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400"
                    placeholder="메시지 입력..."
                  />
                  <button className="px-4 py-2.5 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 active:scale-95 transition-all shrink-0">
                    전송
                  </button>
                </div>
              </>
            ) : selectedNotif ? (
              /* 일반 알림 상세 */
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div
                  className={`w-16 h-16 rounded-2xl grid place-items-center text-3xl mb-4 ${
                    TONE_CLASSES[selectedNotif.tone]
                  }`}
                >
                  {selectedNotif.icon}
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                  {selectedNotif.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                  {selectedNotif.body}
                </p>
                <span className="mt-4 font-mono text-xs text-slate-400">
                  {selectedNotif.time}
                </span>
                {selectedNotif.type === "booking" && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`}
                    className="mt-6 px-5 py-2.5 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    예약 상세 보기 →
                  </a>
                )}
                {selectedNotif.type === "review" && (
                  <button className="mt-6 px-5 py-2.5 bg-amber-500 text-white text-sm font-extrabold rounded-xl hover:bg-amber-600 transition-colors">
                    리뷰 작성하기 →
                  </button>
                )}
              </div>
            ) : (
              /* 선택 없을 때 */
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 grid place-items-center text-3xl mb-4">
                  🔔
                </div>
                <p className="font-bold text-slate-500">알림을 선택하세요</p>
                <p className="text-sm mt-1">왼쪽 목록에서 알림을 클릭하면 상세 내용이 표시됩니다</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
