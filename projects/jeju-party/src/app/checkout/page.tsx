"use client";

import { useState } from "react";
import DevNav from "@/components/dev-nav";

// --- 더미 데이터 ---
const DUMMY_PARTY = {
  emoji: "🏄",
  title: "서핑 입문 클래스",
  date: "5/12 (월) · 14:00",
  location: "협재",
  host: "서핑왕민준",
  pricePerPerson: 65000,
};

const DUMMY_USER = {
  name: "박지원",
  phone: "010-2345-6789",
  email: "jiwon@example.com",
  points: 2400,
};

const PAYMENT_METHODS = [
  { id: "kakao", label: "카카오페이", sub: "간편결제", color: "bg-yellow-300" },
  { id: "naver", label: "네이버페이", sub: "간편결제", color: "bg-emerald-500" },
  { id: "card", label: "신용/체크카드", sub: "국내 모든 카드", color: "bg-slate-900" },
  { id: "bank", label: "계좌이체", sub: "무수수료", color: "bg-blue-500" },
];

const REFUND_POLICY = [
  "7일 전 취소 — 100% 환불",
  "3-6일 전 취소 — 50% 환불",
  "2일 이내 취소 — 환불 불가",
];

// --- 서브 컴포넌트 ---
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-extrabold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  wide,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  wide?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-mono font-bold tabular-nums ${tone ?? "text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}

// --- 메인 페이지 ---
export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("kakao");
  const [headcount, setHeadcount] = useState(2);
  const [couponCode, setCouponCode] = useState("WELCOME10");
  const [couponApplied, setCouponApplied] = useState(true);
  const [usePoints, setUsePoints] = useState(false);
  const [pointAmount, setPointAmount] = useState("");
  const [agreeRefund, setAgreeRefund] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [otherPerson, setOtherPerson] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const subtotal = DUMMY_PARTY.pricePerPerson * headcount;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const pointDiscount = usePoints ? Math.min(parseInt(pointAmount || "0", 10), DUMMY_USER.points) : 0;
  const total = subtotal - discount - pointDiscount;

  return (
    <div className="min-h-screen bg-slate-50">
      <DevNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-3 mb-8 text-xs font-mono">
          <span className="px-2 py-1 rounded bg-slate-200 text-slate-500">1 선택</span>
          <span className="text-slate-300">→</span>
          <span className="px-2 py-1 rounded bg-orange-500 text-white font-extrabold">2 결제</span>
          <span className="text-slate-300">→</span>
          <span className="px-2 py-1 rounded bg-slate-200 text-slate-500">3 완료</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* 좌측: 입력 영역 */}
          <div className="space-y-5">
            {/* 예약자 정보 */}
            <Card title="예약자 정보">
              <div className="grid grid-cols-2 gap-3">
                <LabeledInput label="이름" value={DUMMY_USER.name} />
                <LabeledInput label="휴대전화" value={DUMMY_USER.phone} />
                <LabeledInput label="이메일" value={DUMMY_USER.email} wide />
              </div>
              <label className="flex items-center gap-2 mt-3 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={otherPerson}
                  onChange={(e) => setOtherPerson(e.target.checked)}
                />
                다른 사람 정보로 예약하기
              </label>
              {otherPerson && (
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                  <LabeledInput label="예약자 이름" value="" placeholder="이름 입력" />
                  <LabeledInput label="예약자 연락처" value="" placeholder="010-0000-0000" />
                </div>
              )}
            </Card>

            {/* 인원 선택 */}
            <Card title="인원 선택">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">참여 인원</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    1인당 ₩{DUMMY_PARTY.pricePerPerson.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setHeadcount(Math.max(1, headcount - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-50"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-extrabold text-lg tabular-nums">
                    {headcount}
                  </span>
                  <button
                    onClick={() => setHeadcount(Math.min(10, headcount + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </Card>

            {/* 결제 수단 */}
            <Card title="결제 수단">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((m) => {
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        active
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-8 h-5 rounded ${m.color} mb-2`} />
                      <p className="text-xs font-extrabold">{m.label}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{m.sub}</p>
                    </button>
                  );
                })}
              </div>
              {paymentMethod === "card" && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <LabeledInput
                    label="카드번호"
                    value={cardNumber}
                    onChange={setCardNumber}
                    placeholder="0000 0000 0000 0000"
                    wide
                  />
                  <LabeledInput
                    label="유효기간"
                    value={cardExpiry}
                    onChange={setCardExpiry}
                    placeholder="MM/YY"
                  />
                  <LabeledInput
                    label="CVC"
                    value={cardCvc}
                    onChange={setCardCvc}
                    placeholder="•••"
                  />
                </div>
              )}
            </Card>

            {/* 할인 */}
            <Card title="할인">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="쿠폰 코드"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    onClick={() => setCouponApplied(true)}
                    className="px-4 py-2.5 bg-slate-900 text-white text-xs font-extrabold rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    적용
                  </button>
                </div>
                {couponApplied && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <span className="font-bold text-emerald-700">✓ 신규가입 10% 할인</span>
                    <span className="font-mono font-extrabold text-emerald-700">
                      −₩{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                  />
                  <span className="text-sm flex-1">
                    제주패스 포인트 사용 —{" "}
                    <span className="font-mono">{DUMMY_USER.points.toLocaleString()}P</span> 보유
                  </span>
                  {usePoints && (
                    <input
                      className="w-24 px-2 py-1 font-mono text-sm border border-slate-200 rounded text-right focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="0"
                      value={pointAmount}
                      onChange={(e) => setPointAmount(e.target.value.replace(/\D/g, ""))}
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* 환불 규정 / 동의 */}
            <Card title="환불 규정 / 동의">
              <ul className="text-xs text-slate-600 space-y-1.5 mb-3 font-mono">
                {REFUND_POLICY.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={agreeRefund}
                    onChange={(e) => setAgreeRefund(e.target.checked)}
                  />
                  환불 규정에 동의합니다 <span className="text-rose-500">*</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                  />
                  개인정보 제3자 제공에 동의 <span className="text-rose-500">*</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                  />
                  마케팅 정보 수신 (선택)
                </label>
              </div>
            </Card>
          </div>

          {/* 우측: 가격 요약 sticky */}
          <aside>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden sticky top-20">
              {/* 파티 정보 */}
              <div className="p-5 border-b border-slate-100 flex gap-3">
                <div className="w-14 h-14 rounded-xl bg-cyan-100 grid place-items-center text-2xl flex-shrink-0">
                  {DUMMY_PARTY.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-sm text-slate-900 truncate">
                    {DUMMY_PARTY.title}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {DUMMY_PARTY.date} · {DUMMY_PARTY.location}
                  </p>
                  <p className="text-[11px] text-slate-500">호스트: {DUMMY_PARTY.host}</p>
                </div>
              </div>

              {/* 가격 상세 */}
              <div className="p-5 space-y-2">
                <SummaryRow
                  label={`${headcount}명 × ₩${DUMMY_PARTY.pricePerPerson.toLocaleString()}`}
                  value={`₩${subtotal.toLocaleString()}`}
                />
                {couponApplied && (
                  <SummaryRow
                    label="신규가입 쿠폰"
                    value={`−₩${discount.toLocaleString()}`}
                    tone="text-emerald-600"
                  />
                )}
                {usePoints && pointDiscount > 0 && (
                  <SummaryRow
                    label="포인트 사용"
                    value={`−₩${pointDiscount.toLocaleString()}`}
                    tone="text-emerald-600"
                  />
                )}
                <SummaryRow label="결제 수수료" value="무료" tone="text-slate-400" />
                <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
                  <span className="font-extrabold">최종 결제</span>
                  <span className="text-2xl font-black tabular-nums">
                    ₩{total.toLocaleString()}
                  </span>
                </div>
                {(discount + pointDiscount) > 0 && (
                  <p className="text-[10px] font-mono text-emerald-600">
                    ₩{(discount + pointDiscount).toLocaleString()} 절약
                  </p>
                )}
              </div>

              {/* 결제 버튼 */}
              <div className="p-5 pt-0">
                <button
                  disabled={!agreeRefund || !agreePrivacy}
                  className="w-full py-3.5 bg-orange-500 text-white text-base font-extrabold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => {
                    window.location.href = "/checkout/success";
                  }}
                >
                  ₩{total.toLocaleString()} 결제하기
                </button>
                <p className="text-[10px] font-mono text-slate-400 text-center mt-2">
                  SSL 안전 결제 · PG: 토스페이먼츠
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
