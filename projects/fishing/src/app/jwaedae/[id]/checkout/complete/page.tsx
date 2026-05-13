"use client";
import Link from "next/link";
import { use } from "react";

export default function CheckoutCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const reservationNo = `FL${Date.now().toString().slice(-8)}`;

  const timeline = [
    { icon: "✅", label: "결제 완료", desc: "에스크로 보관 시작", date: dateStr, done: true },
    { icon: "📞", label: "업체 확인", desc: "업체가 예약을 확인합니다", date: "출조 2일 전", done: false },
    { icon: "🎣", label: "출조 당일", desc: "안전하고 즐거운 낚시!", date: "2026-05-24", done: false },
    { icon: "💰", label: "업체 정산", desc: "D+2 자동 정산 완료", date: "2026-05-26", done: false },
  ];

  return (
    <div className="max-w-xl lg:max-w-2xl mx-auto px-4 py-8">
      {/* 완료 헤더 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-teal-900/40 border-2 border-teal-500 flex items-center justify-center text-4xl mx-auto mb-4">
          🔐
        </div>
        <h1 className="text-2xl font-black text-slate-200 mb-1">결제 완료!</h1>
        <p className="text-slate-400 text-sm">에스크로 안전 보관이 시작되었습니다</p>
        <div className="mt-3 inline-block bg-ocean-800 rounded-xl px-4 py-1.5 text-xs text-slate-400">
          예약번호 <span className="text-hook font-bold font-mono">{reservationNo}</span>
        </div>
      </div>

      {/* 에스크로 타임라인 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-4">에스크로 진행 현황</h2>
        <div className="relative">
          {timeline.map((step, i) => (
            <div key={step.label} className="flex gap-4 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 ${step.done ? "bg-teal-900/60 border-2 border-teal-500" : "bg-ocean-800 border border-ocean-700"}`}>
                  {step.icon}
                </div>
                {i < timeline.length - 1 && (
                  <div className={`w-px flex-1 mt-1 mb-0 min-h-[16px] ${step.done ? "bg-teal-700" : "bg-ocean-800"}`} />
                )}
              </div>
              <div className="pb-4 last:pb-0">
                <div className={`font-bold text-sm ${step.done ? "text-teal-300" : "text-slate-400"}`}>{step.label}</div>
                <div className="text-xs text-slate-500">{step.desc}</div>
                <div className={`text-xs mt-0.5 font-mono ${step.done ? "text-teal-500" : "text-slate-600"}`}>{step.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 안내 사항 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900/50 p-5 mb-4 space-y-2 text-xs text-slate-400">
        <div className="flex gap-2"><span>📱</span><span>업체 확인 후 SMS/카카오 알림을 보내드립니다.</span></div>
        <div className="flex gap-2"><span>🌊</span><span>기상 불량 시 전액 환불됩니다. (기상청 풍랑주의보 기준)</span></div>
        <div className="flex gap-2"><span>🔒</span><span>결제금은 퐁당가 안전하게 보관 후 출조 완료 확인 시 업체에 정산됩니다.</span></div>
      </div>

      {/* 버튼 */}
      <div className="space-y-3">
        <Link href="/mypage" className="block w-full py-4 bg-hook hover:bg-hook-light text-ocean-950 font-black text-lg rounded-2xl transition-colors text-center">
          내 예약 확인하기
        </Link>
        <Link href="/jwaedae" className="block w-full py-3 border border-ocean-700 hover:border-ocean-500 text-slate-400 rounded-2xl font-bold transition-colors text-center">
          좌대 더 둘러보기
        </Link>
      </div>

      <p className="text-center text-xs text-slate-600 mt-4">SSL 암호화 · 에스크로 안전결제 · 퐁당 보호</p>
    </div>
  );
}
