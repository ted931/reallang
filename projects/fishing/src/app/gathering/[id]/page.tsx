import { notFound } from "next/navigation";
import Link from "next/link";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";
import FishBadge from "@/components/fish-badge";

export default async function GatheringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const club = DUMMY_GATHERINGS.find((c) => c.id === id);
  if (!club) notFound();

  const fillRate = club.memberCount / club.maxMembers;
  const isFull = !club.openRecruiting || fillRate >= 1;

  const outingDateObj = new Date(club.nextOuting);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const outingStr = `${outingDateObj.getFullYear()}.${
    outingDateObj.getMonth() + 1
  }.${outingDateObj.getDate()}(${weekdays[outingDateObj.getDay()]})`;

  const LEVEL_COLOR: Record<string, string> = {
    입문: "#86efac",
    중급: "#60a5fa",
    고급: "#fbbf24",
    전체: "#a78bfa",
  };
  const lvlColor = LEVEL_COLOR[club.level] ?? "#a78bfa";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/gathering"
        className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block"
      >
        ← 동아리 목록으로
      </Link>

      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 overflow-hidden mb-4">
        {/* 헤더 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="flex items-start gap-2 mb-2">
            <h1 className="text-lg font-bold text-slate-100 flex-1 leading-snug">
              {club.name}
            </h1>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "3px 10px",
                borderRadius: 99,
                background: `${lvlColor}22`,
                color: lvlColor,
                border: `1px solid ${lvlColor}44`,
                flexShrink: 0,
              }}
            >
              {club.level}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="text-slate-400">📍 {club.region}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">🐟 {club.specialty}</span>
            {!club.openRecruiting && (
              <span className="text-xs bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">
                모집마감
              </span>
            )}
            {club.openRecruiting && (
              <span className="text-xs bg-teal-900/60 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
                모집중
              </span>
            )}
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-ocean-800">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">정기 출조</div>
              <div className="text-sm text-slate-200 font-medium">
                📅 {club.meetingFrequency}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">다음 출조일</div>
              <div className="text-sm text-slate-200">{outingStr}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">난이도</div>
              <div className="text-sm font-semibold" style={{ color: lvlColor }}>
                {club.level}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">월 회비</div>
              <div className="text-hook font-bold">
                {club.monthlyFee === 0
                  ? "무료"
                  : `${club.monthlyFee.toLocaleString()}원`}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">회원 현황</div>
              <div className="text-sm text-slate-200">
                {club.memberCount}/{club.maxMembers}명
                {club.openRecruiting && club.memberCount < club.maxMembers && (
                  <span className="text-ocean-400 ml-1">
                    ({club.maxMembers - club.memberCount}자리 남음)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 타겟 어종 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="text-xs text-slate-500 mb-2">주요 어종</div>
          <div className="flex flex-wrap gap-2">
            {club.fishTypes.map((f) => (
              <FishBadge key={f} name={f} />
            ))}
          </div>
        </div>

        {/* 활동 내역 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="text-xs text-slate-500 mb-2">클럽 활동</div>
          <div className="flex flex-wrap gap-2">
            {club.activities.map((act) => (
              <span
                key={act}
                className="text-xs bg-ocean-800 text-ocean-300 border border-ocean-700 px-2.5 py-1 rounded-full"
              >
                {act}
              </span>
            ))}
          </div>
        </div>

        {/* 소개 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="text-xs text-slate-500 mb-2">동아리 소개</div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {club.description}
          </p>
        </div>

        {/* 회원 진행 바 */}
        <div className="p-5">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>회원 현황</span>
            <span>
              {club.memberCount}/{club.maxMembers}명
            </span>
          </div>
          <div className="h-2 bg-ocean-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(fillRate * 100, 100)}%`,
                background: isFull
                  ? "#64748b"
                  : fillRate >= 0.8
                  ? "#f59e0b"
                  : "#2485be",
              }}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-colors shadow-lg ${
          isFull
            ? "bg-slate-700 cursor-not-allowed"
            : "bg-hook hover:bg-hook-light text-ocean-950"
        }`}
        disabled={isFull}
      >
        {isFull
          ? "모집 마감"
          : `가입 신청하기 — ${
              club.monthlyFee === 0
                ? "무료"
                : `월 ${club.monthlyFee.toLocaleString()}원`
            }`}
      </button>
      <p className="text-center text-xs text-slate-600 mt-2">
        클럽장에게 연락 후 가입이 확정됩니다
      </p>
    </div>
  );
}
