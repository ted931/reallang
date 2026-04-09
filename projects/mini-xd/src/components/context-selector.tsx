"use client";

import { useProjectStore } from "@/store/use-project-store";

const SITE_TYPES = [
  { value: "landing", label: "랜딩 페이지", icon: "🚀" },
  { value: "dashboard", label: "대시보드", icon: "📊" },
  { value: "ecommerce", label: "쇼핑몰", icon: "🛒" },
  { value: "blog", label: "블로그", icon: "📝" },
  { value: "portfolio", label: "포트폴리오", icon: "🎯" },
  { value: "other", label: "기타", icon: "✨" },
];

export function ContextSelector() {
  const { siteType, setSiteType } = useProjectStore();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">사이트 유형</label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {SITE_TYPES.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setSiteType(value)}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-xl border text-sm
              transition-all duration-150
              ${siteType === value
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
