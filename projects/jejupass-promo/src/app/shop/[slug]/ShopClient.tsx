'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { CATEGORY_MAP, REGION_MAP, DAYS_KR, BRAND } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { Shop, Review, VisitorPhoto } from '@/lib/types';
import dynamic from 'next/dynamic';

const KakaoMap = dynamic(() => import('@/components/KakaoMap'), { ssr: false });
import QRSection from '@/components/QRSection';

// ── 더미 파티 데이터 ──────────────────────────────────────────────
const DUMMY_PARTIES = [
  { id: 'p1', title: '성산 일출봉 트레킹 파티', category: 'hiking', currentMembers: 4, maxMembers: 8, date: '5/10(토)', location: '성산읍' },
  { id: 'p2', title: '협재 해변 서핑 입문 파티', category: 'surfing', currentMembers: 3, maxMembers: 6, date: '5/11(일)', location: '한림읍' },
  { id: 'p3', title: '애월 카페투어 파티', category: 'cafe', currentMembers: 5, maxMembers: 10, date: '5/12(월)', location: '애월읍' },
  { id: 'p4', title: '한라산 자전거 파티', category: 'cycling', currentMembers: 2, maxMembers: 6, date: '5/17(토)', location: '서귀포시' },
  { id: 'p5', title: '제주 로컬 쿠킹 클래스', category: 'cooking', currentMembers: 3, maxMembers: 8, date: '5/14(수)', location: '제주시' },
];

const CATEGORY_TO_PARTY: Record<string, string[]> = {
  cafe: ['cafe', 'cycling'], restaurant: ['cafe', 'cooking'], dessert: ['cafe', 'cooking'],
  bakery: ['cafe', 'cooking'], brunch: ['cafe', 'cooking'], bar: ['cafe', 'cycling'],
  activity: ['surfing', 'hiking', 'running'], rental: ['cycling', 'surfing'],
  stay: ['hiking', 'surfing'], etc: ['cafe', 'hiking'],
};

const PARTY_EMOJI: Record<string, string> = {
  hiking: '🥾', surfing: '🏄', cafe: '☕', cycling: '🚴', cooking: '👨‍🍳', running: '🏃',
};

type ShopTab = 'menu' | 'reviews' | 'info' | 'map';

// ── 별점 컴포넌트 ─────────────────────────────────────────────────
function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-xl transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          <span style={{ color: star <= (hovered || value) ? '#FBBF24' : '#D1D5DB' }}>★</span>
        </button>
      ))}
    </div>
  );
}

// ── 공유 버튼 ─────────────────────────────────────────────────────
function ShareButtons({ shopId }: { shopId: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); }
    catch { const ta = document.createElement('textarea'); ta.value = window.location.href; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex gap-2">
      <button onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
        🔗 {copied ? '복사됨!' : '링크 복사'}
      </button>
      <a href={`/dashboard/sns?shopId=${shopId}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors">
        📸 SNS 공유
      </a>
    </div>
  );
}

// ── 갤러리 이미지 그리드 ──────────────────────────────────────────
function GalleryGrid({ photos, shopName }: { photos: { id: string; url: string; isPrimary: boolean }[]; shopName: string }) {
  const placeholderStyle = {
    background: 'repeating-linear-gradient(45deg,#e0e7ff,#e0e7ff 8px,#c7d2fe 8px,#c7d2fe 16px)',
  };
  const slots = Array.from({ length: 5 }, (_, i) => photos[i] ?? null);

  return (
    <div className="grid grid-cols-4 gap-1 h-[300px] sm:h-[360px]">
      {/* 대표 이미지 — 2×2 */}
      <div className="col-span-2 row-span-2 relative overflow-hidden">
        {slots[0] ? (
          <img src={slots[0].url} alt={shopName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center" style={placeholderStyle}>
            <span className="text-5xl opacity-30">☕</span>
          </div>
        )}
      </div>
      {/* 우측 4칸 */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="relative overflow-hidden">
          {slots[i] ? (
            <img src={slots[i]!.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={placeholderStyle} />
          )}
          {i === 4 && photos.length > 5 && (
            <button className="absolute inset-0 bg-black/50 grid place-items-center text-white text-xs font-extrabold">
              +{photos.length - 4}장 더
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────
export default function ShopClient({ params, initialShop }: { params: Promise<{ slug: string }>; initialShop: Shop | null }) {
  const [shop, setShop] = useState<Shop | null>(initialShop);
  const [loading, setLoading] = useState(initialShop === null);
  const [slug, setSlug] = useState('');
  const [activeTab, setActiveTab] = useState<ShopTab>('menu');

  // 사진 업로드
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoNickname, setPhotoNickname] = useState('');
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // 리뷰
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewNickname, setReviewNickname] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    params.then(({ slug: s }) => {
      setSlug(s);
      if (initialShop !== null) {
        if (initialShop.id) {
          fetch(`${basePath}/api/shops/${initialShop.id}/view`, { method: 'POST' }).catch(() => {});
        }
        setLoading(false);
        return;
      }
      fetch(`${basePath}/api/shops/slug/${encodeURIComponent(s)}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          setShop(data?.shop ?? null);
          if (data?.shop?.id) {
            fetch(`${basePath}/api/shops/${data.shop.id}/view`, { method: 'POST' }).catch(() => {});
          }
        })
        .finally(() => setLoading(false));
    });
  }, [params]);

  const refreshShop = () => {
    if (!slug) return;
    fetch(`${basePath}/api/shops/slug/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => setShop(data?.shop ?? null));
  };

  const handlePhotoUpload = async (file: File) => {
    if (!shop) return;
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('nickname', photoNickname || '방문객');
    await fetch(`${basePath}/api/shops/${shop.id}/visitor-photos`, { method: 'POST', body: formData });
    setPhotoUploading(false);
    setShowPhotoForm(false);
    setPhotoNickname('');
    refreshShop();
  };

  const handleReviewSubmit = async () => {
    if (!shop || !reviewRating || !reviewComment.trim()) return;
    setReviewSubmitting(true);
    await fetch(`${basePath}/api/shops/${shop.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: reviewRating, comment: reviewComment, nickname: reviewNickname }),
    });
    setReviewSubmitting(false);
    setReviewRating(0);
    setReviewComment('');
    setReviewNickname('');
    setShowReviewForm(false);
    refreshShop();
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!shop) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
      <p className="text-slate-500">가게를 찾을 수 없습니다.</p>
      <Link href="/explore" className="text-sm font-medium" style={{ color: BRAND.color }}>탐색으로 돌아가기</Link>
    </div>
  );

  const categoryLabel = CATEGORY_MAP[shop.category] || shop.category;
  const regionLabel = REGION_MAP[shop.region] || shop.region;
  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  const todayHours = shop.businessHours[todayKey];
  const isOpen = todayHours && todayHours !== '휴무';
  const partyCategories = CATEGORY_TO_PARTY[shop.category] ?? [];
  const matchedParties = DUMMY_PARTIES.filter((p) => partyCategories.includes(p.category)).slice(0, 2);
  const allPhotos = [
    ...shop.photos.map((p) => ({ ...p, type: 'owner' as const })),
    ...(shop.visitorPhotos ?? []).map((p) => ({ id: p.id, url: p.url, isPrimary: false, type: 'visitor' as const, nickname: p.nickname })),
  ];
  const reviews = shop.reviews ?? [];
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  // 별점 분포
  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter((r) => r.rating === s).length / reviews.length) * 100) : 0,
  }));

  const shopJsonLd = {
    "@context": "https://schema.org",
    "@type": shop.category === 'cafe' ? 'CafeOrCoffeeShop' : shop.category === 'restaurant' ? 'Restaurant' : 'LocalBusiness',
    name: shop.name, description: shop.description,
    address: { "@type": "PostalAddress", streetAddress: shop.address, addressLocality: shop.region === 'seogwipo' ? '서귀포시' : '제주시', addressRegion: "제주특별자치도", addressCountry: "KR" },
    telephone: shop.phone || undefined,
    aggregateRating: reviews.length > 0 ? { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: reviews.length } : undefined,
    url: `https://jejupass.com/web/shop/${shop.slug}`,
  };

  const TABS: { id: ShopTab; label: string }[] = [
    { id: 'menu', label: '메뉴' },
    { id: 'reviews', label: `리뷰${reviews.length > 0 ? ` ${reviews.length.toLocaleString()}` : ''}` },
    { id: 'info', label: '정보' },
    { id: 'map', label: '지도' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(shopJsonLd) }} />

      {/* 갤러리 그리드 */}
      <GalleryGrid photos={shop.photos} shopName={shop.name} />

      {/* 본문 레이아웃 */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* ── 왼쪽 메인 컬럼 ── */}
        <div>
          {/* 가게 헤더 */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="inline-block text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                {shop.category.toUpperCase()} · {categoryLabel}
              </span>
              <h1 className="text-3xl font-black text-slate-900 mt-2">{shop.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                {reviews.length > 0 && (
                  <>
                    <span className="text-amber-500 font-bold">
                      ★ {avgRating.toFixed(1)}{' '}
                      <span className="text-slate-500 font-normal">({reviews.length.toLocaleString()})</span>
                    </span>
                    <span className="text-slate-300">·</span>
                  </>
                )}
                <span className={`font-bold ${isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isOpen ? '● 영업 중' : '● 휴무'}
                </span>
                {isOpen && todayHours && <span className="text-slate-500">~ {todayHours.split('-')[1]}</span>}
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">{regionLabel}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                aria-label="저장"
                className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:text-rose-500 transition-colors shadow-sm"
              >
                ♥
              </button>
              <button
                aria-label="공유"
                onClick={async () => {
                  try { await navigator.clipboard.writeText(window.location.href); alert('링크가 복사되었습니다.'); }
                  catch { /* ignore */ }
                }}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-500 hover:text-orange-500 transition-colors shadow-sm"
              >
                ↗
              </button>
            </div>
          </div>

          {/* 한 줄 소개 */}
          {shop.description && (
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">{shop.description}</p>
          )}

          {/* 해시태그 */}
          {shop.menus && shop.menus.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {shop.menus.slice(0, 5).map((m) => (
                <span key={m.id} className="text-[11px] font-mono px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  #{m.name.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}

          {/* 공지 */}
          {shop.notices && shop.notices.length > 0 && (
            <div className="mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50">
              <p className="text-xs font-bold text-amber-700 mb-1">📢 사장님 공지</p>
              <p className="text-sm text-amber-900 leading-relaxed">
                {[...shop.notices].reverse()[0].content}
              </p>
            </div>
          )}

          {/* 탭 */}
          <div className="mt-6 border-b border-slate-200 flex gap-6">
            {TABS.map((tab) => {
              const on = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
                    on ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── 탭 콘텐츠 ── */}
          <div className="mt-5">

            {/* 메뉴 탭 */}
            {activeTab === 'menu' && (
              <div>
                {shop.menus.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">등록된 메뉴가 없어요</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {shop.menus.map((menu) => (
                      <div key={menu.id} className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                        {menu.photoUrl ? (
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <img src={menu.photoUrl} alt={menu.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div
                            className="w-14 h-14 rounded-lg shrink-0 grid place-items-center text-xl"
                            style={{ background: 'repeating-linear-gradient(45deg,#e0e7ff,#e0e7ff 8px,#c7d2fe 8px,#c7d2fe 16px)' }}
                          >
                            <span className="opacity-40">🍽️</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {menu.isPopular && (
                              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full shrink-0">인기</span>
                            )}
                            <p className="font-extrabold text-slate-900 text-sm truncate">{menu.name}</p>
                          </div>
                          {menu.description && <p className="text-[11px] text-slate-500 truncate">{menu.description}</p>}
                        </div>
                        <p className="font-extrabold tabular-nums text-slate-900 shrink-0">{formatPrice(menu.price)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
                {/* 별점 요약 */}
                {reviews.length > 0 && (
                  <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm self-start">
                    <p className="text-4xl font-black text-slate-900">{avgRating.toFixed(1)}</p>
                    <p className="text-amber-400 text-sm mt-0.5">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</p>
                    <div className="mt-3 space-y-1.5 text-xs">
                      {ratingDist.map(({ star, pct }) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-3 font-mono text-slate-500">{star}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono text-slate-500">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </aside>
                )}

                {/* 리뷰 목록 + 작성 */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ borderColor: BRAND.color, color: BRAND.color }}
                  >
                    ✏️ 리뷰 쓰기
                  </button>

                  {showReviewForm && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">별점</p>
                        <StarRating value={reviewRating} onChange={setReviewRating} />
                      </div>
                      <input
                        type="text" value={reviewNickname} onChange={(e) => setReviewNickname(e.target.value)}
                        placeholder="닉네임 (선택, 기본: 방문객)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-300"
                      />
                      <textarea
                        value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="방문 후기를 남겨주세요" rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-300 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setShowReviewForm(false)}
                          className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600">취소</button>
                        <button onClick={handleReviewSubmit}
                          disabled={reviewSubmitting || !reviewRating || !reviewComment.trim()}
                          className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                          style={{ backgroundColor: BRAND.color }}>
                          {reviewSubmitting ? '등록 중...' : '리뷰 등록'}
                        </button>
                      </div>
                    </div>
                  )}

                  {reviews.length > 0 ? (
                    [...reviews].reverse().map((review) => (
                      <article key={review.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                              {review.nickname.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{review.nickname}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                          </div>
                          <StarRating value={review.rating} readonly />
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>
                        {review.photoUrl && (
                          <div className="mt-2 h-32 rounded-lg overflow-hidden bg-slate-100">
                            <img src={review.photoUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                      <p className="text-sm text-slate-400">아직 리뷰가 없어요</p>
                      <p className="text-xs text-slate-300 mt-1">첫 번째 리뷰를 남겨보세요</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 정보 탭 */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { ic: '📞', label: '전화', value: shop.phone || '—', href: shop.phone ? `tel:${shop.phone}` : undefined },
                  { ic: '📍', label: '주소', value: shop.address },
                  { ic: '🕐', label: '오늘 영업시간', value: todayHours || '—' },
                  { ic: '📅', label: '영업일', value: Object.entries(shop.businessHours).filter(([, v]) => v !== '휴무').length + '일 운영' },
                ].map(({ ic, label, value, href }) => (
                  <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 shadow-sm">
                    <div className="text-xl shrink-0">{ic}</div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{label}</p>
                      {href ? (
                        <a href={href} className="font-bold text-slate-900 text-sm hover:text-orange-500 transition-colors">{value}</a>
                      ) : (
                        <p className="font-bold text-slate-900 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* 전체 영업시간 */}
                <div className="col-span-1 sm:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">전체 영업시간</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    {Object.entries(shop.businessHours).map(([day, hours]) => (
                      <div key={day}
                        className={`flex justify-between px-3 py-1.5 rounded-lg ${day === todayKey ? 'bg-orange-50 font-bold text-orange-700' : 'bg-slate-50 text-slate-700'}`}>
                        <span>{DAYS_KR[day] || day}</span>
                        <span className={hours === '휴무' ? 'text-red-400' : ''}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 방문 사진 업로드 */}
                <div className="col-span-1 sm:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">방문 사진</p>
                    <button
                      onClick={() => setShowPhotoForm(!showPhotoForm)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                      style={{ backgroundColor: BRAND.color }}
                    >
                      📷 사진 올리기
                    </button>
                  </div>
                  {showPhotoForm && (
                    <div className="mb-4 space-y-3">
                      <input type="text" value={photoNickname} onChange={(e) => setPhotoNickname(e.target.value)}
                        placeholder="닉네임 (선택)" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-300" />
                      <input ref={photoInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhotoUpload(file); }} />
                      <button onClick={() => photoInputRef.current?.click()} disabled={photoUploading}
                        className="w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-colors disabled:opacity-50"
                        style={{ borderColor: BRAND.color, color: BRAND.color }}>
                        {photoUploading ? '업로드 중...' : '📷 사진 선택 / 촬영'}
                      </button>
                    </div>
                  )}
                  {allPhotos.length > 0 && (
                    <div className="grid grid-cols-4 gap-1.5">
                      {allPhotos.slice(0, 8).map((photo) => (
                        <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                          <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 지도 탭 */}
            {activeTab === 'map' && (
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <KakaoMap address={shop.address} name={shop.name} />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">주소</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{shop.address}</p>
                  </div>
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(shop.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-extrabold text-white shadow-sm"
                    style={{ backgroundColor: BRAND.color }}
                  >
                    길찾기 →
                  </a>
                </div>
                <QRSection shopId={shop.id} shopName={shop.name} />
              </div>
            )}
          </div>

          {/* 파티 */}
          {matchedParties.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-extrabold text-slate-900">🎉 이 가게 들르는 여행 파티</h2>
                <a href="http://localhost:3010" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium hover:underline" style={{ color: BRAND.color }}>
                  더 보기 →
                </a>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                {matchedParties.map((party) => (
                  <div key={party.id}
                    onClick={() => window.open(`http://localhost:3010/party/${party.id}`, '_blank')}
                    className="min-w-[180px] bg-white rounded-xl border border-slate-100 shadow-sm p-3 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all shrink-0">
                    <div className="text-2xl mb-2">{PARTY_EMOJI[party.category] ?? '🎉'}</div>
                    <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{party.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{party.date} · {party.location}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(party.currentMembers / party.maxMembers) * 100}%`, backgroundColor: BRAND.color }} />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{party.currentMembers}/{party.maxMembers}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 렌트카 CTA */}
          <div className="mt-8 rounded-xl overflow-hidden border border-orange-100">
            <div className="p-5 text-center" style={{ backgroundColor: BRAND.colorLight }}>
              <p className="text-sm font-extrabold text-slate-800">이 가게, 렌트카로 더 편하게 가세요</p>
              <p className="text-xs text-slate-500 mt-0.5">제주패스에서 렌트카 최저가를 비교해보세요</p>
              <a href="https://www.jejupass.com" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: BRAND.color }}>
                🚗 렌트카 최저가 비교하기
              </a>
            </div>
          </div>
        </div>

        {/* ── 오른쪽 사이드바 ── */}
        <aside className="hidden lg:block">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-20 shadow-sm space-y-4">
            {/* 지도 미니 */}
            <div className="h-44 rounded-xl overflow-hidden border border-slate-100">
              <KakaoMap address={shop.address} name={shop.name} />
            </div>

            {/* 길찾기 버튼 */}
            <a
              href={`https://map.kakao.com/link/search/${encodeURIComponent(shop.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-white text-sm font-extrabold rounded-xl text-center shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: BRAND.color }}
            >
              길찾기 →
            </a>

            {/* 보조 액션 */}
            <div className="grid grid-cols-3 gap-1">
              {shop.phone && (
                <a href={`tel:${shop.phone}`}
                  className="py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-700 text-center hover:bg-slate-50 transition-colors">
                  전화
                </a>
              )}
              <button
                onClick={async () => {
                  try { await navigator.clipboard.writeText(window.location.href); }
                  catch { /* ignore */ }
                }}
                className="py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
              >
                공유
              </button>
              <a href={`/dashboard/sns?shopId=${shop.id}`}
                className="py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-700 text-center hover:bg-slate-50 transition-colors">
                SNS
              </a>
            </div>

            {/* 영업 상태 */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">오늘 영업</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  {isOpen ? '영업 중' : '휴무'}
                </span>
                {isOpen && todayHours && (
                  <span className="text-xs text-slate-500">{todayHours}</span>
                )}
              </div>
            </div>

            {/* 리뷰 요약 */}
            {reviews.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">리뷰</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">{avgRating.toFixed(1)}</span>
                  <div>
                    <p className="text-amber-400 text-xs">{'★'.repeat(Math.round(avgRating))}</p>
                    <p className="text-[10px] text-slate-400">{reviews.length}개</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── 모바일 고정 하단 액션 바 ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex gap-2 shadow-lg">
        {shop.phone && (
          <a
            href={`tel:${shop.phone}`}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 text-center"
          >
            📞 전화
          </a>
        )}
        <a
          href={`https://map.kakao.com/link/search/${encodeURIComponent(shop.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-xl text-white text-sm font-extrabold text-center"
          style={{ backgroundColor: BRAND.color }}
        >
          길찾기 →
        </a>
      </div>
    </div>
  );
}
