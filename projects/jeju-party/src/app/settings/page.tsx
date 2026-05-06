"use client";

import { useState } from "react";

// ─── 타입 ──────────────────────────────────────────────────────
type SectionId =
  | "profile"
  | "account"
  | "notify"
  | "connected"
  | "pay"
  | "privacy"
  | "danger";

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
  danger?: boolean;
}

// ─── 상수 ──────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "프로필", icon: "👤" },
  { id: "account", label: "계정 · 보안", icon: "🔒" },
  { id: "notify", label: "알림 설정", icon: "🔔" },
  { id: "connected", label: "연결 계정", icon: "🔗" },
  { id: "pay", label: "결제 수단", icon: "💳" },
  { id: "privacy", label: "개인정보", icon: "🛡️" },
  { id: "danger", label: "위험 영역", icon: "⚠️", danger: true },
];

// ─── 공통 서브 컴포넌트 ─────────────────────────────────────────
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black text-slate-900">{title}</h2>
      {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function FormField({
  label,
  value,
  hint,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  hint?: string;
  type?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 transition-colors"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {hint && <p className="text-[10px] font-mono text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${
        on ? "bg-orange-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
          on ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

// ─── 섹션: 프로필 ───────────────────────────────────────────────
function ProfileSection() {
  const [nickname, setNickname] = useState("박지원");
  const [realName, setRealName] = useState("박지원");
  const [bio, setBio] = useState("제주 좋아하는 직장인. 서핑 입문 중!");
  const [region, setRegion] = useState("서울");

  return (
    <div>
      <SectionHeader title="프로필" sub="다른 사용자에게 보이는 정보입니다" />
      {/* 아바타 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-orange-400 grid place-items-center text-white text-3xl font-extrabold shrink-0">
          박
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-extrabold rounded-lg hover:bg-slate-700 transition-colors">
              사진 변경
            </button>
            <button className="text-xs text-rose-500 font-bold hover:text-rose-700">
              제거
            </button>
          </div>
          <p className="text-[10px] font-mono text-slate-400">
            JPG, PNG · 최소 200×200 · 최대 5MB
          </p>
        </div>
      </div>
      <FormField
        label="닉네임"
        value={nickname}
        hint="공개 표시명"
        onChange={setNickname}
      />
      <FormField
        label="실명"
        value={realName}
        hint="결제·환불 시에만 사용"
        onChange={setRealName}
      />
      <FormField
        label="자기소개"
        value={bio}
        onChange={setBio}
      />
      <FormField
        label="활동 지역"
        value={region}
        onChange={setRegion}
      />
      <button className="mt-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 active:scale-95 transition-all">
        저장
      </button>
    </div>
  );
}

// ─── 섹션: 계정 · 보안 ──────────────────────────────────────────
function AccountSection() {
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div>
      <SectionHeader title="계정 · 보안" />
      <FormField label="이메일" value="jiwon@example.com" />
      <FormField label="휴대전화" value="010-2345-6789" />
      <div className="bg-white border border-slate-200 rounded-xl p-4 my-4 flex items-center justify-between">
        <div>
          <p className="font-extrabold text-sm">2단계 인증</p>
          <p className="text-xs text-slate-500 mt-0.5">로그인 시 SMS 코드 추가 입력</p>
        </div>
        <Toggle on={twoFactor} onClick={() => setTwoFactor((v) => !v)} />
      </div>
      <button className="text-sm text-orange-600 font-bold hover:text-orange-700">
        비밀번호 변경 →
      </button>
    </div>
  );
}

// ─── 섹션: 알림 설정 ────────────────────────────────────────────
type NotifyChannel = "email" | "sms" | "push" | "kakao";
type NotifyEvent =
  | "booking"
  | "message"
  | "review"
  | "promo"
  | "notice";

interface NotifyMatrix {
  [event: string]: Record<NotifyChannel, boolean>;
}

const EVENT_LABELS: Record<NotifyEvent, string> = {
  booking: "예약 확정",
  message: "호스트 메시지",
  review: "리뷰 요청",
  promo: "프로모션",
  notice: "공지사항",
};

const CHANNEL_LABELS: Record<NotifyChannel, string> = {
  email: "이메일",
  sms: "SMS",
  push: "푸시",
  kakao: "카톡",
};

const CHANNELS: NotifyChannel[] = ["email", "sms", "push", "kakao"];
const EVENTS: NotifyEvent[] = ["booking", "message", "review", "promo", "notice"];

function NotifySection() {
  const [matrix, setMatrix] = useState<NotifyMatrix>({
    booking: { email: true, sms: true, push: true, kakao: true },
    message: { email: true, sms: false, push: true, kakao: true },
    review: { email: true, sms: false, push: false, kakao: false },
    promo: { email: false, sms: false, push: true, kakao: false },
    notice: { email: true, sms: false, push: false, kakao: false },
  });
  const [dnd, setDnd] = useState(true);

  const toggle = (event: NotifyEvent, channel: NotifyChannel) => {
    setMatrix((prev) => ({
      ...prev,
      [event]: { ...prev[event], [channel]: !prev[event][channel] },
    }));
  };

  return (
    <div>
      <SectionHeader
        title="알림 설정"
        sub="채널별로 어떤 알림을 받을지 설정합니다"
      />
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left p-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                이벤트
              </th>
              {CHANNELS.map((ch) => (
                <th
                  key={ch}
                  className="text-center p-3 text-[10px] font-mono uppercase tracking-widest text-slate-500"
                >
                  {CHANNEL_LABELS[ch]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((ev) => (
              <tr key={ev} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-bold text-slate-800">
                  {EVENT_LABELS[ev]}
                </td>
                {CHANNELS.map((ch) => (
                  <td key={ch} className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[ev]?.[ch] ?? false}
                      onChange={() => toggle(ev, ch)}
                      className="rounded accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 mt-4 flex items-center justify-between">
        <div>
          <p className="font-extrabold text-sm">방해 금지 시간</p>
          <p className="text-xs text-slate-500 mt-0.5">22:00 – 08:00 동안 알림 보류</p>
        </div>
        <Toggle on={dnd} onClick={() => setDnd((v) => !v)} />
      </div>
    </div>
  );
}

// ─── 섹션: 연결 계정 ────────────────────────────────────────────
interface ConnectedAccount {
  id: string;
  label: string;
  sub: string;
  connected: boolean;
  bg: string;
  textColor: string;
  initial: string;
}

function ConnectedSection() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: "kakao",
      label: "카카오",
      sub: "jiwon@kakao",
      connected: true,
      bg: "bg-yellow-300",
      textColor: "text-slate-900",
      initial: "K",
    },
    {
      id: "naver",
      label: "네이버",
      sub: "연결 안 됨",
      connected: false,
      bg: "bg-emerald-500",
      textColor: "text-white",
      initial: "N",
    },
    {
      id: "google",
      label: "Google",
      sub: "jiwon@gmail.com",
      connected: true,
      bg: "bg-white border border-slate-200",
      textColor: "text-slate-700",
      initial: "G",
    },
    {
      id: "apple",
      label: "Apple",
      sub: "연결 안 됨",
      connected: false,
      bg: "bg-slate-900",
      textColor: "text-white",
      initial: "A",
    },
  ]);

  const toggle = (id: string) =>
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a))
    );

  return (
    <div>
      <SectionHeader
        title="연결 계정"
        sub="간편 로그인에 사용할 계정을 관리합니다"
      />
      <div className="space-y-2">
        {accounts.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-lg ${a.bg} grid place-items-center text-xs font-extrabold ${a.textColor} shrink-0`}
            >
              {a.initial}
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-sm">{a.label}</p>
              <p className="text-[11px] font-mono text-slate-500">{a.sub}</p>
            </div>
            <button
              onClick={() => toggle(a.id)}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors ${
                a.connected
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {a.connected ? "해제" : "연결"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 섹션: 결제 수단 ────────────────────────────────────────────
function PaySection() {
  return (
    <div>
      <SectionHeader title="결제 수단" />
      <div className="space-y-2 mb-4">
        {/* 카드 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-2xl p-5 max-w-sm">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-6">
            기본 카드
          </p>
          <p className="font-mono text-lg tracking-widest">•••• •••• •••• 4321</p>
          <div className="flex justify-between mt-3 text-xs">
            <span className="text-white/60">박지원</span>
            <span className="font-extrabold">VISA</span>
          </div>
        </div>
        {/* 카카오페이 */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 max-w-sm">
          <div className="w-10 h-7 rounded bg-yellow-300 shrink-0" />
          <span className="flex-1 text-sm font-bold">카카오페이</span>
          <button className="text-xs text-rose-500 font-bold hover:text-rose-700">
            제거
          </button>
        </div>
      </div>
      <button className="max-w-sm w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors">
        ＋ 결제 수단 추가
      </button>
    </div>
  );
}

// ─── 섹션: 개인정보 ─────────────────────────────────────────────
interface PrivacyItem {
  id: string;
  label: string;
  sub: string;
  on: boolean;
}

function PrivacySection() {
  const [items, setItems] = useState<PrivacyItem[]>([
    { id: "public", label: "프로필 공개", sub: "다른 사용자가 내 프로필 조회 가능", on: true },
    { id: "activity", label: "활동 내역 표시", sub: "참여 파티/리뷰 공개", on: true },
    { id: "search", label: "검색 노출", sub: "이름/닉네임 검색 허용", on: false },
    { id: "recommend", label: "맞춤 추천", sub: "내 활동 기반 추천", on: true },
  ]);

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, on: !item.on } : item))
    );

  return (
    <div>
      <SectionHeader title="개인정보" sub="수집·이용 내역과 데이터 관리" />
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="flex-1">
              <p className="font-extrabold text-sm">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
            </div>
            <Toggle on={item.on} onClick={() => toggle(item.id)} />
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-700">
        내 데이터 다운로드 →
      </button>
    </div>
  );
}

// ─── 섹션: 위험 영역 ────────────────────────────────────────────
function DangerSection() {
  return (
    <div>
      <SectionHeader title="위험 영역" sub="이 작업들은 되돌릴 수 없습니다" />
      <div className="space-y-3">
        <div className="bg-white border-2 border-rose-200 rounded-xl p-5">
          <p className="font-extrabold text-rose-700">계정 일시정지</p>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            로그인 차단 + 알림 중지. 언제든 복구 가능.
          </p>
          <button className="px-4 py-2 bg-white border border-rose-300 text-rose-700 text-xs font-extrabold rounded-lg hover:bg-rose-50 transition-colors">
            일시정지
          </button>
        </div>
        <div className="bg-white border-2 border-rose-300 rounded-xl p-5">
          <p className="font-extrabold text-rose-700">계정 삭제</p>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            모든 데이터 영구 삭제. 진행 중 예약은 자동 취소되며 복구 불가.
          </p>
          <button className="px-4 py-2 bg-rose-600 text-white text-xs font-extrabold rounded-lg hover:bg-rose-700 transition-colors">
            계정 삭제 진행
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeNav = NAV_ITEMS.find((n) => n.id === activeSection);

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "account":
        return <AccountSection />;
      case "notify":
        return <NotifySection />;
      case "connected":
        return <ConnectedSection />;
      case "pay":
        return <PaySection />;
      case "privacy":
        return <PrivacySection />;
      case "danger":
        return <DangerSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              jeju<span className="text-orange-500">.party</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">설정</p>
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
        {/* 모바일 아코디언 네비 */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm font-bold"
          >
            <span>
              {activeNav?.icon} {activeNav?.label}
            </span>
            <span className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {mobileOpen && (
            <nav className="mt-1 bg-white border border-slate-200 rounded-xl overflow-hidden">
              {NAV_ITEMS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setActiveSection(n.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left border-b border-slate-100 last:border-0 transition-colors ${
                    activeSection === n.id
                      ? "bg-orange-50 text-orange-700 font-extrabold"
                      : n.danger
                      ? "text-rose-500 hover:bg-rose-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{n.icon}</span>
                  {n.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[700px] grid grid-cols-1 lg:grid-cols-[260px_1fr]">
          {/* ── 왼쪽 사이드 네비 (데스크톱) ──────────────── */}
          <aside className="hidden lg:block bg-white border-r border-slate-200 p-4">
            {/* 프로필 미니 */}
            <div className="flex items-center gap-3 p-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-orange-400 grid place-items-center text-white font-extrabold shrink-0">
                박
              </div>
              <div className="min-w-0">
                <p className="font-extrabold truncate">박지원</p>
                <p className="text-[10px] font-mono text-slate-500 truncate">
                  jiwon@example.com
                </p>
              </div>
            </div>
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((n) => {
                const on = activeSection === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setActiveSection(n.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      on
                        ? "bg-orange-50 text-orange-700 font-extrabold"
                        : n.danger
                        ? "text-rose-500 hover:bg-rose-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{n.icon}</span>
                    {n.label}
                    {on && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── 우측 컨텐츠 ───────────────────────────── */}
          <div className="p-6 md:p-10 max-w-2xl">{renderSection()}</div>
        </div>
      </main>
    </div>
  );
}
