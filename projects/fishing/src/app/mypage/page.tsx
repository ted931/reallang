"use client";
import Link from "next/link";
import { useState } from "react";
import { DUMMY_RESERVATIONS, ESCROW_STATUS_LABEL, type EscrowStatus } from "@/lib/dummy-reservations";

const TABS = ["전체", "보관중", "출조확정", "완료", "취소/환불"] as const;

const statusMap: Record<typeof TABS[number], EscrowStatus[] | null> = {
  "전체": null,
  "보관중": ["holding"],
  "출조확정": ["confirmed"],
  "완료": ["completed"],
  "취소/환불": ["cancelled", "refunded"],
};

export default function MyPage() {
  const [tab, setTab] = useState<typeof TABS[number]>("전체");

  const filtered = DUMMY_RESERVATIONS.filter((r) => {
    const allowed = statusMap[tab];
    return allowed === null || allowed.includes(r.escrowStatus);
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-black text-white">내 예약 · 에스크로</h1>
        <p className="text-xs text-slate-500 mt-0.5">결제금은 출조 완료 후 업체에 정산됩니다</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${tab === t ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* 예약 카드 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">예약 내역이 없습니다</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const status = ESCROW_STATUS_LABEL[r.escrowStatus];
            const total = r.totalAmount;
            const fee = Math.round(total * 0.06);
            return (
              <div key={r.id} className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
                {/* 상단 */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{r.jwaedaeName}</div>
                    <div className="text-xs text-slate-500">{r.region} · {r.date} {r.time} · {r.people}명</div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* 상태 설명 */}
                <div className="text-xs text-slate-400 bg-ocean-800/60 rounded-xl px-3 py-2 mb-3">
                  {status.desc}
                </div>

                {/* 금액 */}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-400">결제 금액</span>
                  <span className="font-bold text-hook">{total.toLocaleString()}원</span>
                </div>

                {/* 에스크로 타임라인 미니 */}
                <div className="flex items-center gap-1 text-[10px] text-slate-600 mb-3">
                  <span className={r.escrowStatus !== "cancelled" ? "text-teal-400" : ""}>결제</span>
                  <span>›</span>
                  <span className={["confirmed", "completed"].includes(r.escrowStatus) ? "text-teal-400" : ""}>업체확인</span>
                  <span>›</span>
                  <span className={r.escrowStatus === "completed" ? "text-teal-400" : ""}>출조</span>
                  <span>›</span>
                  <span className={r.escrowStatus === "completed" ? "text-teal-400" : ""}>정산 {r.escrowReleaseDate}</span>
                </div>

                {/* 조과 어종 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {r.targetFish.map((f) => (
                    <span key={f} className="text-[10px] px-2 py-0.5 bg-ocean-800 rounded-full text-slate-400">{f}</span>
                  ))}
                </div>

                {/* 버튼 */}
                <div className="flex gap-2">
                  <a href={`tel:${r.operatorPhone}`}
                    className="flex-1 py-2 text-center text-xs font-bold border border-ocean-700 hover:border-ocean-500 text-slate-400 rounded-xl transition-colors">
                    📞 업체 연락
                  </a>
                  {r.escrowStatus === "holding" && (
                    <button className="flex-1 py-2 text-xs font-bold border border-rose-800 hover:border-rose-600 text-rose-400 rounded-xl transition-colors">
                      취소 요청
                    </button>
                  )}
                  {r.escrowStatus === "completed" && (
                    <Link href={`/catch/new?jwaedaeId=${r.jwaedaeId}`}
                      className="flex-1 py-2 text-center text-xs font-bold bg-hook/10 hover:bg-hook/20 text-hook border border-hook/30 rounded-xl transition-colors">
                      🎣 조황 등록
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 하단 안내 */}
      <div className="mt-8 rounded-xl border border-ocean-800 bg-ocean-900/40 p-4 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-400 mb-2">에스크로 안내</div>
        <div>• 결제금은 출조 완료 확인 후 D+2 업체 정산</div>
        <div>• 기상 불량(풍랑주의보) 시 100% 자동 환불</div>
        <div>• 취소 환불은 취소 정책에 따라 처리</div>
        <div>• 문의: fishinglog@jejupass.com</div>
      </div>
    </div>
  );
}
