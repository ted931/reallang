"use client";

import { useState } from "react";
import { CATEGORIES, DUMMY_PINS } from "@/lib/categories";

export default function ListPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? DUMMY_PINS
    : DUMMY_PINS.filter((p) => p.category === activeCategory);

  const getCat = (id: string) => CATEGORIES.find((c) => c.id === id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">제주 장소 목록</h1>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            activeCategory === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          전체 ({DUMMY_PINS.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = DUMMY_PINS.filter((p) => p.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeCategory === cat.id ? "text-white" : "bg-gray-100 text-gray-600"
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((pin) => {
          const cat = getCat(pin.category);
          return (
            <div key={pin.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{cat?.emoji}</span>
                    <h3 className="font-bold text-gray-900">{pin.name}</h3>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: cat?.color }}
                    >
                      {cat?.label}
                    </span>
                  </div>
                  {pin.description && <p className="text-sm text-gray-500">{pin.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">📍 {pin.address}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
