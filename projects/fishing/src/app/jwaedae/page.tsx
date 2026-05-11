import JwaedaeCard from "@/components/jwaedae-card";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";
import { REGIONS } from "@/lib/constants";

export const metadata = { title: "좌대낚시" };

export default function JwaedaePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-100 mb-1">🛖 좌대낚시</h1>
        <p className="text-slate-400 text-sm">바다 위 떠있는 낚시 플랫폼 — 참돔·감성돔·방어 모두 노려요</p>
      </div>

      {/* 좌대 개념 배너 */}
      <div className="rounded-2xl border border-ocean-700 bg-ocean-900/60 p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">ℹ️</span>
        <div>
          <p className="text-sm font-semibold text-slate-200 mb-1">좌대낚시란?</p>
          <p className="text-xs text-slate-400 leading-relaxed">바다 위에 설치된 고정 구조물(좌대)에서 하는 낚시. 배 멀미 없이 안정적으로 낚시 가능. 미끼·낚시대 대여 포함이 많아 초보도 쉽게 즐길 수 있어요.</p>
        </div>
      </div>

      {/* 지역 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {["전체", ...REGIONS].map((r) => (
          <button key={r} className="shrink-0 px-4 py-1.5 rounded-full text-sm border border-ocean-700 text-slate-400 hover:border-ocean-500 hover:text-slate-200 transition-colors bg-ocean-900">
            {r}
          </button>
        ))}
      </div>

      {/* 옵션 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["숙박가능", "취사가능", "초보환영", "장비대여", "야간운영"].map((opt) => (
          <button key={opt} className="px-3 py-1 rounded-full text-xs border border-ocean-800 text-slate-500 hover:border-ocean-600 hover:text-slate-300 transition-colors">
            {opt}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {["별점순", "가격순", "잔여석순"].map((sort) => (
            <button key={sort} className="px-3 py-1 rounded-full text-xs border border-ocean-800 text-slate-500 hover:border-ocean-600 transition-colors">
              {sort}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_JWAEDAE.map((item) => (
          <JwaedaeCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
