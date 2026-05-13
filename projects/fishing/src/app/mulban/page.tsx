"use client";
import { useState } from "react";
import Link from "next/link";

/* ─── 타입 ─── */
interface Package {
  id: string;
  name: string;
  fish: string;
  minCount: number;
  unit: string;
  refundType: "50%" | "재체험권";
  guideInitial: string;
  guideExp: number;
  hours: number;
  region: string;
  price: number;
  tag: string;
  emoji: string;
}

interface Guide {
  id: string;
  initial: string;
  exp: number;
  fish: string;
  successRate: number;
  reviewCount: number;
}

interface Review {
  id: string;
  text: string;
  stars: number;
  nick: string;
  date: string;
  pkg: string;
}

/* ─── 더미 데이터 ─── */
const PACKAGES: Package[] = [
  {
    id: "p1",
    name: "갈치 3마리 보장",
    fish: "갈치",
    minCount: 3,
    unit: "마리",
    refundType: "50%",
    guideInitial: "김",
    guideExp: 12,
    hours: 3,
    region: "서귀포시",
    price: 89000,
    tag: "BEST",
    emoji: "🐟",
  },
  {
    id: "p2",
    name: "감성돔 1마리 보장",
    fish: "감성돔",
    minCount: 1,
    unit: "마리",
    refundType: "재체험권",
    guideInitial: "박",
    guideExp: 8,
    hours: 4,
    region: "성산읍",
    price: 119000,
    tag: "인기",
    emoji: "🎣",
  },
  {
    id: "p3",
    name: "광어 2마리 보장",
    fish: "광어",
    minCount: 2,
    unit: "마리",
    refundType: "50%",
    guideInitial: "이",
    guideExp: 15,
    hours: 5,
    region: "한림읍",
    price: 145000,
    tag: "프리미엄",
    emoji: "🐠",
  },
  {
    id: "p4",
    name: "볼락 5마리 보장",
    fish: "볼락",
    minCount: 5,
    unit: "마리",
    refundType: "재체험권",
    guideInitial: "최",
    guideExp: 6,
    hours: 2,
    region: "애월읍",
    price: 59000,
    tag: "입문",
    emoji: "🐡",
  },
  {
    id: "p5",
    name: "참돔 1마리 보장",
    fish: "참돔",
    minCount: 1,
    unit: "마리",
    refundType: "50%",
    guideInitial: "정",
    guideExp: 10,
    hours: 4,
    region: "구좌읍",
    price: 135000,
    tag: "도전",
    emoji: "🐟",
  },
  {
    id: "p6",
    name: "방어 1마리 보장",
    fish: "방어",
    minCount: 1,
    unit: "마리",
    refundType: "재체험권",
    guideInitial: "김",
    guideExp: 18,
    hours: 6,
    region: "대정읍",
    price: 189000,
    tag: "시즌한정",
    emoji: "🐋",
  },
];

const GUIDES: Guide[] = [
  { id: "g1", initial: "김", exp: 12, fish: "갈치·방어", successRate: 96, reviewCount: 342 },
  { id: "g2", initial: "박", exp: 8,  fish: "감성돔·참돔", successRate: 93, reviewCount: 214 },
  { id: "g3", initial: "이", exp: 15, fish: "광어·농어", successRate: 97, reviewCount: 521 },
  { id: "g4", initial: "최", exp: 6,  fish: "볼락·벵에돔", successRate: 91, reviewCount: 138 },
];

const REVIEWS: Review[] = [
  { id: "r1", text: "처음 낚시인데 갈치 5마리 잡았어요! 가이드 선생님이 채비부터 하나하나 다 가르쳐 주셔서 너무 즐거웠어요.", stars: 5, nick: "바다초보자", date: "2026.05.02", pkg: "갈치 3마리 보장" },
  { id: "r2", text: "아이랑 같이 광어 낚시 최고였어요. 아이가 직접 잡아서 너무 신나했어요. 재방문 확정!", stars: 5, nick: "제주여행맘", date: "2026.04.28", pkg: "광어 2마리 보장" },
  { id: "r3", text: "처음에 반신반의했는데 진짜로 감성돔 2마리 잡았어요. 보장이 있으니까 마음편하게 즐겼습니다.", stars: 5, nick: "낚알못탈출", date: "2026.04.19", pkg: "감성돔 1마리 보장" },
  { id: "r4", text: "날씨가 조금 흐렸는데도 볼락 8마리나 잡았어요. 가이드님 덕분에 입질 포인트 바로 찾았습니다.", stars: 4, nick: "주말낚시인", date: "2026.04.11", pkg: "볼락 5마리 보장" },
];

/* ─── 별점 ─── */
function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

/* ─── 메인 ─── */
export default function MulbanPage() {
  const [showBooking, setShowBooking] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  /* 예약폼 state */
  const [bDate, setBDate] = useState("");
  const [bPeople, setBPeople] = useState(1);
  const [bName, setBName] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bGear, setBGear] = useState<"yes" | "no">("yes");

  const selectedPkg = PACKAGES.find((p) => p.id === showBooking);
  const gearExtra = bGear === "no" ? 10000 : 0;
  const totalPrice = selectedPkg
    ? selectedPkg.price * bPeople + gearExtra
    : 0;

  function handleConfirm() {
    if (!bDate || !bName || !bPhone) return;
    const num = "MB-" + Math.floor(100000 + Math.random() * 900000);
    setShowConfirm(num);
  }

  function resetBooking() {
    setShowBooking(null);
    setShowConfirm(null);
    setBDate("");
    setBPeople(1);
    setBName("");
    setBPhone("");
    setBGear("yes");
  }

  return (
    <>
      <style>{`
        .mb-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 100px;
        }

        /* ── 히어로 ── */
        .mb-hero {
          position: relative;
          padding: 32px 20px 56px;
          background:
            radial-gradient(120% 80% at 50% 0%, rgba(46,160,67,0.18), transparent 60%),
            linear-gradient(180deg, #081a0e 0%, #0d2a16 60%, #132e1a 100%);
          overflow: hidden;
          isolation: isolate;
          margin-bottom: 0;
        }
        .mb-hero-glow {
          position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(46,160,67,0.18) 0%, transparent 65%);
          filter: blur(12px); pointer-events: none;
        }
        .mb-hero-content {
          position: relative; z-index: 2;
          max-width: 960px; margin: 0 auto; padding: 0 20px;
          text-align: center;
        }
        .mb-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(46,160,67,0.18); border: 1px solid rgba(46,160,67,0.35);
          color: #6ee7a0; font-size: 12px; font-weight: 700; letter-spacing: -0.2px;
          padding: 5px 12px; border-radius: 999px; margin-bottom: 14px;
        }
        .mb-hero-title {
          font-size: 32px; font-weight: 900; line-height: 1.2;
          letter-spacing: -1px; color: #ffffff; margin: 0 0 10px;
        }
        .mb-hero-title .accent {
          background: linear-gradient(120deg, #4ade80, #22c55e);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .mb-hero-sub {
          font-size: 15px; color: rgba(255,255,255,0.65); margin: 0 0 28px;
          letter-spacing: -0.3px;
        }
        .mb-hero-stats {
          display: flex; justify-content: center; gap: 0;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--r-card); overflow: hidden;
          max-width: 560px; margin: 0 auto;
        }
        .mb-stat {
          flex: 1; padding: 14px 10px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .mb-stat:last-child { border-right: none; }
        .mb-stat-val {
          font-size: 22px; font-weight: 900; color: #4ade80;
          letter-spacing: -0.5px; line-height: 1;
        }
        .mb-stat-label {
          font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 4px;
          letter-spacing: -0.2px;
        }
        .mb-wave {
          position: absolute; bottom: 0; left: 0; right: 0; height: 40px;
          fill: var(--ocean-950);
        }

        /* ── 섹션 헤더 ── */
        .mb-section {
          padding-top: 40px;
        }
        .mb-section-title {
          font-size: 20px; font-weight: 800; letter-spacing: -0.6px;
          color: var(--text-strong); margin: 0 0 4px;
        }
        .mb-section-sub {
          font-size: 13px; color: var(--text-dim); margin: 0 0 20px;
        }

        /* ── 패키지 그리드 ── */
        .mb-pkg-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 600px) {
          .mb-pkg-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .mb-pkg-grid { grid-template-columns: 1fr 1fr 1fr; }
        }

        .mb-pkg-card {
          background: var(--tint-04);
          border: 1px solid var(--line);
          border-radius: var(--r-card);
          padding: 18px 18px 16px;
          display: flex; flex-direction: column; gap: 0;
          transition: border-color 0.15s, box-shadow 0.15s;
          cursor: default;
        }
        .mb-pkg-card:hover {
          border-color: rgba(34,197,94,0.35);
          box-shadow: 0 4px 20px rgba(34,197,94,0.08);
        }
        .mb-pkg-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 10px;
        }
        .mb-pkg-tag {
          font-size: 10px; font-weight: 800; letter-spacing: 0.3px;
          padding: 3px 8px; border-radius: 999px;
          background: rgba(34,197,94,0.12); color: #16a34a;
          border: 1px solid rgba(34,197,94,0.25);
        }
        [data-theme="deep"] .mb-pkg-tag {
          background: rgba(74,222,128,0.12); color: #4ade80;
          border-color: rgba(74,222,128,0.25);
        }
        .mb-pkg-emoji { font-size: 26px; line-height: 1; }
        .mb-pkg-name {
          font-size: 16px; font-weight: 800; letter-spacing: -0.4px;
          color: var(--text-strong); margin: 0 0 6px;
        }
        .mb-pkg-guarantee {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #16a34a; font-weight: 700;
          margin-bottom: 6px;
        }
        [data-theme="deep"] .mb-pkg-guarantee { color: #4ade80; }
        .mb-pkg-refund {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600; color: var(--hook);
          background: rgba(233,78,59,0.08); border: 1px solid rgba(233,78,59,0.2);
          border-radius: var(--r-sm); padding: 3px 8px; margin-bottom: 12px;
        }
        .mb-pkg-divider {
          border: none; border-top: 1px solid var(--line); margin: 0 0 12px;
        }
        .mb-pkg-guide {
          display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
        }
        .mb-guide-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #1e3a5f, #2c6ea0);
          color: #fff; font-size: 13px; font-weight: 800;
          display: grid; place-items: center; flex-shrink: 0;
        }
        .mb-guide-info { flex: 1; min-width: 0; }
        .mb-guide-name {
          font-size: 13px; font-weight: 700; color: var(--text-strong);
          letter-spacing: -0.3px;
        }
        .mb-guide-exp {
          font-size: 11px; color: var(--text-dim);
        }
        .mb-pkg-meta {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;
        }
        .mb-meta-chip {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: var(--text-dim);
          background: var(--tint-04); border: 1px solid var(--line);
          border-radius: 999px; padding: 3px 9px;
        }
        .mb-pkg-price {
          font-size: 20px; font-weight: 900; color: var(--text-strong);
          letter-spacing: -0.5px; margin-bottom: 12px;
        }
        .mb-pkg-price span {
          font-size: 12px; font-weight: 500; color: var(--text-dim); margin-left: 2px;
        }
        .mb-pkg-btn {
          width: 100%; padding: 11px 0;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border: none; border-radius: var(--r-sm);
          color: #fff; font-size: 14px; font-weight: 800;
          letter-spacing: -0.3px; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .mb-pkg-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .mb-pkg-btn:active { transform: translateY(0); }

        /* ── 예약폼 오버레이 ── */
        .mb-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          display: flex; align-items: flex-end;
          padding: 0;
        }
        @media (min-width: 600px) {
          .mb-overlay { align-items: center; justify-content: center; padding: 20px; }
        }
        .mb-sheet {
          width: 100%; max-width: 560px;
          background: var(--ocean-950);
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          padding: 24px 20px 40px;
          max-height: 90vh;
          overflow-y: auto;
        }
        @media (min-width: 600px) {
          .mb-sheet {
            border-radius: var(--r-card);
            padding: 28px 28px 32px;
          }
        }
        .mb-sheet-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px;
        }
        .mb-sheet-title {
          font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
          color: var(--text-strong);
        }
        .mb-close-btn {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--tint-08); border: none;
          color: var(--text-dim); font-size: 18px;
          display: grid; place-items: center; cursor: pointer;
        }
        .mb-selected-summary {
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
          border-radius: var(--r-sm); padding: 12px 14px; margin-bottom: 20px;
        }
        [data-theme="deep"] .mb-selected-summary {
          background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.2);
        }
        .mb-summary-name {
          font-size: 15px; font-weight: 800; color: var(--text-strong); margin-bottom: 4px;
        }
        .mb-summary-detail {
          font-size: 12px; color: var(--text-dim); letter-spacing: -0.2px;
        }
        .mb-form-group {
          margin-bottom: 14px;
        }
        .mb-form-label {
          display: block; font-size: 13px; font-weight: 700;
          color: var(--text); margin-bottom: 6px; letter-spacing: -0.2px;
        }
        .mb-form-input, .mb-form-select {
          width: 100%; padding: 10px 14px;
          background: var(--tint-04); border: 1px solid var(--line-2);
          border-radius: var(--r-sm); color: var(--text-strong);
          font-size: 14px; font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.15s;
          appearance: none; -webkit-appearance: none;
        }
        .mb-form-input:focus, .mb-form-select:focus {
          outline: none; border-color: #22c55e;
        }
        .mb-gear-row {
          display: flex; gap: 10px;
        }
        .mb-gear-label {
          flex: 1; display: flex; align-items: center; gap: 8px;
          background: var(--tint-04); border: 1px solid var(--line-2);
          border-radius: var(--r-sm); padding: 10px 14px;
          cursor: pointer; font-size: 14px; color: var(--text);
          transition: border-color 0.15s, background 0.15s;
        }
        .mb-gear-label.selected {
          border-color: #22c55e;
          background: rgba(34,197,94,0.08);
          color: var(--text-strong); font-weight: 700;
        }
        [data-theme="deep"] .mb-gear-label.selected {
          border-color: #4ade80; background: rgba(74,222,128,0.08);
        }
        .mb-gear-label input { display: none; }
        .mb-gear-hint {
          font-size: 11px; color: var(--hook); margin-top: 5px; font-weight: 600;
        }
        .mb-total-row {
          display: flex; justify-content: space-between; align-items: center;
          background: var(--tint-04); border: 1px solid var(--line);
          border-radius: var(--r-sm); padding: 14px 16px;
          margin: 18px 0 16px;
        }
        .mb-total-label {
          font-size: 14px; font-weight: 700; color: var(--text-dim);
        }
        .mb-total-price {
          font-size: 22px; font-weight: 900; color: var(--text-strong); letter-spacing: -0.5px;
        }
        .mb-confirm-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border: none; border-radius: var(--r-sm);
          color: #fff; font-size: 16px; font-weight: 800;
          cursor: pointer; letter-spacing: -0.3px;
          transition: opacity 0.15s;
        }
        .mb-confirm-btn:disabled { opacity: 0.5; cursor: default; }
        .mb-confirm-btn:not(:disabled):hover { opacity: 0.9; }

        /* ── 확정 모달 ── */
        .mb-confirm-box {
          text-align: center; padding: 8px 0;
        }
        .mb-confirm-icon {
          font-size: 52px; margin-bottom: 14px; display: block;
        }
        .mb-confirm-title {
          font-size: 22px; font-weight: 900; color: var(--text-strong);
          letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .mb-confirm-num {
          display: inline-block;
          font-size: 20px; font-weight: 900; color: #16a34a;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
          border-radius: var(--r-sm); padding: 6px 18px; margin: 10px 0 14px;
          letter-spacing: 1px;
        }
        [data-theme="deep"] .mb-confirm-num { color: #4ade80; }
        .mb-confirm-desc {
          font-size: 13px; color: var(--text-dim); line-height: 1.6; margin-bottom: 22px;
        }
        .mb-confirm-close {
          width: 100%; padding: 13px;
          background: var(--tint-08); border: 1px solid var(--line);
          border-radius: var(--r-sm); color: var(--text);
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: inherit; letter-spacing: -0.3px;
        }

        /* ── 보장 조건 섹션 ── */
        .mb-guarantee-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 600px) {
          .mb-guarantee-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .mb-guarantee-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
        }
        .mb-guarantee-card {
          background: var(--tint-04); border: 1px solid var(--line);
          border-radius: var(--r-card); padding: 18px 16px;
          text-align: center;
        }
        .mb-guarantee-icon { font-size: 28px; margin-bottom: 10px; display: block; }
        .mb-guarantee-ttl {
          font-size: 13px; font-weight: 800; color: var(--text-strong);
          margin-bottom: 5px; letter-spacing: -0.3px;
        }
        .mb-guarantee-desc {
          font-size: 11px; color: var(--text-dim); line-height: 1.55; letter-spacing: -0.2px;
        }

        /* ── 가이드 그리드 ── */
        .mb-guide-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .mb-guide-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
        }
        .mb-guide-card {
          background: var(--tint-04); border: 1px solid var(--line);
          border-radius: var(--r-card); padding: 20px 16px;
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0;
        }
        .mb-guide-card-avatar {
          width: 54px; height: 54px; border-radius: 50%;
          background: linear-gradient(135deg, #1e3a5f, #2c6ea0);
          color: #fff; font-size: 22px; font-weight: 900;
          display: grid; place-items: center; margin-bottom: 10px;
        }
        .mb-guide-card-name {
          font-size: 15px; font-weight: 800; color: var(--text-strong);
          margin-bottom: 2px; letter-spacing: -0.3px;
        }
        .mb-guide-card-exp {
          font-size: 11px; color: var(--text-dim); margin-bottom: 8px;
        }
        .mb-guide-card-fish {
          font-size: 12px; color: #16a34a; font-weight: 700;
          background: rgba(34,197,94,0.1); border-radius: 999px;
          padding: 2px 10px; margin-bottom: 10px;
        }
        [data-theme="deep"] .mb-guide-card-fish { color: #4ade80; background: rgba(74,222,128,0.1); }
        .mb-guide-card-stats {
          display: flex; gap: 10px; margin-bottom: 14px;
        }
        .mb-guide-mini-stat { text-align: center; }
        .mb-guide-mini-val {
          font-size: 15px; font-weight: 900; color: var(--text-strong); letter-spacing: -0.3px;
        }
        .mb-guide-mini-label {
          font-size: 10px; color: var(--text-mute);
        }
        .mb-guide-book-btn {
          width: 100%; padding: 8px;
          background: linear-gradient(135deg, #1e3a5f, #2c6ea0);
          border: none; border-radius: var(--r-sm);
          color: #fff; font-size: 12px; font-weight: 800;
          cursor: pointer; letter-spacing: -0.2px;
          transition: opacity 0.15s;
        }
        .mb-guide-book-btn:hover { opacity: 0.85; }

        /* ── 후기 ── */
        .mb-review-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 600px) {
          .mb-review-grid { grid-template-columns: 1fr 1fr; }
        }
        .mb-review-card {
          background: var(--tint-04); border: 1px solid var(--line);
          border-radius: var(--r-card); padding: 18px 16px;
        }
        .mb-review-top {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
        }
        .mb-review-nick {
          font-size: 13px; font-weight: 800; color: var(--text-strong); letter-spacing: -0.3px;
        }
        .mb-review-date {
          font-size: 11px; color: var(--text-mute);
        }
        .mb-review-pkg {
          font-size: 11px; color: #16a34a; font-weight: 600; margin-bottom: 8px;
        }
        [data-theme="deep"] .mb-review-pkg { color: #4ade80; }
        .mb-review-text {
          font-size: 13px; color: var(--text); line-height: 1.65; letter-spacing: -0.2px;
        }
      `}</style>

      {/* ── 히어로 ── */}
      <section className="mb-hero fl-hero">
        <div className="mb-hero-glow" />
        <div className="mb-hero-content">
          <div className="mb-hero-badge">
            🐟 어획 보장 가이드 동반 체험
          </div>
          <h1 className="mb-hero-title">
            물반고기반<br />
            <span className="accent">안 잡히면 반환불</span>
          </h1>
          <p className="mb-hero-sub">못 잡으면 환불 — 낚시 입문자도 안심 체험</p>
          <div className="mb-hero-stats">
            <div className="mb-stat">
              <div className="mb-stat-val">94%</div>
              <div className="mb-stat-label">보장 성공률</div>
            </div>
            <div className="mb-stat">
              <div className="mb-stat-val">1,240회</div>
              <div className="mb-stat-label">누적 체험</div>
            </div>
            <div className="mb-stat">
              <div className="mb-stat-val">4.8★</div>
              <div className="mb-stat-label">평균 평점</div>
            </div>
          </div>
        </div>
        <svg className="mb-wave" viewBox="0 0 400 40" preserveAspectRatio="none">
          <path d="M0,28 C70,18 140,38 210,28 C280,16 340,34 400,24 L400,40 L0,40 Z" />
        </svg>
      </section>

      <div className="mb-wrap">

        {/* ── 패키지 리스트 ── */}
        <section className="mb-section">
          <h2 className="mb-section-title">보장 체험 패키지</h2>
          <p className="mb-section-sub">어종·수량 보장 — 미달 시 50% 환불 또는 재체험권 지급</p>
          <div className="mb-pkg-grid">
            {PACKAGES.map((pkg) => (
              <article key={pkg.id} className="mb-pkg-card">
                <div className="mb-pkg-top">
                  <span className="mb-pkg-tag">{pkg.tag}</span>
                  <span className="mb-pkg-emoji">{pkg.emoji}</span>
                </div>
                <h3 className="mb-pkg-name">{pkg.name}</h3>
                <div className="mb-pkg-guarantee">
                  <span>✓</span>
                  <span>{pkg.fish} 최소 {pkg.minCount}{pkg.unit} 보장</span>
                </div>
                <div className="mb-pkg-refund">
                  미달 시 {pkg.refundType === "50%" ? "50% 환불" : "재체험권 지급"}
                </div>
                <hr className="mb-pkg-divider" />
                <div className="mb-pkg-guide">
                  <div className="mb-guide-avatar">{pkg.guideInitial}</div>
                  <div className="mb-guide-info">
                    <div className="mb-guide-name">{pkg.guideInitial} 가이드</div>
                    <div className="mb-guide-exp">경력 {pkg.guideExp}년</div>
                  </div>
                </div>
                <div className="mb-pkg-meta">
                  <span className="mb-meta-chip">⏱ {pkg.hours}시간</span>
                  <span className="mb-meta-chip">📍 {pkg.region}</span>
                  <span className="mb-meta-chip">🎣 채비·미끼 포함</span>
                </div>
                <div className="mb-pkg-price">
                  {pkg.price.toLocaleString()}원<span>/1인</span>
                </div>
                <button
                  className="mb-pkg-btn"
                  onClick={() => setShowBooking(pkg.id)}
                  type="button"
                >
                  예약하기
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* ── 보장 조건 안내 ── */}
        <section className="mb-section">
          <h2 className="mb-section-title">보장 조건 안내</h2>
          <p className="mb-section-sub">투명한 환불 정책으로 실패 걱정 없이 즐기세요</p>
          <div className="mb-guarantee-grid">
            <div className="mb-guarantee-card">
              <span className="mb-guarantee-icon">⛈️</span>
              <div className="mb-guarantee-ttl">기상 악화 전액 환불</div>
              <div className="mb-guarantee-desc">태풍·풍랑 등 기상 악화로 출항 불가 시 100% 전액 환불</div>
            </div>
            <div className="mb-guarantee-card">
              <span className="mb-guarantee-icon">🐟</span>
              <div className="mb-guarantee-ttl">입질 없으면 50% 환불</div>
              <div className="mb-guarantee-desc">보장 어획량 미달 시 50% 환불 또는 재체험권 중 선택 가능</div>
            </div>
            <div className="mb-guarantee-card">
              <span className="mb-guarantee-icon">👨‍✈️</span>
              <div className="mb-guarantee-ttl">가이드 동반 필수</div>
              <div className="mb-guarantee-desc">경력 6년 이상 전문 가이드가 처음부터 끝까지 동행합니다</div>
            </div>
            <div className="mb-guarantee-card">
              <span className="mb-guarantee-icon">🎣</span>
              <div className="mb-guarantee-ttl">채비·미끼 포함</div>
              <div className="mb-guarantee-desc">낚싯대·채비·미끼 모두 포함. 빈손으로 오셔도 OK</div>
            </div>
          </div>
        </section>

        {/* ── 가이드 프로필 ── */}
        <section className="mb-section">
          <h2 className="mb-section-title">가이드 소개</h2>
          <p className="mb-section-sub">보장 성공률 90% 이상 검증된 전문 가이드</p>
          <div className="mb-guide-grid">
            {GUIDES.map((g) => (
              <div key={g.id} className="mb-guide-card">
                <div className="mb-guide-card-avatar">{g.initial}</div>
                <div className="mb-guide-card-name">{g.initial} 가이드</div>
                <div className="mb-guide-card-exp">경력 {g.exp}년</div>
                <div className="mb-guide-card-fish">{g.fish}</div>
                <div className="mb-guide-card-stats">
                  <div className="mb-guide-mini-stat">
                    <div className="mb-guide-mini-val">{g.successRate}%</div>
                    <div className="mb-guide-mini-label">성공률</div>
                  </div>
                  <div className="mb-guide-mini-stat">
                    <div className="mb-guide-mini-val">{g.reviewCount}</div>
                    <div className="mb-guide-mini-label">후기</div>
                  </div>
                </div>
                <button
                  className="mb-guide-book-btn"
                  type="button"
                  onClick={() => setShowBooking(PACKAGES.find(p => p.guideInitial === g.initial)?.id ?? PACKAGES[0].id)}
                >
                  이 가이드로 예약
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── 실제 후기 ── */}
        <section className="mb-section">
          <h2 className="mb-section-title">실제 후기</h2>
          <p className="mb-section-sub">다녀온 분들의 생생한 이야기</p>
          <div className="mb-review-grid">
            {REVIEWS.map((r) => (
              <div key={r.id} className="mb-review-card">
                <div className="mb-review-top">
                  <span className="mb-review-nick">{r.nick}</span>
                  <span className="mb-review-date">{r.date}</span>
                </div>
                <div className="mb-review-pkg">{r.pkg}</div>
                <Stars n={r.stars} />
                <p className="mb-review-text" style={{ marginTop: 8, marginBottom: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── 예약 폼 오버레이 ── */}
      {showBooking && selectedPkg && (
        <div className="mb-overlay" role="dialog" aria-modal="true" aria-label="예약하기">
          <div className="mb-sheet">
            {showConfirm ? (
              /* 예약 확정 화면 */
              <div className="mb-confirm-box">
                <span className="mb-confirm-icon">🎉</span>
                <div className="mb-confirm-title">예약이 완료되었어요!</div>
                <div className="mb-confirm-num">{showConfirm}</div>
                <p className="mb-confirm-desc">
                  {selectedPkg.name} 예약이 접수됐습니다.<br />
                  입력하신 연락처로 확인 문자가 발송됩니다.<br />
                  <strong>당일 10분 전까지 집합 장소로 와주세요.</strong>
                </p>
                <button
                  className="mb-confirm-close"
                  type="button"
                  onClick={resetBooking}
                >
                  닫기
                </button>
              </div>
            ) : (
              /* 예약 폼 */
              <>
                <div className="mb-sheet-head">
                  <span className="mb-sheet-title">예약하기</span>
                  <button
                    className="mb-close-btn"
                    type="button"
                    aria-label="닫기"
                    onClick={resetBooking}
                  >
                    ×
                  </button>
                </div>

                {/* 선택 패키지 요약 */}
                <div className="mb-selected-summary">
                  <div className="mb-summary-name">{selectedPkg.emoji} {selectedPkg.name}</div>
                  <div className="mb-summary-detail">
                    {selectedPkg.region} · {selectedPkg.hours}시간 · {selectedPkg.guideInitial} 가이드(경력 {selectedPkg.guideExp}년) ·{" "}
                    미달 시 {selectedPkg.refundType === "50%" ? "50% 환불" : "재체험권"}
                  </div>
                </div>

                <div className="mb-form-group">
                  <label className="mb-form-label" htmlFor="mb-date">체험 날짜</label>
                  <input
                    id="mb-date"
                    type="date"
                    className="mb-form-input"
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                  />
                </div>

                <div className="mb-form-group">
                  <label className="mb-form-label" htmlFor="mb-people">인원</label>
                  <select
                    id="mb-people"
                    className="mb-form-select"
                    value={bPeople}
                    onChange={(e) => setBPeople(Number(e.target.value))}
                  >
                    {[1,2,3,4,5,6].map((n) => (
                      <option key={n} value={n}>{n}명</option>
                    ))}
                  </select>
                </div>

                <div className="mb-form-group">
                  <label className="mb-form-label" htmlFor="mb-name">이름</label>
                  <input
                    id="mb-name"
                    type="text"
                    className="mb-form-input"
                    placeholder="홍길동"
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                  />
                </div>

                <div className="mb-form-group">
                  <label className="mb-form-label" htmlFor="mb-phone">연락처</label>
                  <input
                    id="mb-phone"
                    type="tel"
                    className="mb-form-input"
                    placeholder="010-0000-0000"
                    value={bPhone}
                    onChange={(e) => setBPhone(e.target.value)}
                  />
                </div>

                <div className="mb-form-group">
                  <label className="mb-form-label">낚시 장비</label>
                  <div className="mb-gear-row">
                    <label className={`mb-gear-label${bGear === "yes" ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="gear"
                        value="yes"
                        checked={bGear === "yes"}
                        onChange={() => setBGear("yes")}
                      />
                      ✔ 있음
                    </label>
                    <label className={`mb-gear-label${bGear === "no" ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="gear"
                        value="no"
                        checked={bGear === "no"}
                        onChange={() => setBGear("no")}
                      />
                      없음
                    </label>
                  </div>
                  {bGear === "no" && (
                    <p className="mb-gear-hint">장비 대여 +10,000원이 추가됩니다.</p>
                  )}
                </div>

                <div className="mb-total-row">
                  <span className="mb-total-label">총 금액</span>
                  <span className="mb-total-price">{totalPrice.toLocaleString()}원</span>
                </div>

                <button
                  className="mb-confirm-btn"
                  type="button"
                  disabled={!bDate || !bName || !bPhone}
                  onClick={handleConfirm}
                >
                  예약 확정
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
