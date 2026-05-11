import Link from "next/link";
import CatchCard from "@/components/catch-card";
import JwaedaeCard from "@/components/jwaedae-card";
import GatheringCard from "@/components/gathering-card";
import { DUMMY_CATCHES } from "@/lib/dummy-catch";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";
import { DUMMY_POSTS } from "@/lib/dummy-posts";
import { DUMMY_POINTS } from "@/lib/dummy-points";
import { SPOT_TYPE_ICON } from "@/lib/constants";

const HOT_CATCHES = DUMMY_CATCHES.sort((a, b) => b.likeCount - a.likeCount).slice(0, 4);
const AVAILABLE_JWAEDAE = DUMMY_JWAEDAE.filter(j => j.availableSeats > 0).slice(0, 4);
const UPCOMING_GATHERINGS = DUMMY_GATHERINGS.slice(0, 3);
const RECENT_POSTS = DUMMY_POSTS.slice(0, 6);
const TOP_POINTS = [...DUMMY_POINTS].sort((a, b) => b.recentCatchCount - a.recentCatchCount).slice(0, 3);

export default function HomePage() {
  return (
    <div>
      {/* 히어로 */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0a1628 0%, #0d2137 40%, #112842 70%, #163856 100%)" }}>
        {/* 바다 물결 배경 */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent, transparent 40px, #1e6595 40px, #1e6595 41px)" }} />

        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
          {/* 물때 + 날씨 띠 */}
          <div className="inline-flex items-center gap-3 bg-ocean-800/60 border border-ocean-700 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="text-ocean-300">오늘 물때</span>
            <span className="font-black text-hook">8물</span>
            <span className="text-ocean-700">|</span>
            <span className="text-slate-400">서풍 3~5m/s</span>
            <span className="text-ocean-700">|</span>
            <span className="text-slate-400">파고 0.5m</span>
            <span className="text-ocean-700">|</span>
            <span className="text-slate-400">수온 19°C</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-100 mb-3 leading-tight">
            오늘 어디서<br />
            <span className="text-ocean-400">뭐가 잡혔나</span> 🎣
          </h1>
          <p className="text-slate-400 text-lg mb-8">제주 낚시 조황 · 좌대 · 포인트 · 모임</p>

          {/* 빠른 검색 */}
          <div className="flex flex-wrap gap-3 mb-4">
            {["서귀포", "성산", "한림", "애월", "모슬포"].map((region) => (
              <Link key={region} href={`/catch?region=${region}`}>
                <span className="px-4 py-2 bg-ocean-800/60 border border-ocean-700 hover:border-ocean-500 rounded-full text-sm text-slate-300 hover:text-slate-100 transition-colors">
                  {region}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["감성돔", "참돔", "방어", "벵에돔", "볼락", "갈치"].map((fish) => (
              <Link key={fish} href={`/catch?fish=${fish}`}>
                <span className="px-3 py-1 text-xs bg-ocean-900/60 border border-ocean-800 hover:border-ocean-600 rounded-full text-ocean-300 hover:text-ocean-200 transition-colors">
                  🐟 {fish}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 바 */}
      <section className="bg-ocean-900 border-b border-ocean-800">
        <div className="max-w-5xl mx-auto px-2 py-3 flex items-center justify-between text-center">
          {[
            { value: "38건", label: "오늘 조황" },
            { value: "127개", label: "활성 포인트" },
            { value: "24개", label: "진행중 모임" },
            { value: "8,420명", label: "등록 낚시꾼" },
          ].map(({ value, label }) => (
            <div key={label} className="flex-1">
              <div className="text-hook font-black text-base sm:text-lg">{value}</div>
              <div className="text-slate-500 text-[10px] sm:text-xs">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 빠른 메뉴 */}
      <section className="bg-ocean-900 border-b border-ocean-800">
        <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
          {[
            { href: "/tide", icon: "🌊", label: "물때" },
            { href: "/ranking", icon: "🏆", label: "랭킹" },
            { href: "/market", icon: "🛒", label: "중고" },
            { href: "/coupon", icon: "🎫", label: "쿠폰" },
            { href: "/logbook", icon: "📓", label: "일지" },
            { href: "/carshare", icon: "🚗", label: "카풀" },
            { href: "/stay", icon: "🏠", label: "숙소" },
            { href: "/mypage", icon: "📋", label: "내예약" },
            { href: "/catch/upload", icon: "📸", label: "사진등록" },
            { href: "/map", icon: "📍", label: "지도" },
          ].map(m => (
            <a key={m.href} href={m.href} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-ocean-800 transition-colors">
              <span className="text-xl">{m.icon}</span>
              <span className="text-[10px] text-slate-400">{m.label}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* HOT 조황 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100">🔥 오늘의 HOT 조황</h2>
              <p className="text-xs text-slate-500">좋아요 많은 최신 조황 리포트</p>
            </div>
            <Link href="/catch" className="text-sm text-ocean-400 hover:text-ocean-300">전체보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOT_CATCHES.map((report) => (
              <CatchCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* 추천 포인트 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100">🗺️ 이번 주 인기 포인트</h2>
              <p className="text-xs text-slate-500">최근 7일 조황 건수 기준</p>
            </div>
            <Link href="/map" className="text-sm text-ocean-400 hover:text-ocean-300">지도보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TOP_POINTS.map((point, i) => (
              <Link key={point.id} href="/map">
                <div className="rounded-2xl border border-ocean-800 bg-ocean-900 hover:border-ocean-600 hover:-translate-y-0.5 transition-all p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{SPOT_TYPE_ICON[point.spotType]}</span>
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{point.name}</div>
                      <div className="text-xs text-ocean-400">{point.region}</div>
                    </div>
                    {i === 0 && <span className="ml-auto text-xs bg-hook/20 text-hook px-2 py-0.5 rounded-full border border-hook/30">1위</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {point.targetFish.slice(0, 3).map((f) => (
                      <span key={f} className="text-[10px] bg-ocean-800 text-ocean-300 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">최근 7일 조황 <span className="text-teal-sea font-bold">{point.recentCatchCount}건</span></span>
                    <span className="text-hook">★ {point.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 좌대 예약 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100">🛖 좌대 예약하기</h2>
              <p className="text-xs text-slate-500">자리 있는 좌대 모음</p>
            </div>
            <Link href="/jwaedae" className="text-sm text-ocean-400 hover:text-ocean-300">전체보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AVAILABLE_JWAEDAE.map((item) => (
              <JwaedaeCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 커뮤니티 + 모임 (2열 레이아웃) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 최신 커뮤니티 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-100">💬 최신 커뮤니티</h2>
              <Link href="/community" className="text-sm text-ocean-400 hover:text-ocean-300">전체보기 →</Link>
            </div>
            <div className="space-y-2">
              {RECENT_POSTS.map((post) => {
                const catColor: Record<string, string> = {
                  "조황": "bg-teal-900/60 text-teal-300 border-teal-800",
                  "자유": "bg-slate-800 text-slate-400 border-slate-700",
                  "질문": "bg-blue-900/60 text-blue-300 border-blue-800",
                  "장터": "bg-orange-900/60 text-orange-300 border-orange-800",
                  "후기": "bg-purple-900/60 text-purple-300 border-purple-800",
                };
                return (
                  <Link key={post.id} href={`/community/${post.id}`}>
                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-ocean-900 transition-colors">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md border shrink-0 mt-0.5 ${catColor[post.category] ?? ""}`}>{post.category}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{post.authorName} · ♥{post.likeCount} · 💬{post.commentCount}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 다가오는 모임 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-100">🤝 다가오는 모임</h2>
              <Link href="/gathering" className="text-sm text-ocean-400 hover:text-ocean-300">전체보기 →</Link>
            </div>
            <div className="space-y-3">
              {UPCOMING_GATHERINGS.map((item) => (
                <GatheringCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
