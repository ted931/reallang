"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { id: "home", label: "시작", emoji: "🏠", href: "/", desc: "여행 플로우 안내" },
  { id: "weather", label: "날씨", emoji: "🌤️", href: "/weather", desc: "10개 지역 실시간" },
  { id: "course", label: "코스", emoji: "🧭", href: "/course", desc: "AI 코스 3가지" },
  { id: "planner", label: "일정", emoji: "✈️", href: "/planner", desc: "AI 맞춤 일정" },
  { id: "map", label: "지도", emoji: "🗺️", href: "/map", desc: "장소 탐색" },
  { id: "drive", label: "드라이브", emoji: "🛣️", href: "/drive", desc: "날씨 맞춤 코스" },
];

export default function TravelHome() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">✈️ 제주 여행</h1>
          <p className="text-sky-100 mt-2">날씨부터 코스까지, 제주 여행의 모든 단계를 한곳에서</p>
        </div>
      </header>

      {/* 5 Steps Guide */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">여행 준비 5단계</h2>
        <div className="grid sm:grid-cols-5 gap-4">
          {[
            { step: 1, emoji: "🌤️", title: "날씨 확인", desc: "지금 제주 어디가 맑은지", href: `${basePath}/weather`, color: "sky" },
            { step: 2, emoji: "🧭", title: "코스 생성", desc: "AI가 3가지 코스 추천", href: `${basePath}/course`, color: "violet" },
            { step: 3, emoji: "✈️", title: "일정 만들기", desc: "일자별 상세 일정", href: `${basePath}/planner`, color: "emerald" },
            { step: 4, emoji: "🗺️", title: "장소 탐색", desc: "지도에서 추가 장소 검색", href: `${basePath}/map`, color: "amber" },
            { step: 5, emoji: "🛣️", title: "드라이브", desc: "날씨 맞춤 드라이브 코스", href: `${basePath}/drive`, color: "rose" },
          ].map((s) => (
            <a key={s.step} href={s.href}
              className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md hover:border-sky-200 transition-all group">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold mx-auto mb-3 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                {s.step}
              </div>
              <div className="text-2xl mb-2">{s.emoji}</div>
              <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 시작</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <a href={`${basePath}/course`} className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl border border-sky-100 p-5 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">🧭</div>
            <h3 className="font-bold text-gray-900">AI 코스 바로 받기</h3>
            <p className="text-sm text-gray-500 mt-1">취향, 인원, 예산만 입력하면 3가지 코스를 AI가 생성</p>
          </a>
          <a href={`${basePath}/weather`} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-5 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">🌤️</div>
            <h3 className="font-bold text-gray-900">지금 제주 날씨</h3>
            <p className="text-sm text-gray-500 mt-1">10개 지역 실시간 기온, 강수, 풍속 확인</p>
          </a>
          <a href={`${basePath}/drive`} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-5 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">🛣️</div>
            <h3 className="font-bold text-gray-900">오늘의 드라이브 코스</h3>
            <p className="text-sm text-gray-500 mt-1">지금 날씨에 맞는 최적 드라이브 코스 AI 추천</p>
          </a>
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-5xl mx-auto px-6 py-2 flex justify-around">
          {TABS.map((tab) => (
            <a key={tab.id} href={tab.id === "home" ? `${basePath}/` : `${basePath}/${tab.id === "home" ? "" : tab.id}`}
              className="flex flex-col items-center gap-0.5 py-1 px-2 text-gray-500 hover:text-sky-600 transition-colors">
              <span className="text-lg">{tab.emoji}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
