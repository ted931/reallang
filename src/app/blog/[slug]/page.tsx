import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, CATEGORY_LABEL } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    keywords: post.seoKeywords,
    authors: [{ name: "Kaflix", url: "https://realang.store" }],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `https://realang.store/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      images: post.ogImage ? [{ url: post.ogImage, width: 1200, height: 630 }] : [],
      tags: post.seoKeywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.ogImage ? [post.ogImage] : [],
    },
    alternates: { canonical: `https://realang.store/blog/${post.slug}` },
  };
}

const CATEGORY_COLOR: Record<string, string> = {
  rental_car: "bg-blue-100 text-blue-700",
  cafepass:   "bg-amber-100 text-amber-700",
  attraction: "bg-green-100 text-green-700",
  review:     "bg-purple-100 text-purple-700",
  free:       "bg-gray-100 text-gray-600",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://realang.store/blog/${post.slug}`,
        headline: post.title,
        description: post.summary,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: { "@type": "Organization", name: "Kaflix", url: "https://realang.store" },
        publisher: {
          "@type": "Organization",
          name: "Kaflix",
          url: "https://realang.store",
          logo: { "@type": "ImageObject", url: "https://realang.store/icon.png" },
        },
        image: post.ogImage ? { "@type": "ImageObject", url: post.ogImage } : undefined,
        keywords: post.seoKeywords.join(", "),
        inLanguage: "ko-KR",
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://realang.store/blog/${post.slug}` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: "https://realang.store" },
          { "@type": "ListItem", position: 2, name: "블로그", item: "https://realang.store/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: `https://realang.store/blog/${post.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* ── 헤더 ── */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← 블로그 목록
            </Link>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLOR[post.category]}`}>
              {CATEGORY_LABEL[post.category]}
            </span>
          </div>
        </header>

        {/* ── OG 이미지 ── */}
        {post.ogImage && (
          <div className="w-full h-48 sm:h-64 overflow-hidden">
            <img src={post.ogImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <main className="max-w-3xl mx-auto px-6 py-10">
          {/* 메타 */}
          <div className="flex items-center gap-3 mb-5">
            <time className="text-xs text-gray-400 font-medium">{post.publishedAt}</time>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">Kaflix</span>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* 요약 */}
          <p className="text-gray-500 text-base leading-relaxed mb-8 pb-8 border-b border-gray-100">
            {post.summary}
          </p>

          {/* 본문 섹션 */}
          <div className="space-y-8">
            {post.sections.map((sec, i) => (
              <section key={i}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">{sec.heading}</h2>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {sec.body}
                </div>
              </section>
            ))}
          </div>

          {/* SEO 키워드 태그 */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">관련 키워드</p>
            <div className="flex flex-wrap gap-2">
              {post.seoKeywords.map(kw => (
                <span key={kw} className="text-xs px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded-full">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl text-white">
            <p className="font-bold text-base mb-1">이 글이 도움이 됐다면</p>
            <p className="text-white/75 text-sm mb-4">AI 코스 메이커로 나만의 제주 여행 코스를 만들어보세요</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/course/" className="px-4 py-2 bg-white text-violet-600 rounded-lg text-sm font-bold hover:bg-violet-50 transition-colors">
                AI 코스 만들기 →
              </Link>
              <Link href="/travel-pick/" className="px-4 py-2 bg-white/15 text-white rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20">
                내 여행 성향 찾기
              </Link>
            </div>
          </div>

          {/* 다른 글 보기 */}
          <div className="mt-8">
            <Link href="/blog" className="text-sm text-violet-600 font-semibold hover:underline">
              ← 다른 블로그 글 보기
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
