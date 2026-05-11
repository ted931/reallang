"use client";
import { useState } from "react";
import Link from "next/link";
import { DUMMY_STAY, STAY_TYPE_LABEL, type Stay } from "@/lib/dummy-stay";

const REGIONS = ["전체", "서귀포", "성산", "모슬포", "한림", "애월", "구좌"];
const TYPES: Array<Stay["type"] | "전체"> = ["전체", "pension", "minbak", "guesthouse", "camping"];

const TYPE_LABEL_SHORT: Record<Stay["type"], string> = {
  pension: "펜션", minbak: "민박", guesthouse: "게스트하우스", camping: "캠핑장",
};

const TYPE_ICON: Record<Stay["type"], string> = {
  pension: "🏠", minbak: "🏘️", guesthouse: "🏡", camping: "⛺",
};

export default function StayPage() {
  const [region, setRegion] = useState("전체");
  const [type, setType] = useState<Stay["type"] | "전체">("전체");

  const filtered = DUMMY_STAY.filter((s) => {
    if (region !== "전체" && s.region !== region) return false;
    if (type !== "전체" && s.type !== type) return false;
    return true;
  });

  return (
    <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-ocean-50">🏠 낚시 숙소</h1>
          <p className="text-xs text-slate-500 mt-0.5">포인트 바로 옆, 낚시꾼을 위한 숙소</p>
        </div>
        <Link href="/stay/share"
          className="shrink-0 px-4 py-2 bg-ocean-800 hover:bg-ocean-700 text-slate-300 text-xs font-bold rounded-xl transition-colors border border-ocean-700">
          🤝 방 쉐어
        </Link>
      </div>

      {/* 유형 필터 */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${type === t ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
            {t === "전체" ? "전체" : TYPE_LABEL_SHORT[t]}
          </button>
        ))}
      </div>

      {/* 지역 필터 */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {REGIONS.map((r) => (
          <button key={r} onClick={() => setRegion(r)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${region === r ? "bg-hook text-ocean-950" : "bg-ocean-900 border border-ocean-800 text-slate-500 hover:text-slate-300"}`}>
            {r}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">조건에 맞는 숙소가 없습니다</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Link key={s.id} href={`/stay/${s.id}`}
              className="block rounded-2xl border border-ocean-800 bg-ocean-900 p-5 hover:border-ocean-600 transition-colors">
              {/* 상단 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{TYPE_ICON[s.type]}</span>
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.region} · {STAY_TYPE_LABEL[s.type]}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-hook">{s.pricePerNight.toLocaleString()}원</div>
                  <div className="text-[10px] text-slate-500">/박</div>
                </div>
              </div>

              {/* 포인트 거리 */}
              <div className="flex items-center gap-1.5 text-xs text-teal-400 mb-2">
                <span>🎣</span>
                <span>{s.nearbySpot}</span>
                <span className="text-slate-600">·</span>
                <span>{s.distanceToSpot}</span>
              </div>

              {/* 편의시설 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {s.amenities.slice(0, 4).map(a => (
                  <span key={a} className="text-[10px] px-2 py-0.5 bg-ocean-800 text-slate-400 rounded-full">{a}</span>
                ))}
                {s.amenities.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 bg-ocean-800 text-slate-500 rounded-full">+{s.amenities.length - 4}</span>
                )}
              </div>

              {/* 평점 + 태그 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {s.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-hook/10 text-hook border border-hook/20 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="shrink-0 text-xs text-slate-400 flex items-center gap-1">
                  <span className="text-hook">★ {s.rating}</span>
                  <span>({s.reviewCount})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
