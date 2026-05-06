"use client";

import { useState } from "react";

// ── 더미 데이터 ─────────────────────────────────────────────────────────────

const AVAILABLE_BALANCE = 1_842_500;
const PENDING_BALANCE = 320_000;
const MONTHLY_REVENUE = 2_162_500;

const DUMMY_ACCOUNT = {
  bank: "국민은행",
  bankCode: "KB",
  bankColor: "bg-yellow-400",
  number: "123-45-678901-23",
  holder: "김민준",
};

const WITHDRAW_HISTORY = [
  { date: "4/29", amount: 2_100_000, status: "완료" },
  { date: "4/15", amount: 1_650_000, status: "완료" },
  { date: "4/01", amount: 980_000,   status: "완료" },
  { date: "3/18", amount: 1_420_000, status: "완료" },
  { date: "3/04", amount: 870_000,   status: "완료" },
] as const;

const QUICK_AMOUNTS = [300_000, 500_000, 1_000_000, AVAILABLE_BALANCE] as const;

// ── 수수료 계산 ──────────────────────────────────────────────────────────────

const FEE_RATE = 0.033; // 원천징수 3.3%

function calcNet(amount: number) {
  const tax = Math.round(amount * FEE_RATE);
  return { tax, net: amount - tax };
}

// ── 확인 모달 ─────────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  amount: number;
  net: number;
  tax: number;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmModal({ amount, net, tax, onConfirm, onClose }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-1">출금 신청 확인</h3>
        <p className="text-sm text-slate-500 mb-5">아래 내용을 확인하고 신청해 주세요.</p>

        <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">출금 신청 금액</span>
            <span className="font-extrabold font-mono tabular-nums">₩{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">원천징수 (3.3%)</span>
            <span className="text-rose-500 font-bold font-mono tabular-nums">−₩{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">이체 수수료</span>
            <span className="text-slate-400 font-mono">무료</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
            <span className="font-extrabold text-slate-900">실수령액</span>
            <span className="text-xl font-black text-blue-600 tabular-nums font-mono">₩{net.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-extrabold hover:bg-blue-700 transition-colors"
          >
            신청 확정
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 출금 완료 토스트 ─────────────────────────────────────────────────────────

function SuccessToast({ net, onClose }: { net: number; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3">
      <span className="text-lg">✓</span>
      <div>
        <p className="font-extrabold text-sm">출금 신청 완료</p>
        <p className="text-[11px] text-emerald-100 font-mono">₩{net.toLocaleString()} · 영업일 기준 D+2 입금 예정</p>
      </div>
      <button onClick={onClose} className="ml-2 text-emerald-200 hover:text-white text-lg leading-none">×</button>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

export default function WithdrawPage() {
  const [amount, setAmount] = useState(1_200_000);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastNet, setLastNet] = useState(0);

  const { tax, net } = calcNet(amount);

  const handleAmountInput = (raw: string) => {
    const n = parseInt(raw.replace(/[^0-9]/g, "")) || 0;
    setAmount(Math.min(AVAILABLE_BALANCE, Math.max(0, n)));
  };

  const handleConfirm = () => {
    setLastNet(net);
    setShowModal(false);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-slate-900">정산 출금 신청</h1>
          <p className="text-sm text-slate-500 mt-0.5">출금 가능 잔액을 확인하고 원하는 금액을 출금하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* ── 좌측 메인 ── */}
          <div className="space-y-5">
            {/* 잔액 히어로 카드 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-2">출금 가능 금액</p>
              <p className="text-5xl font-black tabular-nums tracking-tight">
                ₩{AVAILABLE_BALANCE.toLocaleString()}
              </p>
              <div className="mt-4 pt-4 border-t border-white/20 flex gap-6 text-sm">
                <div>
                  <p className="text-white/60 text-xs">대기중 정산</p>
                  <p className="font-extrabold font-mono">₩{PENDING_BALANCE.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">이번 달 총매출</p>
                  <p className="font-extrabold font-mono">₩{MONTHLY_REVENUE.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 출금 금액 입력 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4">출금 금액</h3>

              {/* 빠른 선택 버튼 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_AMOUNTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                      amount === v
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {v === AVAILABLE_BALANCE ? "전액" : `₩${(v / 10000).toFixed(0)}만`}
                  </button>
                ))}
              </div>

              {/* 직접 입력 */}
              <input
                type="text"
                inputMode="numeric"
                value={`₩ ${amount.toLocaleString()}`}
                onChange={(e) => handleAmountInput(e.target.value)}
                className="w-full text-3xl font-black font-mono text-right px-4 py-4 border-2 border-slate-200 rounded-xl tabular-nums focus:border-blue-600 outline-none transition-colors"
              />

              {/* 슬라이더 */}
              <input
                type="range"
                min={0}
                max={AVAILABLE_BALANCE}
                step={10_000}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full mt-3 accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>₩0</span>
                <span>₩{AVAILABLE_BALANCE.toLocaleString()}</span>
              </div>
            </div>

            {/* 실수령액 계산 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4">실수령액 계산</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">출금 신청 금액</span>
                  <span className="font-bold font-mono tabular-nums text-slate-900">
                    ₩{amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">원천징수 (3.3%)</span>
                  <span className="font-bold font-mono tabular-nums text-rose-500">
                    −₩{tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">이체 수수료</span>
                  <span className="font-bold font-mono text-slate-400">무료</span>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">실수령액</span>
                  <span className="text-2xl font-black tabular-nums text-blue-600 font-mono">
                    ₩{net.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 입금 계좌 확인 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-3">입금 계좌</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div
                  className={`w-10 h-10 rounded-lg ${DUMMY_ACCOUNT.bankColor} grid place-items-center text-xs font-extrabold`}
                >
                  {DUMMY_ACCOUNT.bankCode}
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-sm">
                    {DUMMY_ACCOUNT.bank} {DUMMY_ACCOUNT.number}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">예금주: {DUMMY_ACCOUNT.holder}</p>
                </div>
                <button className="text-xs text-blue-600 font-bold hover:text-blue-700">변경</button>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-mono">
                예상 입금: 5/8 (수) · 영업일 기준 D+2
              </p>
            </div>

            {/* 신청 버튼 */}
            <button
              onClick={() => setShowModal(true)}
              disabled={amount <= 0}
              className="w-full py-4 bg-blue-600 text-white text-base font-extrabold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ₩{net.toLocaleString()} 출금 신청
            </button>
            <p className="text-[10px] font-mono text-slate-400 text-center -mt-3">
              신청 후 취소는 평일 17시 이전까지 가능합니다.
            </p>
          </div>

          {/* ── 우측 사이드바 ── */}
          <aside className="space-y-4">
            {/* 최근 출금 내역 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">
                최근 출금 내역
              </p>
              <div className="space-y-3">
                {WITHDRAW_HISTORY.map((row) => (
                  <div key={row.date} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-slate-900">{row.date}</p>
                      <p className="text-[10px] font-mono text-emerald-600">✓ {row.status}</p>
                    </div>
                    <span className="font-extrabold font-mono tabular-nums text-slate-900">
                      ₩{row.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                전체 내역 →
              </button>
            </div>

            {/* 유의사항 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs leading-relaxed">
              <p className="font-extrabold text-amber-900 mb-1">알아두세요</p>
              <ul className="text-amber-800 space-y-1">
                <li>· 사업자 1일 1회 출금 가능</li>
                <li>· 17시 이후 신청은 다음 영업일 처리</li>
                <li>· 세금계산서 자동 발행</li>
                <li>· 원천징수세 3.3% 자동 차감</li>
              </ul>
            </div>

            {/* 이번 달 누적 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">
                이번 달 출금 현황
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">총 출금 횟수</span>
                  <span className="font-extrabold text-slate-900">3회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">총 출금액</span>
                  <span className="font-extrabold font-mono tabular-nums text-slate-900">₩4,730,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">납부 원천세</span>
                  <span className="font-extrabold font-mono tabular-nums text-rose-500">₩156,090</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 확인 모달 */}
      {showModal && (
        <ConfirmModal
          amount={amount}
          net={net}
          tax={tax}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* 성공 토스트 */}
      {showSuccess && (
        <SuccessToast net={lastNet} onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
}
