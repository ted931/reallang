import { DUMMY_POINTS } from "@/lib/dummy-points";
import { SPOT_TYPE_ICON, SPOT_TYPES } from "@/lib/constants";
import FishBadge from "@/components/fish-badge";

export const metadata = { title: "포인트 지도" };

// 제주 좌표를 SVG 뷰포트로 변환
// 제주: lng 126.15~126.99 (폭 0.84), lat 33.10~33.55 (높이 0.45)
function toSVG(lat: number, lng: number) {
  const x = ((lng - 126.15) / 0.84) * 560 + 20;
  const y = ((33.55 - lat) / 0.45) * 260 + 20;
  return { x, y };
}

const MARKER_COLORS: Record<string, string> = {
  "방파제": "#2485be",
  "갯바위": "#92400e",
  "좌대": "#f59e0b",
  "선상": "#0d9488",
  "기수역": "#6d28d9",
  "해안": "#059669",
};

export default function MapPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-100 mb-1">🗺️ 낚시 포인트 지도</h1>
        <p className="text-slate-400 text-sm">제주 전역 낚시 포인트 {DUMMY_POINTS.length}개</p>
      </div>

      {/* 스팟 유형 범례 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SPOT_TYPES.map((type) => (
          <span key={type} className="flex items-center gap-1.5 text-xs text-slate-400 bg-ocean-900 border border-ocean-800 px-3 py-1 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: MARKER_COLORS[type] }} />
            {SPOT_TYPE_ICON[type]} {type}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG 지도 */}
        <div className="lg:col-span-2 rounded-2xl border border-ocean-800 bg-ocean-900 overflow-hidden">
          <div className="p-2">
            <svg viewBox="0 0 600 300" className="w-full" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d2137 100%)" }}>
              {/* 제주도 윤곽 (간략화된 폴리곤) */}
              <ellipse cx="300" cy="150" rx="270" ry="120" fill="#112842" stroke="#1a4d70" strokeWidth="1" />
              {/* 제주도 내부 지형 (간략) */}
              <ellipse cx="300" cy="150" rx="100" ry="50" fill="#163856" opacity="0.4" />

              {/* 한라산 표시 */}
              <g transform="translate(295,145)">
                <polygon points="0,-20 -12,10 12,10" fill="#1a4a7a" stroke="#1e6091" strokeWidth="0.5" />
                <text x="0" y="22" textAnchor="middle" fill="#55a8d8" fontSize="7" fontFamily="sans-serif">한라산</text>
              </g>

              {/* 지역명 */}
              {[
                { label: "제주시", x: 240, y: 75 },
                { label: "서귀포", x: 280, y: 225 },
                { label: "한림", x: 110, y: 130 },
                { label: "애월", x: 160, y: 90 },
                { label: "성산", x: 490, y: 110 },
                { label: "구좌", x: 460, y: 150 },
                { label: "모슬포", x: 120, y: 210 },
                { label: "우도", x: 540, y: 90 },
              ].map(({ label, x, y }) => (
                <text key={label} x={x} y={y} textAnchor="middle" fill="#55a8d8" fontSize="8" fontFamily="sans-serif" opacity="0.7">{label}</text>
              ))}

              {/* 포인트 마커 */}
              {DUMMY_POINTS.map((point) => {
                const { x, y } = toSVG(point.lat, point.lng);
                const color = MARKER_COLORS[point.spotType] ?? "#2485be";
                return (
                  <g key={point.id} style={{ cursor: "pointer" }}>
                    <circle cx={x} cy={y} r="7" fill={color} opacity="0.8" stroke="white" strokeWidth="0.8" />
                    <text x={x} y={y + 14} textAnchor="middle" fill="white" fontSize="6" fontFamily="sans-serif" opacity="0.85">
                      {point.name.replace(/\s.+/, "").slice(0, 4)}
                    </text>
                    {/* 조황 버블 */}
                    {point.recentCatchCount >= 10 && (
                      <circle cx={x + 5} cy={y - 5} r="4" fill="#f59e0b" stroke="#0a1628" strokeWidth="0.5" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="px-4 py-2 border-t border-ocean-800 text-xs text-slate-500 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-hook inline-block" />
            <span>최근 7일 조황 10건 이상 포인트</span>
          </div>
        </div>

        {/* 포인트 목록 */}
        <div className="space-y-3 max-h-[400px] lg:max-h-none overflow-y-auto">
          <h2 className="text-sm font-bold text-slate-300 sticky top-0 bg-ocean-950 py-1">포인트 목록 (조황순)</h2>
          {[...DUMMY_POINTS].sort((a, b) => b.recentCatchCount - a.recentCatchCount).map((point, i) => (
            <div key={point.id} className="rounded-xl border border-ocean-800 bg-ocean-900 p-3 hover:border-ocean-600 transition-colors cursor-pointer">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{SPOT_TYPE_ICON[point.spotType]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-100">{point.name}</span>
                    {i < 3 && <span className="text-[10px] bg-hook/20 text-hook px-1 rounded">{i + 1}위</span>}
                  </div>
                  <div className="text-xs text-ocean-400">{point.region} · {point.difficulty}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-teal-400 font-bold text-xs">+{point.recentCatchCount}</div>
                  <div className="text-[10px] text-slate-600">7일 조황</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {point.targetFish.slice(0, 3).map((f) => <FishBadge key={f} name={f} />)}
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
