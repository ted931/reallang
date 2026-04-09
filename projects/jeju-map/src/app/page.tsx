"use client";

import { useState, useEffect, useRef } from "react";
import { CATEGORIES, DUMMY_PINS, type MapPin } from "@/lib/categories";

export default function MapPage() {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(["cafe", "restaurant", "attraction"]));
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [pins] = useState<MapPin[]>(DUMMY_PINS);

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelectedPin(null);
  };

  const filteredPins = pins.filter((p) => activeCategories.has(p.category));

  const getCategoryInfo = (categoryId: string) =>
    CATEGORIES.find((c) => c.id === categoryId);

  // 제주도 중심 좌표
  const JEJU_CENTER = { lat: 33.38, lng: 126.55 };

  // 핀 위치를 지도 영역 내 %로 변환 (단순 선형 매핑)
  const latRange = { min: 33.15, max: 33.58 };
  const lngRange = { min: 126.15, max: 127.00 };

  const toPercent = (lat: number, lng: number) => ({
    x: ((lng - lngRange.min) / (lngRange.max - lngRange.min)) * 100,
    y: ((latRange.max - lat) / (latRange.max - latRange.min)) * 100,
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Category Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategories.has(cat.id);
            const count = pins.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-gray-200"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map + Detail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative bg-sky-50 overflow-hidden">
          {/* VWorld 지도 배경 (정적 이미지 — 추후 JS SDK로 교체) */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-sky-200">
            {/* 제주도 실루엣 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 400 200" className="w-full max-w-3xl">
                <ellipse cx="200" cy="100" rx="180" ry="75" fill="#1a365d" />
                <ellipse cx="200" cy="90" rx="25" ry="35" fill="#1a365d" transform="translate(0 -10)" />
              </svg>
            </div>
          </div>

          {/* Pins */}
          {filteredPins.map((pin) => {
            const pos = toPercent(pin.lat, pin.lng);
            const cat = getCategoryInfo(pin.category);
            const isSelected = selectedPin?.id === pin.id;
            return (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(isSelected ? null : pin)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all z-10 ${
                  isSelected ? "scale-125 z-20" : "hover:scale-110"
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={pin.name}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md border-2 ${
                    isSelected ? "border-white ring-2" : "border-white"
                  }`}
                  style={{
                    backgroundColor: cat?.color || "#6B7280",
                    ringColor: cat?.color,
                  }}
                >
                  {cat?.emoji || "📍"}
                </div>
                {isSelected && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-lg shadow-lg px-3 py-1.5 whitespace-nowrap text-xs font-medium text-gray-800 border">
                    {pin.name}
                  </div>
                )}
              </button>
            );
          })}

          {/* Map Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-gray-500">
            {filteredPins.length}개 장소 표시 · {activeCategories.size}개 카테고리
          </div>
        </div>

        {/* Detail Panel */}
        {selectedPin && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: getCategoryInfo(selectedPin.category)?.color }}
                >
                  {getCategoryInfo(selectedPin.category)?.emoji} {getCategoryInfo(selectedPin.category)?.label}
                </span>
                <button onClick={() => setSelectedPin(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPin.name}</h2>

              {selectedPin.description && (
                <p className="text-sm text-gray-500 mb-4">{selectedPin.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">📍</span>
                  <span className="text-gray-700">{selectedPin.address}</span>
                </div>
                {selectedPin.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📞</span>
                    <a href={`tel:${selectedPin.phone}`} className="text-blue-600">{selectedPin.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🌐</span>
                  <span className="text-gray-500 text-xs">{selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500">
                  길찾기
                </button>
                <button className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  저장하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
