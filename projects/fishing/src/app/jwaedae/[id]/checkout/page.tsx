"use client";
import { useState } from "react";
import Link from "next/link";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";
import { use } from "react";

const STEPS = ["예약 정보", "결제 방법", "에스크로 확인", "완료"];

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = DUMMY_JWAEDAE.find((j) => j.id === id);
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState("2026-05-24");
  const [payMethod, setPayMethod] = useState<"card" | "kakao" | "toss">("toss");

  if (!item) return <div className="p-8 text-center text-slate-400">업체를 찾을 수 없습니다.</div>;

  const total = item.priceDay * people;
  const fee = Math.round(total * 0.06);
  const toOperator = total - fee;

  return (
    <div className="max-w-xl lg:max-w-2xl mx-auto px-4 py-8">
      <Link href={`/jwaedae/${id}`} className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 좌대 상세로</Link>

      {/* 단계 표시 */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${i < step ? "bg-teal-500 text-white" : i === step ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-500"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] mt-1 whitespace-nowrap ${i === step ? "text-hook" : "text-slate-600"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1 mb-4 ${i < step ? "bg-teal-500" : "bg-ocean-800"}`} />}
          </div>
        ))}
      </div>

      {/* STEP 0: 예약 정보 */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <h2 className="font-bold text-slate-200 mb-4">🛖 {item.name}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">출조 날짜</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-ocean-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">인원 (최대 {item.capacity}명)</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 rounded-full bg-ocean-800 hover:bg-ocean-700 text-slate-200 font-bold transition-colors">−</button>
                  <span className="text-2xl font-black text-slate-200 w-8 text-center">{people}</span>
                  <button onClick={() => setPeople(Math.min(item.capacity, people + 1))} className="w-10 h-10 rounded-full bg-ocean-800 hover:bg-ocean-700 text-slate-200 font-bold transition-colors">+</button>
                  <span className="text-sm text-slate-400">명</span>
                </div>
              </div>
            </div>
          </div>

          {/* 요금 요약 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 space-y-2">
            <h3 className="font-bold text-slate-200 mb-3">요금 확인</h3>
            <div className="flex justify-between text-sm"><span className="text-slate-400">1인 요금</span><span className="text-slate-200">{item.priceDay.toLocaleString()}원</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">인원</span><span className="text-slate-200">{people}명</span></div>
            <div className="border-t border-ocean-800 pt-2 flex justify-between font-bold"><span className="text-slate-300">총 결제금액</span><span className="text-hook text-lg">{total.toLocaleString()}원</span></div>
          </div>

          <div className="rounded-xl border border-ocean-800 bg-ocean-900/50 p-4 text-xs text-slate-400">
            📍 {item.transportInfo}
          </div>
          <button onClick={() => setStep(1)} className="w-full py-4 bg-hook hover:bg-hook-light text-ocean-950 font-black text-lg rounded-2xl transition-colors">
            다음 — 결제 방법 선택 →
          </button>
        </div>
      )}

      {/* STEP 1: 결제 방법 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <h2 className="font-bold text-slate-200 mb-4">결제 방법 선택</h2>
            <div className="space-y-2">
              {([
                { key: "toss", label: "토스페이", icon: "💙", desc: "토스로 간편 결제" },
                { key: "kakao", label: "카카오페이", icon: "💛", desc: "카카오로 간편 결제" },
                { key: "card", label: "신용·체크카드", icon: "💳", desc: "국내외 모든 카드" },
              ] as const).map((m) => (
                <label key={m.key} onClick={() => setPayMethod(m.key)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${payMethod === m.key ? "border-hook bg-hook/5" : "border-ocean-700 hover:border-ocean-500"}`}>
                  <input type="radio" checked={payMethod === m.key} onChange={() => setPayMethod(m.key)} className="accent-hook" />
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{m.label}</div>
                    <div className="text-xs text-slate-500">{m.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 border border-ocean-700 hover:border-ocean-500 text-slate-400 rounded-2xl font-bold transition-colors">← 이전</button>
            <button onClick={() => setStep(2)} className="flex-[2] py-3 bg-hook hover:bg-hook-light text-ocean-950 font-black rounded-2xl transition-colors">에스크로 확인 →</button>
          </div>
        </div>
      )}

      {/* STEP 2: 에스크로 설명 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-hook/30 bg-hook/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔐</span>
              <h2 className="font-bold text-hook">에스크로 안전결제</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              결제 금액은 퐁당가 안전하게 보관합니다. 출조 완료 확인 후 업체에 정산되며, 문제 발생 시 전액 보호받으실 수 있습니다.
            </p>
            <div className="space-y-3">
              {[
                { icon: "1️⃣", title: "결제 후 에스크로 보관", desc: `${total.toLocaleString()}원이 퐁당에 안전 보관` },
                { icon: "2️⃣", title: "출조 당일 업체 확인", desc: "출조 완료 시 자동으로 업체 정산 개시" },
                { icon: "3️⃣", title: "D+2 업체 정산 완료", desc: `업체 수취 ${toOperator.toLocaleString()}원 (플랫폼 수수료 6% 차감)` },
              ].map((s) => (
                <div key={s.title} className="flex gap-3 p-3 rounded-xl bg-ocean-900 border border-ocean-800">
                  <span className="text-lg shrink-0">{s.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{s.title}</div>
                    <div className="text-xs text-slate-400">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 취소 정책 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <h3 className="font-bold text-slate-200 mb-3">취소 및 환불 정책</h3>
            <div className="space-y-2 text-sm">
              {[
                { when: "출조 7일 전 이상", refund: "100% 환불", color: "text-teal-400" },
                { when: "출조 3~6일 전", refund: "70% 환불", color: "text-hook" },
                { when: "출조 1~2일 전", refund: "30% 환불", color: "text-orange-400" },
                { when: "출조 당일", refund: "환불 불가", color: "text-rose-400" },
                { when: "기상 불량 (기상청 기준)", refund: "100% 환불", color: "text-teal-400" },
              ].map((r) => (
                <div key={r.when} className="flex justify-between">
                  <span className="text-slate-400">{r.when}</span>
                  <span className={`font-bold ${r.color}`}>{r.refund}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 최종 요약 */}
          <div className="rounded-2xl border border-ocean-700 bg-ocean-900 p-5 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-400">{date} 출조 · {people}명</span><span className="text-slate-300">{item.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">결제 방법</span><span className="text-slate-300">{{ toss: "토스페이", kakao: "카카오페이", card: "카드" }[payMethod]}</span></div>
            <div className="border-t border-ocean-800 pt-2 flex justify-between font-bold"><span className="text-slate-300">최종 결제</span><span className="text-hook text-xl">{total.toLocaleString()}원</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-ocean-700 hover:border-ocean-500 text-slate-400 rounded-2xl font-bold transition-colors">← 이전</button>
            <Link href={`/jwaedae/${id}/checkout/complete`} className="flex-[2]">
              <button className="w-full py-3 bg-hook hover:bg-hook-light text-ocean-950 font-black rounded-2xl transition-colors">
                🔐 {total.toLocaleString()}원 안전결제
              </button>
            </Link>
          </div>
          <p className="text-center text-xs text-slate-600">결제 즉시 에스크로 보관 · SSL 암호화 보호</p>
        </div>
      )}
    </div>
  );
}
