import GatheringCard from "@/components/gathering-card";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";
import { REGIONS, SPOT_TYPES, FISHING_METHODS } from "@/lib/constants";

export const metadata = { title: "낚시 모임" };

export default function GatheringPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-100 mb-1">🤝 낚시 모임</h1>
        <p className="text-slate-400 text-sm">함께 낚시하러 가요 — 초보 환영 모임부터 고수 원정까지</p>
      </div>

      {/* 방식 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {["전체", ...FISHING_METHODS].map((m) => (
          <button key={m} className="shrink-0 px-4 py-1.5 rounded-full text-sm border border-ocean-700 text-slate-400 hover:border-ocean-500 hover:text-slate-200 transition-colors bg-ocean-900">
            {m}
          </button>
        ))}
      </div>

      {/* 지역 + 옵션 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {["전체지역", ...REGIONS].map((r) => (
          <button key={r} className="shrink-0 px-3 py-1 rounded-full text-xs border border-ocean-800 text-ocean-400 hover:border-ocean-600 hover:text-ocean-300 transition-colors">
            {r}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["초보환영", "장비제공", "이번주", "이번달", "무료"].map((opt) => (
          <button key={opt} className="px-3 py-1 rounded-full text-xs border border-ocean-800 text-slate-500 hover:border-ocean-600 hover:text-slate-300 transition-colors">
            {opt}
          </button>
        ))}
        <button className="ml-auto px-4 py-1.5 bg-hook hover:bg-hook-light text-ocean-950 font-bold text-sm rounded-full transition-colors">
          + 모임 만들기
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_GATHERINGS.map((item) => (
          <GatheringCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
