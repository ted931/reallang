import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, CATEGORY_LABEL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "제주 여행 블로그 — 렌터카·카페패스·관광지 최신 정보",
  description: "제주 렌터카 가격 분석, 카페패스 추천 코스, 관광지 가이드까지. 데이터 기반 제주 여행 정보를 매주 업데이트합니다.",
  openGraph: {
    title: "제주 여행 블로그 — Kaflix",
    description: "렌터카 시세부터 카페패스 리뷰 분석까지, 데이터 기반 제주 여행 정보",
    type: "website",
    url: "https://realang.store/blog",
  },
  alternates: { canonical: "https://realang.store/blog" },
};

const CATEGORY_COLOR: Record<string, string> = {
  rental_car: "bg-blue-100 text-blue-700",
  cafepass:   "bg-amber-100 text-amber-700",
  attraction: "bg-green-100 text-green-700",
  review:     "bg-purple-100 text-purple-700",
  free:       "bg-gray-100 text-gray-600",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← realang.store
          </Link>
          <span className="text-xs font-semibold text-gray-400 tracking-wider">JEJU BLOG</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* 타이틀 */}
        <div className="mb-10">
          <p className="text-xs font-bold text-violet-600 tracking-widest mb-2">KAFLIX BLOG</p>
          <h1 className="text-3xl font-black text-gray-900 mb-3">제주 여행 정보</h1>
          <p className="text-gray-500 text-base">
            렌터카 시세 · 카페패스 리뷰 · 관광지 가이드 — 데이터 기반으로 매주 업데이트
          </p>
        </div>

        {/* 포스트 목록 */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLOR[post.category]}`}>
                    {CATEGORY_LABEL[post.category]}
                  </span>
                  <span className="text-xs text-gray-400">{post.publishedAt}</span>
                  {i === 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-600 rounded-full ml-auto">
                      ● 최신
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.summary}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {post.seoKeywords.slice(0, 3).map(kw => (
                    <span key={kw} className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-400 rounded border border-gray-100">
                      #{kw}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
