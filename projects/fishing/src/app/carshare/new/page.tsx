"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const REGIONS = ["서귀포", "성산", "모슬포", "한림", "애월", "구좌", "제주시"];
const FISH = ["갈치", "참돔", "감성돔", "광어", "농어", "방어", "삼치", "볼락"];
const CAR_TYPES = ["승용차 (4인)", "SUV (5인)", "승합차 (7인)", "승합차 (9인)"];

export default function CarShareNewPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    region: "서귀포",
    departure: "",
    destination: "",
    date: "2026-05-24",
    time: "05:00",
    carType: CAR_TYPES[0],
    seats: 3,
    pricePerSeat: 10000,
    fish: [] as string[],
    note: "",
  });

  function toggleFish(f: string) {
    setForm(prev => ({
      ...prev,
      fish: prev.fish.includes(f) ? prev.fish.filter(x => x !== f) : [...prev.fish, f],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-teal-900/40 border-2 border-teal-500 flex items-center justify-center text-4xl mx-auto mb-4">🚗</div>
        <h1 className="text-2xl font-black text-slate-200 mb-2">카풀 등록 완료!</h1>
        <p className="text-sm text-slate-400 mb-8">낚시인들이 동승 신청을 보낼 거예요.</p>
        <div className="space-y-3">
          <Link href="/carshare" className="block w-full py-4 bg-hook hover:bg-hook-light text-ocean-950 font-black text-lg rounded-2xl transition-colors">
            카풀 목록 보기
          </Link>
          <Link href="/" className="block w-full py-3 border border-ocean-700 hover:border-ocean-500 text-slate-400 rounded-2xl font-bold transition-colors">
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <Link href="/carshare" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 카풀 목록</Link>

      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-200">🚗 카풀 등록</h1>
        <p className="text-xs text-slate-500 mt-0.5">빈 자리를 공유하고 유류비를 나눠요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 지역 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-3">지역</h2>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => (
              <button key={r} type="button" onClick={() => setForm(f => ({ ...f, region: r }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${form.region === r ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 경로 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 space-y-3">
          <h2 className="font-bold text-slate-200 mb-1">경로</h2>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">출발지</label>
            <input value={form.departure} onChange={e => setForm(f => ({ ...f, departure: e.target.value }))}
              placeholder="예: 제주시청 앞"
              className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">목적지 (낚시 포인트)</label>
            <input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
              placeholder="예: 서귀포 황금좌대"
              className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500" />
          </div>
        </div>

        {/* 일정 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-3">출조 일정</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">날짜</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:border-ocean-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">출발 시간</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:border-ocean-500" />
            </div>
          </div>
        </div>

        {/* 차량 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-3">차량 정보</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">차종</label>
              <select value={form.carType} onChange={e => setForm(f => ({ ...f, carType: e.target.value }))}
                className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-ocean-500">
                {CAR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">모집 인원</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setForm(f => ({ ...f, seats: Math.max(1, f.seats - 1) }))}
                    className="w-9 h-9 rounded-full bg-ocean-800 hover:bg-ocean-700 text-slate-200 font-bold">−</button>
                  <span className="text-lg font-black text-slate-200 w-6 text-center">{form.seats}</span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, seats: Math.min(8, f.seats + 1) }))}
                    className="w-9 h-9 rounded-full bg-ocean-800 hover:bg-ocean-700 text-slate-200 font-bold">+</button>
                  <span className="text-xs text-slate-500">명</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">1인 분담금</label>
                <input type="number" value={form.pricePerSeat} step={1000}
                  onChange={e => setForm(f => ({ ...f, pricePerSeat: Number(e.target.value) }))}
                  className="w-full h-9 bg-ocean-800 border border-ocean-700 rounded-xl px-3 text-sm text-slate-200 focus:outline-none focus:border-ocean-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 목표 어종 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-3">목표 어종</h2>
          <div className="flex flex-wrap gap-2">
            {FISH.map(f => (
              <button key={f} type="button" onClick={() => toggleFish(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${form.fish.includes(f) ? "bg-hook/10 text-hook border border-hook/30" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 메모 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-3">호스트 메모</h2>
          <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={3}
            placeholder="추가 안내 사항을 입력하세요"
            className="w-full bg-ocean-800 border border-ocean-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500 resize-none" />
        </div>

        <button type="submit"
          disabled={!form.departure || !form.destination}
          className={`w-full py-4 font-black text-lg rounded-2xl transition-colors ${form.departure && form.destination ? "bg-hook hover:bg-hook-light text-ocean-950" : "bg-ocean-800 text-slate-600 cursor-not-allowed"}`}>
          🚗 카풀 등록하기
        </button>
        {(!form.departure || !form.destination) && (
          <p className="text-center text-xs text-slate-600">출발지와 목적지를 입력해주세요</p>
        )}
      </form>
    </div>
  );
}
