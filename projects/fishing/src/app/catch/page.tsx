import CatchCard from "@/components/catch-card";
import { DUMMY_CATCHES } from "@/lib/dummy-catch";
import { REGIONS, FISH_LIST, SPOT_TYPES, FISHING_METHODS } from "@/lib/constants";

export const metadata = { title: "조황 피드" };

export default function CatchPage() {
  const sorted = [...DUMMY_CATCHES].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-100 mb-1">🐟 조황 피드</h1>
        <p className="text-slate-400 text-sm">오늘 어디서 뭐가 잡혔나</p>
      </div>

      {/* 스팟 유형 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {["전체", ...SPOT_TYPES].map((type) => (
          <button key={type} className="shrink-0 px-4 py-1.5 rounded-full text-sm border border-ocean-700 text-slate-400 hover:border-ocean-500 hover:text-slate-200 transition-colors bg-ocean-900">
            {type}
          </button>
        ))}
      </div>

      {/* 지역 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {["전체지역", ...REGIONS].map((region) => (
          <button key={region} className="shrink-0 px-3 py-1 rounded-full text-xs border border-ocean-800 text-ocean-400 hover:border-ocean-600 hover:text-ocean-300 transition-colors">
            {region}
          </button>
        ))}
      </div>

      {/* 어종 필터 */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
        {["전체어종", ...FISH_LIST.slice(0, 10)].map((fish) => (
          <button key={fish} className="shrink-0 px-3 py-1 rounded-full text-xs border border-ocean-800 text-slate-500 hover:border-ocean-600 hover:text-slate-300 transition-colors">
            {fish}
          </button>
        ))}
      </div>

      {/* 조황 리스트 */}
      <div className="space-y-4">
        {sorted.map((report) => (
          <CatchCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
