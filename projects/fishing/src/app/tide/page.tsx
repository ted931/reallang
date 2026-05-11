"use client";
import { useState } from "react";
import Link from "next/link";
import {
  DUMMY_TIDE, WEATHER_ICON, WEATHER_LABEL, SCORE_COLOR, SCORE_LABEL,
  type DayTide,
} from "@/lib/dummy-tide";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";

export default function TidePage() {
  const [selectedDate, setSelectedDate] = useState<string>(DUMMY_TIDE[0].date);
  const today = DUMMY_TIDE.find((d) => d.date === selectedDate) ?? DUMMY_TIDE[0];

  const highTides = today.tides.filter((t) => t.type === "high");
  const lowTides = today.tides.filter((t) => t.type === "low");

  // 좌대 예약 추천 (같은 지역 아무 거나)
  const recommendedJwaedae = DUMMY_JWAEDAE.slice(0, 3);

  function scoreStars(score: number) {
    return Array.from({ length: 5 }, (_, i) =>
      i < score ? "★" : "☆"
    ).join("");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="text-xl font-black text-white">🌊 물때 캘린더</h1>
        <p className="text-xs text-slate-500 mt-0.5">날짜를 선택해 출조 컨디션을 확인하세요</p>
      </div>

      {/* 날짜 스크롤 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4">
        {DUMMY_TIDE.map((d) => {
          const dt = new Date(d.date);
          const weekDay = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
          const isSelected = d.date === selectedDate;
          const isToday = d.date === "2026-05-11";
          return (
            <button key={d.date} onClick={() => setSelectedDate(d.date)}
              className={`shrink-0 flex flex-col items-center gap-0.5 w-14 py-2 rounded-2xl border transition-all ${
                isSelected
                  ? "bg-hook border-hook text-ocean-950"
                  : d.fishingScore >= 4
                  ? "bg-teal-900/30 border-teal-800 text-teal-300 hover:border-teal-600"
                  : "bg-ocean-900 border-ocean-800 text-slate-400 hover:border-ocean-600"
              }`}>
              <span className={`text-[10px] font-bold ${isSelected ? "text-ocean-950" : weekDay === "일" ? "text-rose-400" : weekDay === "토" ? "text-blue-400" : ""}`}>
                {weekDay}
              </span>
              <span className="text-sm font-black">{dt.getDate()}</span>
              <span className="text-base">{WEATHER_ICON[d.weather]}</span>
              <span className={`text-[9px] font-bold ${isSelected ? "text-ocean-950" : SCORE_COLOR[d.fishingScore]}`}>
                {scoreStars(d.fishingScore)}
              </span>
              {isToday && !isSelected && (
                <span className="text-[8px] bg-hook/20 text-hook px-1 rounded">오늘</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜 상세 */}
      <div className="space-y-4">
        {/* 종합 컨디션 */}
        <div className={`rounded-2xl border p-5 ${today.fishingScore >= 4 ? "border-teal-800 bg-teal-900/10" : today.fishingScore <= 2 ? "border-rose-900 bg-rose-900/10" : "border-ocean-800 bg-ocean-900"}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-lg font-black text-white">{today.date}</div>
              <div className="text-sm text-slate-400">{today.tideLabel} · 음력 {today.lunarDay}일 {today.moonPhase}</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${SCORE_COLOR[today.fishingScore]}`}>
                {SCORE_LABEL[today.fishingScore]}
              </div>
              <div className={`text-sm ${SCORE_COLOR[today.fishingScore]}`}>{scoreStars(today.fishingScore)}</div>
            </div>
          </div>
          <div className={`rounded-xl p-3 text-sm leading-relaxed ${today.fishingScore >= 4 ? "bg-teal-900/30 text-teal-200" : today.fishingScore <= 2 ? "bg-rose-900/30 text-rose-300" : "bg-ocean-800/60 text-slate-300"}`}>
            💡 {today.fishingTip}
          </div>
        </div>

        {/* 기상 정보 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-3">기상 정보</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: WEATHER_ICON[today.weather], label: "날씨", value: WEATHER_LABEL[today.weather] },
              { icon: "💨", label: "바람", value: `${today.windSpeed}m/s` },
              { icon: "🌊", label: "파고", value: `${today.waveHeight}m` },
              { icon: "🌅", label: "일출/몰", value: `${today.sunrise}/${today.sunset}` },
            ].map((item) => (
              <div key={item.label} className="bg-ocean-800/60 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-[10px] text-slate-500">{item.label}</div>
                <div className="text-sm font-bold text-slate-200">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 물때 표 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-3">조석 예보</h2>
          <div className="space-y-2">
            {today.tides.filter(t => t.time).sort((a, b) => a.time.localeCompare(b.time)).map((t, i) => {
              const maxH = 340;
              const barW = Math.round((t.height / maxH) * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 text-xs font-mono text-slate-400 shrink-0">{t.time}</div>
                  <div className="flex-1 bg-ocean-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${t.type === "high" ? "bg-teal-500" : "bg-ocean-600"}`}
                      style={{ width: `${barW}%` }}
                    />
                  </div>
                  <div className="w-20 text-right">
                    <span className={`text-xs font-bold ${t.type === "high" ? "text-teal-400" : "text-slate-500"}`}>
                      {t.type === "high" ? "만조" : "간조"}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">{t.height}cm</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 추천 어종 */}
        {today.recommendFish.length > 0 && (
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <h2 className="font-bold text-slate-200 mb-3">오늘의 추천 어종</h2>
            <div className="flex flex-wrap gap-2">
              {today.recommendFish.map(f => (
                <span key={f} className="px-4 py-2 bg-hook/10 text-hook border border-hook/30 rounded-full font-bold text-sm">{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* 오늘 예약 가능한 좌대 */}
        {today.fishingScore >= 3 && (
          <div className="rounded-2xl border border-teal-800/50 bg-teal-900/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-teal-300">이 날 예약 가능한 좌대</h2>
              <Link href="/jwaedae" className="text-xs text-ocean-400 hover:text-ocean-300">전체보기 →</Link>
            </div>
            <div className="space-y-2">
              {recommendedJwaedae.map(j => (
                <Link key={j.id} href={`/jwaedae/${j.id}`}
                  className="flex items-center justify-between p-3 bg-ocean-900 rounded-xl hover:bg-ocean-800 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-200">{j.name}</div>
                    <div className="text-xs text-slate-500">{j.region} · {j.targetFish.slice(0, 2).join(", ")}</div>
                  </div>
                  <div className="text-sm font-black text-hook shrink-0">{j.priceDay.toLocaleString()}원</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
