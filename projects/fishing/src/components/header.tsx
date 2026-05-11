"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ocean-950/95 backdrop-blur border-b border-ocean-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🎣</span>
          <span className="font-black text-lg text-slate-100 tracking-tight">피싱로그</span>
        </Link>

        {/* 검색 (데스크탑) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <input
            type="text"
            placeholder="포인트, 어종, 좌대 검색..."
            className="w-full h-9 bg-ocean-800 border border-ocean-700 rounded-full px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500"
          />
        </div>

        {/* 우측 */}
        <div className="ml-auto flex items-center gap-3">
          {/* 검색 (모바일) */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            🔍
          </button>

          {/* 오늘 물때 */}
          <div className="hidden sm:flex items-center gap-1 text-xs bg-ocean-800 border border-ocean-700 px-3 py-1 rounded-full">
            <span className="text-ocean-300">오늘</span>
            <span className="font-bold text-hook">8물</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">서풍 3m/s</span>
          </div>

          {/* 알림 */}
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 relative">
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 bg-hook rounded-full" />
          </button>
        </div>
      </div>

      {/* 모바일 검색 드롭다운 */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <input
            type="text"
            placeholder="포인트, 어종, 좌대 검색..."
            className="w-full h-9 bg-ocean-800 border border-ocean-700 rounded-full px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
