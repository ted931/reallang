import { notFound } from "next/navigation";
import Link from "next/link";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";
import FishBadge from "@/components/fish-badge";
import { SPOT_TYPE_ICON, METHOD_ICON } from "@/lib/constants";

export default async function GatheringDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = DUMMY_GATHERINGS.find((g) => g.id === id);
  if (!item) notFound();

  const remaining = item.maxMembers - item.currentMembers;
  const fillRate = item.currentMembers / item.maxMembers;
  const isAlmostFull = fillRate >= 0.8;
  const isFull = fillRate >= 1;

  const dateObj = new Date(item.date);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const dateStr = `${dateObj.getFullYear()}.${dateObj.getMonth() + 1}.${dateObj.getDate()}(${weekdays[dateObj.getDay()]}) ${item.time}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/gathering" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 모임 목록으로</Link>

      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 overflow-hidden mb-4">
        {/* 헤더 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="flex items-start gap-2 mb-2">
            <h1 className="text-lg font-bold text-slate-100 flex-1 leading-snug">{item.title}</h1>
            {isAlmostFull && !isFull && <span className="text-xs bg-rose-950/60 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full shrink-0">마감임박</span>}
            {isFull && <span className="text-xs bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full shrink-0">마감</span>}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-300">{item.hostName}</span>
            <span className="text-hook">★ {item.hostRating}</span>
            <span className="text-slate-500 text-xs">조획 {item.hostCatchCount}마리</span>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-ocean-800">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">일시</div>
              <div className="text-sm text-slate-200 font-medium">📅 {dateStr}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">장소</div>
              <div className="text-sm text-slate-200">{SPOT_TYPE_ICON[item.spotType]} {item.location}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">낚시 방식</div>
              <div className="text-sm text-slate-200">{METHOD_ICON[item.fishingMethod]} {item.fishingMethod}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">참가비</div>
              <div className="text-hook font-bold">
                {item.costType === "free" ? "무료" : `${item.costAmount?.toLocaleString()}원`}
              </div>
              {item.costNote && <div className="text-xs text-slate-500">{item.costNote}</div>}
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">인원</div>
              <div className="text-sm text-slate-200">{item.currentMembers}/{item.maxMembers}명
                {!isFull && <span className="text-ocean-400 ml-1">({remaining}자리 남음)</span>}
              </div>
            </div>
            <div className="flex gap-2">
              {item.beginnerWelcome && <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">초보환영</span>}
              {item.equipmentProvided && <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">장비제공</span>}
            </div>
          </div>
        </div>

        {/* 타겟 어종 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="text-xs text-slate-500 mb-2">타겟 어종</div>
          <div className="flex flex-wrap gap-2">
            {item.targetFish.map((f) => <FishBadge key={f} name={f} />)}
          </div>
        </div>

        {/* 설명 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="text-xs text-slate-500 mb-2">모임 소개</div>
          <p className="text-sm text-slate-200 leading-relaxed">{item.description}</p>
        </div>

        {/* 참가 현황 바 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>참가 현황</span>
            <span>{item.currentMembers}/{item.maxMembers}명</span>
          </div>
          <div className="h-2 bg-ocean-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(fillRate * 100, 100)}%`, background: isFull ? "#64748b" : isAlmostFull ? "#f59e0b" : "#2485be" }} />
          </div>
        </div>

        {/* 태그 */}
        <div className="px-5 py-3">
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs text-ocean-400">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-colors shadow-lg ${isFull ? "bg-slate-700 cursor-not-allowed" : "bg-hook hover:bg-hook-light text-ocean-950"}`} disabled={isFull}>
        {isFull ? "모임 마감" : `참가 신청하기 ${item.costType !== "free" ? `— ${item.costAmount?.toLocaleString()}원` : "— 무료"}`}
      </button>
      <p className="text-center text-xs text-slate-600 mt-2">호스트 {item.hostName}에게 연락 후 확정됩니다</p>
    </div>
  );
}
