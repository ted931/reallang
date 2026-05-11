"use client";
import { use, useState } from "react";
import Link from "next/link";
import { DUMMY_CARSHARE } from "@/lib/dummy-carshare";

export default function CarShareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = DUMMY_CARSHARE.find((c) => c.id === id);
  const [requested, setRequested] = useState(false);

  if (!item) return <div className="p-8 text-center text-slate-400">카풀을 찾을 수 없습니다.</div>;

  const remain = item.seats - item.seatsTaken;
  const full = remain === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-0 py-6">
      <Link href="/carshare" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 카풀 목록</Link>

      <div className="lg:flex lg:gap-8">
        {/* 왼쪽: 메인 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 호스트 정보 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{item.hostAvatar}</span>
              <div>
                <div className="font-black text-slate-200 text-lg">{item.hostName}</div>
                <div className="text-xs text-slate-400">{item.carType} · {item.region}</div>
              </div>
              <span className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full ${full ? "bg-slate-800 text-slate-500" : "bg-teal-900/40 text-teal-300 border border-teal-800"}`}>
                {full ? "마감" : `잔여 ${remain}석`}
              </span>
            </div>

            {/* 경로 */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-ocean-800/60 rounded-xl">
                <span className="text-lg mt-0.5">📍</span>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">출발지</div>
                  <div className="text-sm font-bold text-slate-200">{item.departure}</div>
                </div>
              </div>
              <div className="flex justify-center text-slate-600 text-sm">↓</div>
              <div className="flex items-start gap-3 p-3 bg-hook/5 border border-hook/20 rounded-xl">
                <span className="text-lg mt-0.5">🎣</span>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">목적지</div>
                  <div className="text-sm font-bold text-hook">{item.destination}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
            <h2 className="font-bold text-slate-200 mb-3">출조 정보</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-ocean-800/60 rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">출조 날짜</div>
                <div className="font-bold text-slate-200">{item.date}</div>
              </div>
              <div className="bg-ocean-800/60 rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">출발 시간</div>
                <div className="font-bold text-slate-200">{item.time}</div>
              </div>
              <div className="bg-ocean-800/60 rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">전체 좌석</div>
                <div className="font-bold text-slate-200">{item.seats}석</div>
              </div>
              <div className="bg-ocean-800/60 rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">1인 분담금</div>
                <div className="font-bold text-hook">{item.pricePerSeat.toLocaleString()}원</div>
              </div>
            </div>

            {/* 좌석 현황 */}
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-2">좌석 현황</div>
              <div className="flex gap-2">
                {Array.from({ length: item.seats }).map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${i < item.seatsTaken ? "bg-ocean-700 text-slate-500" : "bg-teal-900/40 border border-teal-700 text-teal-300"}`}>
                    {i < item.seatsTaken ? "👤" : "🪑"}
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-1">{item.seatsTaken}/{item.seats} 탑승 · {remain}석 남음</div>
            </div>
          </div>

          {/* 대상 어종 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
            <h2 className="font-bold text-slate-200 mb-3">목표 어종</h2>
            <div className="flex flex-wrap gap-2">
              {item.targetFish.map(f => (
                <span key={f} className="px-3 py-1.5 bg-hook/10 text-hook border border-hook/20 rounded-full text-sm font-bold">{f}</span>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900/50 p-5 mb-6">
            <h2 className="font-bold text-slate-200 mb-2">호스트 메모</h2>
            <p className="text-sm text-slate-400 leading-relaxed">💬 {item.note}</p>
          </div>

          {/* 모바일 CTA */}
          <div className="lg:hidden">
            {requested ? (
              <div className="w-full py-4 bg-teal-900/40 border border-teal-700 text-teal-300 font-black text-center rounded-2xl">
                ✅ 동승 신청 완료! 호스트 연락을 기다려주세요
              </div>
            ) : (
              <button
                disabled={full}
                onClick={() => setRequested(true)}
                className={`w-full py-4 font-black text-lg rounded-2xl transition-colors ${full ? "bg-ocean-800 text-slate-600 cursor-not-allowed" : "bg-hook hover:bg-hook-light text-ocean-950"}`}>
                {full ? "마감된 카풀입니다" : `🚗 동승 신청 — ${item.pricePerSeat.toLocaleString()}원`}
              </button>
            )}
            <p className="text-center text-xs text-slate-600 mt-3">신청 후 카카오톡으로 호스트와 연결됩니다</p>
          </div>
        </div>

        {/* 오른쪽: 예약 카드 (PC only) */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-6 self-start rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <div className="mb-4">
              <div className="text-2xl font-black text-hook">{item.pricePerSeat.toLocaleString()}원</div>
              <div className="text-xs text-slate-500">1인 분담금</div>
            </div>
            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--ocean-800)" }}>
                <span className="text-slate-400">출발</span>
                <span className="font-bold text-slate-200">{item.date} {item.time}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--ocean-800)" }}>
                <span className="text-slate-400">경로</span>
                <span className="font-bold text-slate-200 text-right text-xs">{item.departure} → {item.destination}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">잔여 좌석</span>
                <span className={`font-bold ${full ? "text-slate-500" : "text-teal-300"}`}>{full ? "마감" : `${remain}석`}</span>
              </div>
            </div>
            {requested ? (
              <div className="w-full py-3 bg-teal-900/40 border border-teal-700 text-teal-300 font-black text-center rounded-2xl text-sm">
                ✅ 동승 신청 완료!
              </div>
            ) : (
              <button
                disabled={full}
                onClick={() => setRequested(true)}
                className={`w-full py-3 font-black rounded-2xl transition-colors text-sm ${full ? "bg-ocean-800 text-slate-600 cursor-not-allowed" : "bg-hook hover:bg-hook-light text-ocean-950"}`}>
                {full ? "마감된 카풀입니다" : `🚗 동승 신청`}
              </button>
            )}
            <p className="text-center text-xs text-slate-600 mt-3">신청 후 카카오톡으로 호스트와 연결됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
