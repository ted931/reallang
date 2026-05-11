import { notFound } from "next/navigation";
import Link from "next/link";
import { DUMMY_POSTS } from "@/lib/dummy-posts";

const CAT_COLOR: Record<string, string> = {
  "조황": "bg-teal-900/60 text-teal-300 border-teal-800",
  "자유": "bg-slate-800 text-slate-400 border-slate-700",
  "질문": "bg-blue-900/60 text-blue-300 border-blue-800",
  "장터": "bg-orange-900/60 text-orange-300 border-orange-800",
  "후기": "bg-purple-900/60 text-purple-300 border-purple-800",
};

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = DUMMY_POSTS.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/community" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 커뮤니티로</Link>

      <article className="rounded-2xl border border-ocean-800 bg-ocean-900 overflow-hidden mb-6">
        {/* 카테고리 + 제목 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] px-2 py-1 rounded-md border font-medium ${CAT_COLOR[post.category] ?? ""}`}>{post.category}</span>
            {post.isPinned && <span className="text-[10px] text-hook">📌 공지</span>}
          </div>
          <h1 className="text-lg font-bold text-slate-100 leading-snug mb-3">{post.title}</h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-400">{post.authorName}</span>
            <span>·</span>
            <span>{post.authorLevel}</span>
            {post.region && <><span>·</span><span className="text-ocean-400">{post.region}</span></>}
            <span className="ml-auto flex gap-3">
              <span>👁 {post.viewCount}</span>
              <span>♥ {post.likeCount}</span>
              <span>💬 {post.commentCount}</span>
            </span>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-5">
          <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-line">{post.content}</p>
        </div>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="px-5 py-3 border-t border-ocean-800">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-ocean-400">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* 좋아요 */}
        <div className="px-5 py-3 border-t border-ocean-800 flex justify-center">
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition-colors px-6 py-2 rounded-full border border-ocean-700 hover:border-rose-800">
            ♥ 좋아요 {post.likeCount}
          </button>
        </div>
      </article>

      {/* 댓글 */}
      <section>
        <h2 className="text-sm font-bold text-slate-300 mb-3">댓글 {post.commentCount}개</h2>
        <div className="space-y-3 mb-4">
          {["정보 감사합니다!", "저도 같은 포인트 자주 가요. 맞아요 맞아 ㅎㅎ", "혹시 미끼 브랜드 어디거 쓰셨어요?"].slice(0, Math.min(post.commentCount, 3)).map((comment, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-ocean-900 border border-ocean-800">
              <div className="w-7 h-7 rounded-full bg-ocean-700 flex items-center justify-center text-xs shrink-0">🎣</div>
              <div>
                <div className="text-xs text-ocean-400 mb-1">낚시인{i + 1}</div>
                <p className="text-sm text-slate-300">{comment}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 h-10 bg-ocean-800 border border-ocean-700 rounded-full px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="댓글을 입력하세요..." />
          <button className="h-10 px-4 bg-ocean-600 hover:bg-ocean-500 text-white rounded-full text-sm font-medium transition-colors">등록</button>
        </div>
      </section>
    </div>
  );
}
