"use client";
import { useState } from "react";
import { DUMMY_POINTS } from "@/lib/dummy-points";
import { SPOT_TYPE_ICON, SPOT_TYPES } from "@/lib/constants";
import FishBadge from "@/components/fish-badge";

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

// 낚시 금지구역 (SVG 좌표 직접 정의)
const PROHIBITED_ZONES = [
  {
    id: "hz1",
    name: "서귀포 해양공원",
    type: "해양보호구역",
    detail: "연중 금지 — 산호 생태계 보호",
    // 서귀포 남쪽 해안 (lat 33.22, lng 126.55 중심)
    cx: 287, cy: 211, rx: 38, ry: 18,
  },
  {
    id: "hz2",
    name: "성산포 해양생태계보전지역",
    type: "해양보호구역",
    detail: "연중 금지 — 해양생태계 보전",
    // 성산 (lat 33.43, lng 126.87 중심)
    cx: 500, cy: 90, rx: 30, ry: 16,
  },
  {
    id: "hz3",
    name: "우도 주변 해역",
    type: "계절금지",
    detail: "산란기 (4월~6월) 참돔·벵에돔 금지",
    // 우도 (lat 33.50, lng 126.95 중심)
    cx: 550, cy: 49, rx: 22, ry: 14,
  },
  {
    id: "hz4",
    name: "한림 해상공원",
    type: "해양보호구역",
    detail: "연중 금지 — 비양도 주변 산호 보호",
    // 한림 (lat 33.41, lng 126.27 중심)
    cx: 94, cy: 98, rx: 26, ry: 14,
  },
  {
    id: "hz5",
    name: "제주 북부 산란장",
    type: "계절금지",
    detail: "산란기 (12월~2월) 방어 포획 금지",
    // 제주시 북쪽 (lat 33.52, lng 126.52 중심)
    cx: 249, cy: 34, rx: 44, ry: 12,
  },
];

const ZONE_TYPE_COLOR: Record<string, { fill: string; stroke: string; badge: string }> = {
  "해양보호구역": { fill: "rgba(239,68,68,0.18)", stroke: "#ef4444", badge: "bg-rose-900/60 text-rose-300 border-rose-700" },
  "계절금지": { fill: "rgba(251,146,60,0.18)", stroke: "#f97316", badge: "bg-orange-900/60 text-orange-300 border-orange-700" },
};

const SEASONAL_BANS = [
  { fish: "참돔", period: "4월~6월", reason: "산란기", emoji: "🐟" },
  { fish: "방어", period: "12월~2월", reason: "산란기", emoji: "🐠" },
  { fish: "벵에돔", period: "5월~7월", reason: "치어 보호기", emoji: "🐡" },
  { fish: "감성돔", period: "3월~4월", reason: "산란기", emoji: "🐟" },
];

export default function MapClient() {
  const [showProhibited, setShowProhibited] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const activeZone = PROHIBITED_ZONES.find(z => z.id === selectedZone);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-100 mb-1">🗺️ 낚시 포인트 지도</h1>
        <p className="text-slate-400 text-sm">제주 전역 낚시 포인트 {DUMMY_POINTS.length}개</p>
      </div>

      {/* 범례 + 금지구역 토글 */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {SPOT_TYPES.map((type) => (
            <span key={type} className="flex items-center gap-1.5 text-xs text-slate-400 bg-ocean-900 border border-ocean-800 px-3 py-1 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: MARKER_COLORS[type] }} />
              {SPOT_TYPE_ICON[type]} {type}
            </span>
          ))}
        </div>
        {/* 금지구역 토글 */}
        <button
          onClick={() => { setShowProhibited(v => !v); setSelectedZone(null); }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-colors ${showProhibited ? "bg-rose-900/40 border-rose-600 text-rose-300" : "bg-ocean-900 border-ocean-700 text-slate-400 hover:text-slate-200"}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${showProhibited ? "bg-rose-400" : "bg-slate-600"}`} />
          낚시 금지구역 보기
        </button>
      </div>

      {/* 금지구역 범례 */}
      {showProhibited && (
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(ZONE_TYPE_COLOR).map(([type, colors]) => (
            <span key={type} className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${colors.badge}`}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: colors.stroke }} />
              {type}
            </span>
          ))}
          <span className="text-xs text-slate-500 self-center">· 구역 클릭 시 상세 확인</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG 지도 */}
        <div className="lg:col-span-2 rounded-2xl border border-ocean-800 bg-ocean-900 overflow-hidden">
          <div className="p-2">
            <svg viewBox="0 0 600 300" className="w-full" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d2137 100%)" }}>
              {/* 제주도 윤곽 */}
              <ellipse cx="300" cy="150" rx="270" ry="120" fill="#112842" stroke="#1a4d70" strokeWidth="1" />
              <ellipse cx="300" cy="150" rx="100" ry="50" fill="#163856" opacity="0.4" />

              {/* 한라산 */}
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

              {/* 낚시 금지구역 오버레이 */}
              {showProhibited && PROHIBITED_ZONES.map(zone => {
                const colors = ZONE_TYPE_COLOR[zone.type];
                const isSelected = selectedZone === zone.id;
                return (
                  <g key={zone.id} style={{ cursor: "pointer" }} onClick={() => setSelectedZone(isSelected ? null : zone.id)}>
                    <ellipse
                      cx={zone.cx} cy={zone.cy} rx={zone.rx} ry={zone.ry}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isSelected ? 2 : 1.2}
                      strokeDasharray="4 2"
                      opacity={isSelected ? 1 : 0.85}
                    />
                    {isSelected && (
                      <ellipse cx={zone.cx} cy={zone.cy} rx={zone.rx} ry={zone.ry}
                        fill="none" stroke={colors.stroke} strokeWidth="3" opacity="0.4" />
                    )}
                    <text x={zone.cx} y={zone.cy + 3} textAnchor="middle" fill={colors.stroke}
                      fontSize="6" fontFamily="sans-serif" fontWeight="bold" pointerEvents="none">
                      🚫
                    </text>
                  </g>
                );
              })}

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
                    {point.recentCatchCount >= 10 && (
                      <circle cx={x + 5} cy={y - 5} r="4" fill="#f59e0b" stroke="#0a1628" strokeWidth="0.5" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="px-4 py-2 border-t border-ocean-800 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
            <span className="w-3 h-3 rounded-full bg-hook inline-block" />
            <span>최근 7일 조황 10건 이상 포인트</span>
            {showProhibited && (
              <>
                <span className="text-ocean-700">|</span>
                <span className="text-rose-400">점선 영역 = 낚시 금지구역</span>
              </>
            )}
          </div>
        </div>

        {/* 우측 패널 */}
        <div className="space-y-3">
          {/* 선택된 금지구역 상세 */}
          {showProhibited && activeZone && (
            <div className="rounded-xl border border-rose-700/50 bg-rose-900/20 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${ZONE_TYPE_COLOR[activeZone.type].badge}`}>
                    {activeZone.type}
                  </div>
                  <h3 className="text-sm font-bold text-rose-300">{activeZone.name}</h3>
                </div>
                <button onClick={() => setSelectedZone(null)} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
              </div>
              <p className="text-xs text-slate-400">{activeZone.detail}</p>
              <p className="text-[10px] text-slate-600 mt-2">※ 해양수산부 고시 기준 — 위반 시 과태료 부과</p>
            </div>
          )}

          {/* 계절별 포획 금지 */}
          {showProhibited && (
            <div className="rounded-xl border border-orange-800/50 bg-ocean-900 p-4">
              <h3 className="text-sm font-bold text-orange-300 mb-3">📅 계절별 포획금지 어종</h3>
              <div className="space-y-2">
                {SEASONAL_BANS.map(b => (
                  <div key={b.fish} className="flex items-center gap-2 text-xs">
                    <span>{b.emoji}</span>
                    <span className="font-bold text-slate-200 w-14">{b.fish}</span>
                    <span className="text-orange-300 font-mono">{b.period}</span>
                    <span className="text-slate-500">({b.reason})</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-3">수산자원관리법 제14조 기준</p>
            </div>
          )}

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
    </div>
  );
}
