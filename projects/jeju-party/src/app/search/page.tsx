"use client";

import { useState, useMemo } from "react";

// ─── 더미 데이터 ───────────────────────────────────────────────
interface PartyResult {
  id: string;
  icon: string;
  title: string;
  sub: string;
  price: number;
  host: string;
  tags: string[];
}

interface PlaceResult {
  id: string;
  icon: string;
  title: string;
  sub: string;
  tag: string;
}

interface HostResult {
  id: string;
  initial: string;
  avatarBg: string;
  who: string;
  sub: string;
  superhost: boolean;
}

const DUMMY_PARTIES: PartyResult[] = [
  {
    id: "p1",
    icon: "🏄",
    title: "협재 서핑 입문 클래스",
    sub: "5/12 (월) · 4시간",
    price: 65000,
    host: "서핑왕민준",
    tags: ["서핑", "초보환영"],
  },
  {
    id: "p2",
    icon: "🚴",
    title: "협재-금능 자전거 투어",
    sub: "매일 09:00 · 3시간",
    price: 35000,
    host: "바람따라",
    tags: ["자전거", "오전"],
  },
  {
    id: "p3",
    icon: "🐠",
    title: "협재 스노클링 — 가족용",
    sub: "주말 · 2시간",
    price: 42000,
    host: "바다친구",
    tags: ["스노클링", "가족"],
  },
  {
    id: "p4",
    icon: "🏖️",
    title: "협재해변 일출 요가",
    sub: "매일 06:30 · 1시간",
    price: 25000,
    host: "선라이즈요가",
    tags: ["요가", "일출"],
  },
  {
    id: "p5",
    icon: "📸",
    title: "협재 석양 사진 산책",
    sub: "5/10 (토) 17:00 · 2시간",
    price: 0,
    host: "제주사진가",
    tags: ["사진", "석양"],
  },
];

const DUMMY_PLACES: PlaceResult[] = [
  {
    id: "pl1",
    icon: "☕",
    title: "봄날 카페",
    sub: "협재 · 카페 · ★4.8",
    tag: "오션뷰",
  },
  {
    id: "pl2",
    icon: "🍜",
    title: "협재 칼국수",
    sub: "협재 · 식당 · ★4.6",
    tag: "성게칼국수",
  },
  {
    id: "pl3",
    icon: "🏖️",
    title: "협재해변",
    sub: "관광 · 무료",
    tag: "에메랄드빛",
  },
  {
    id: "pl4",
    icon: "🧁",
    title: "협재 베이커리 선",
    sub: "협재 · 카페 · ★4.7",
    tag: "수제빵",
  },
];

const DUMMY_HOSTS: HostResult[] = [
  {
    id: "h1",
    initial: "민",
    avatarBg: "bg-cyan-400",
    who: "서핑왕민준",
    sub: "협재 거주 · 슈퍼호스트 · ★4.92",
    superhost: true,
  },
  {
    id: "h2",
    initial: "바",
    avatarBg: "bg-emerald-400",
    who: "바람따라",
    sub: "협재/금능 · 자전거 전문 · ★4.88",
    superhost: false,
  },
];

const RECENT_SEARCHES = ["우도", "중문", "감귤따기", "애월카페"];
const TRENDING = [
  { rank: "1", keyword: "한라산 등반", trend: "↑" },
  { rank: "2", keyword: "우도 자전거", trend: "=" },
  { rank: "3", keyword: "감귤 농장 체험", trend: "↑" },
  { rank: "4", keyword: "중문 서핑", trend: "↓" },
  { rank: "5", keyword: "협재 스노클", trend: "↑" },
];

type TabId = "all" | "party" | "place" | "host";
const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "party", label: "파티" },
  { id: "place", label: "장소" },
  { id: "host", label: "호스트" },
];

// ─── 하이라이트 컴포넌트 ─────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "g"));
  return (
    <>
      {parts.map((part, i) =>
        part === query ? (
          <span
            key={i}
            className="font-extrabold"
            style={{
              background: "linear-gradient(transparent 55%, #fde68a 55%)",
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export default function SearchPage() {
  const [query, setQuery] = useState("협재");
  const [inputValue, setInputValue] = useState("협재");
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

  const handleSearch = () => {
    setQuery(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const removeRecent = (kw: string) =>
    setRecentSearches((prev) => prev.filter((s) => s !== kw));

  const clickRecent = (kw: string) => {
    setInputValue(kw);
    setQuery(kw);
  };

  // 필터링
  const filteredParties = useMemo(() => {
    if (!query) return [];
    return DUMMY_PARTIES.filter(
      (p) =>
        p.title.includes(query) ||
        p.host.includes(query) ||
        p.tags.some((t) => t.includes(query))
    );
  }, [query]);

  const filteredPlaces = useMemo(() => {
    if (!query) return [];
    return DUMMY_PLACES.filter(
      (p) => p.title.includes(query) || p.sub.includes(query)
    );
  }, [query]);

  const filteredHosts = useMemo(() => {
    if (!query) return [];
    return DUMMY_HOSTS.filter(
      (h) => h.who.includes(query) || h.sub.includes(query)
    );
  }, [query]);

  const totalCount =
    filteredParties.length + filteredPlaces.length + filteredHosts.length;
  const tabCounts: Record<TabId, number> = {
    all: totalCount,
    party: filteredParties.length,
    place: filteredPlaces.length,
    host: filteredHosts.length,
  };

  const showSection = (type: Exclude<TabId, "all">) =>
    activeTab === "all" || activeTab === type;

  const hasNoResults =
    query &&
    filteredParties.length === 0 &&
    filteredPlaces.length === 0 &&
    filteredHosts.length === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              jeju<span className="text-orange-500">.party</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">통합 검색</p>
          </div>
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`}
            className="text-sm font-bold text-slate-500 hover:text-slate-800"
          >
            ← 피드로
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 검색바 */}
        <div className="bg-white border-2 border-orange-500 rounded-2xl px-3 py-2 flex items-center gap-2 mb-2 shadow-sm">
          <span className="text-xl pl-1">🔍</span>
          <input
            className="flex-1 py-2 text-base font-bold outline-none bg-transparent"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="파티, 장소, 호스트 검색..."
            autoFocus
          />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setQuery("");
              }}
              className="text-slate-400 hover:text-slate-600 text-lg px-1"
              aria-label="검색어 지우기"
            >
              ×
            </button>
          )}
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 active:scale-95 transition-all shrink-0"
          >
            검색
          </button>
        </div>

        {query && (
          <p className="text-xs text-slate-500 font-mono mb-5">
            &quot;{query}&quot;에 대한 결과 {totalCount}건
          </p>
        )}

        {/* 탭 */}
        {query && (
          <div
            className="flex gap-1.5 mb-6 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map((tab) => {
              const on = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-4 py-2 text-sm font-bold rounded-full transition-colors ${
                    on
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 font-mono text-[10px] ${
                      on ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {tabCounts[tab.id]}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 결과 없음 */}
        {hasNoResults && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 grid place-items-center text-3xl mb-4 mx-auto">
              🔍
            </div>
            <p className="font-extrabold text-slate-900 mb-1">
              &quot;{query}&quot;에 대한 결과가 없어요
            </p>
            <p className="text-sm text-slate-400">
              다른 키워드로 검색하거나 아래 인기 검색어를 이용해보세요
            </p>
          </div>
        )}

        {/* 결과 섹션들 */}
        {query && !hasNoResults && (
          <div className="space-y-8">
            {/* 파티 결과 */}
            {showSection("party") && filteredParties.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-3">
                  <h2 className="text-lg font-extrabold">
                    파티{" "}
                    <span className="font-mono text-sm text-slate-400 ml-1">
                      {filteredParties.length}
                    </span>
                  </h2>
                  <button
                    onClick={() => setActiveTab("party")}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    더보기 →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {filteredParties.map((p) => (
                    <article
                      key={p.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="text-3xl mb-2">{p.icon}</div>
                      <p className="font-extrabold text-slate-900">
                        <Highlight text={p.title} query={query} />
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-1">{p.sub}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded-full font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          <Highlight text={p.host} query={query} />
                        </span>
                        <span className="font-extrabold tabular-nums text-orange-600">
                          {p.price === 0
                            ? "무료"
                            : `₩${(p.price / 1000).toFixed(0)}K`}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* 장소 결과 */}
            {showSection("place") && filteredPlaces.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-3">
                  <h2 className="text-lg font-extrabold">
                    장소{" "}
                    <span className="font-mono text-sm text-slate-400 ml-1">
                      {filteredPlaces.length}
                    </span>
                  </h2>
                  <button
                    onClick={() => setActiveTab("place")}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    더보기 →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredPlaces.map((p) => (
                    <article
                      key={p.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:border-orange-200 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-14 h-14 rounded-xl grid place-items-center text-2xl shrink-0"
                        style={{
                          background:
                            "repeating-linear-gradient(45deg, #fef3e8, #fef3e8 8px, #fed7aa 8px, #fed7aa 16px)",
                        }}
                      >
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">
                          <Highlight text={p.title} query={query} />
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          <Highlight text={p.sub} query={query} />
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                          #{p.tag}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* 호스트 결과 */}
            {showSection("host") && filteredHosts.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-3">
                  <h2 className="text-lg font-extrabold">
                    호스트{" "}
                    <span className="font-mono text-sm text-slate-400 ml-1">
                      {filteredHosts.length}
                    </span>
                  </h2>
                  <button
                    onClick={() => setActiveTab("host")}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    더보기 →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredHosts.map((h) => (
                    <article
                      key={h.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:border-orange-200 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${h.avatarBg} grid place-items-center text-white font-extrabold shrink-0`}
                      >
                        {h.initial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-extrabold text-slate-900">
                            <Highlight text={h.who} query={query} />
                          </p>
                          {h.superhost && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-bold">
                              슈퍼호스트
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          <Highlight text={h.sub} query={query} />
                        </p>
                      </div>
                      <button className="text-xs font-bold text-orange-600 hover:text-orange-700 shrink-0">
                        프로필 →
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 최근 검색어 + 실시간 인기 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">
              최근 검색어
            </p>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((kw) => (
                <button
                  key={kw}
                  onClick={() => clickRecent(kw)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center gap-1 hover:bg-slate-200 transition-colors"
                >
                  {kw}
                  <span
                    className="opacity-50 hover:opacity-100 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecent(kw);
                    }}
                  >
                    ×
                  </span>
                </button>
              ))}
              {recentSearches.length === 0 && (
                <p className="text-xs text-slate-400">최근 검색어가 없습니다</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">
              실시간 인기
            </p>
            <ol className="space-y-1.5">
              {TRENDING.map(({ rank, keyword, trend }) => (
                <li key={rank} className="flex items-center gap-3 text-sm">
                  <span className="font-mono w-4 font-extrabold text-orange-600">
                    {rank}
                  </span>
                  <button
                    className="flex-1 text-left hover:text-orange-600 transition-colors font-medium"
                    onClick={() => clickRecent(keyword)}
                  >
                    {keyword}
                  </button>
                  <span
                    className={`font-mono text-xs ${
                      trend === "↑"
                        ? "text-rose-500"
                        : trend === "↓"
                        ? "text-blue-500"
                        : "text-slate-400"
                    }`}
                  >
                    {trend}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
