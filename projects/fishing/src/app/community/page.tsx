import Link from "next/link";
import { DUMMY_POSTS } from "@/lib/dummy-posts";
import { PostCategory } from "@/lib/types";

export const metadata = { title: "커뮤니티" };

const CAT_COLOR: Record<string, string> = {
  "조황": "bg-teal-900/60 text-teal-300 border-teal-800",
  "자유": "bg-slate-800 text-slate-400 border-slate-700",
  "질문": "bg-blue-900/60 text-blue-300 border-blue-800",
  "장터": "bg-orange-900/60 text-orange-300 border-orange-800",
  "후기": "bg-purple-900/60 text-purple-300 border-purple-800",
};

const CATEGORIES: Array<PostCategory | "전체"> = ["전체", "조황", "자유", "질문", "장터", "후기"];

export default function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-100 mb-1">💬 커뮤니티</h1>
        <p className="text-slate-400 text-sm">조황 · 자유 · 질문 · 장터 · 후기</p>
      </div>

      {/* 공지 */}
      <div className="rounded-xl border border-hook/30 bg-hook/5 p-3 mb-5 flex items-center gap-3">
        <span>📌</span>
        <div className="flex-1">
          <span className="text-xs text-hook font-bold">공지</span>
          <span className="text-xs text-slate-300 ml-2">낚시 안전 수칙 — 출조 전 해상 기상 꼭 확인하세요</span>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button key={cat} className="shrink-0 px-4 py-1.5 rounded-full text-sm border border-ocean-700 text-slate-400 hover:border-ocean-500 hover:text-slate-200 transition-colors bg-ocean-900">
            {cat}
          </button>
        ))}
      </div>

      {/* 글 목록 */}
      <div className="space-y-2">
        {DUMMY_POSTS.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-ocean-800 bg-ocean-900 hover:border-ocean-600 transition-colors">
              <span className={`text-[10px] px-2 py-1 rounded-md border shrink-0 mt-0.5 font-medium ${CAT_COLOR[post.category] ?? ""}`}>
                {post.category}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 line-clamp-1 mb-1">{post.title}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{post.authorName}</span>
                  <span>·</span>
                  <span>{post.authorLevel}</span>
                  {post.region && <><span>·</span><span className="text-ocean-400">{post.region}</span></>}
                  <span className="ml-auto flex gap-2">
                    <span>♥{post.likeCount}</span>
                    <span>💬{post.commentCount}</span>
                    <span>👁{post.viewCount}</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 글 작성 CTA */}
      <div className="mt-6 text-center">
        <button className="px-8 py-3 bg-ocean-700 hover:bg-ocean-600 text-white rounded-2xl font-bold transition-colors">
          ✏️ 글 작성하기
        </button>
      </div>
    </div>
  );
}
