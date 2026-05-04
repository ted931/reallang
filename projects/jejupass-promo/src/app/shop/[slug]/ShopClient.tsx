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

// ── 별점 컴포넌트 ─────────────────────────────────────────────────
function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
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
    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
      <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
        🔗 {copied ? '복사됨!' : '링크 복사'}
      </button>
      <a href={`/dashboard/sns?shopId=${shopId}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors">
        📸 SNS 공유
      </a>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────
export default function ShopClient({ params, initialShop }: { params: Promise<{ slug: string }>; initialShop: Shop | null }) {
  const [shop, setShop] = useState<Shop | null>(initialShop);
  const [loading, setLoading] = useState(initialShop === null);
  const [slug, setSlug] = useState('');

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
        // 조회수 카운트 (비동기, 결과 무시)
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

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400 text-sm">불러오는 중...</div></div>;
  if (!shop) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
      <p className="text-gray-500">가게를 찾을 수 없습니다.</p>
      <Link href="/explore" className="text-sm" style={{ color: BRAND.color }}>탐색으로 돌아가기</Link>
    </div>
  );

  const categoryLabel = CATEGORY_MAP[shop.category] || shop.category;
  const regionLabel = REGION_MAP[shop.region] || shop.region;
  const primaryPhoto = shop.photos.find((p) => p.isPrimary) || shop.photos[0];
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

  const shopJsonLd = {
    "@context": "https://schema.org",
    "@type": shop.category === 'cafe' ? 'CafeOrCoffeeShop' : shop.category === 'restaurant' ? 'Restaurant' : 'LocalBusiness',
    name: shop.name, description: shop.description,
    address: { "@type": "PostalAddress", streetAddress: shop.address, addressLocality: shop.region === 'seogwipo' ? '서귀포시' : '제주시', addressRegion: "제주특별자치도", addressCountry: "KR" },
    telephone: shop.phone || undefined,
    aggregateRating: reviews.length > 0 ? { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: reviews.length } : undefined,
    url: `https://jejupass.com/web/shop/${shop.slug}`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(shopJsonLd) }} />

      {/* Hero */}
      <div className="relative bg-gray-200 h-64 sm:h-80">
        {primaryPhoto ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${primaryPhoto.url})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
            <span className="text-6xl">{categoryLabel === '카페' ? '☕' : '🍽️'}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Link href="/explore" className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur text-white text-xs font-medium hover:bg-black/50 transition-colors">
            ← 목록
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur rounded text-xs font-medium mb-2">
              {categoryLabel} · {regionLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold">{shop.name}</h1>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-white/70 text-xs">({reviews.length}개 리뷰)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20">
        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm -mt-4 relative z-10 p-5 space-y-3">
          {shop.description && <p className="text-sm text-gray-600 leading-relaxed">{shop.description}</p>}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-5 text-center">📍</span>
              <span className="text-gray-700 flex-1">{shop.address}</span>
              <a href={`https://map.kakao.com/link/search/${encodeURIComponent(shop.address)}`} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">
                지도보기
              </a>
            </div>
            {shop.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-5 text-center">📞</span>
                <a href={`tel:${shop.phone}`} className="text-blue-600 hover:underline">{shop.phone}</a>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-5 text-center">🕐</span>
              <div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isOpen ? '영업중' : '휴무'}
                </span>
                {todayHours && todayHours !== '휴무' && <span className="text-gray-500 ml-2">{todayHours}</span>}
              </div>
            </div>
          </div>
          <details className="text-sm">
            <summary className="text-gray-500 cursor-pointer hover:text-gray-700">전체 영업시간 보기</summary>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {Object.entries(shop.businessHours).map(([day, hours]) => (
                <div key={day} className={`flex justify-between px-2 py-1 rounded ${day === todayKey ? 'bg-orange-50 font-medium' : ''}`}>
                  <span className="text-gray-500">{DAYS_KR[day] || day}</span>
                  <span className={hours === '휴무' ? 'text-red-400' : 'text-gray-700'}>{hours}</span>
                </div>
              ))}
            </div>
          </details>
          <ShareButtons shopId={shop.id} />
        </div>

        {/* 공지사항 */}
        {shop.notices && shop.notices.length > 0 && (
          <div className="mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50">
            <p className="text-xs font-bold text-amber-700 mb-2">📢 사장님 공지</p>
            {[...shop.notices].reverse().slice(0, 1).map((notice) => (
              <div key={notice.id}>
                <p className="text-sm text-amber-900 leading-relaxed">{notice.content}</p>
                <p className="text-[10px] text-amber-500 mt-1">
                  {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 지도 */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">위치</h2>
          <KakaoMap address={shop.address} name={shop.name} />
          <p className="text-xs text-gray-400 mt-1.5 text-center">{shop.address}</p>
        </div>

        {/* 사진 */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              사진 <span className="text-base font-normal text-gray-400">{allPhotos.length}</span>
            </h2>
            <button
              onClick={() => setShowPhotoForm(!showPhotoForm)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND.color }}
            >
              📷 사진 올리기
            </button>
          </div>

          {/* 사진 업로드 폼 */}
          {showPhotoForm && (
            <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 space-y-3">
              <p className="text-sm font-medium text-gray-700">방문 사진을 공유해주세요</p>
              <input
                type="text"
                value={photoNickname}
                onChange={(e) => setPhotoNickname(e.target.value)}
                placeholder="닉네임 (선택, 기본: 방문객)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-300"
              />
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }}
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={photoUploading}
                className="w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-colors disabled:opacity-50"
                style={{ borderColor: BRAND.color, color: BRAND.color }}
              >
                {photoUploading ? '업로드 중...' : '📷 사진 선택 / 촬영'}
              </button>
            </div>
          )}

          {/* 사진 그리드 */}
          {allPhotos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {allPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                  <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${photo.url})` }} />
                  {photo.type === 'visitor' && (
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white">
                      {(photo as any).nickname || '방문객'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">아직 사진이 없어요</p>
              <p className="text-xs text-gray-300 mt-1">첫 번째 사진을 올려보세요</p>
            </div>
          )}
        </div>

        {/* 메뉴 */}
        {shop.menus.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">메뉴</h2>
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              {shop.menus.map((menu) => (
                <div key={menu.id} className="flex items-center gap-3 px-4 py-3">
                  {menu.photoUrl && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${menu.photoUrl})` }} />
                    </div>
                  )}
                  <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {menu.isPopular && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded shrink-0">인기</span>}
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-gray-800 block truncate">{menu.name}</span>
                        {menu.description && <span className="text-xs text-gray-400 block truncate">{menu.description}</span>}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 shrink-0">{formatPrice(menu.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 리뷰 */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">리뷰</h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-semibold text-gray-800">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({reviews.length})</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
              style={{ borderColor: BRAND.color, color: BRAND.color }}
            >
              ✏️ 리뷰 쓰기
            </button>
          </div>

          {/* 리뷰 작성 폼 */}
          {showReviewForm && (
            <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">별점</p>
                <StarRating value={reviewRating} onChange={setReviewRating} />
              </div>
              <input
                type="text"
                value={reviewNickname}
                onChange={(e) => setReviewNickname(e.target.value)}
                placeholder="닉네임 (선택, 기본: 방문객)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-300"
              />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="방문 후기를 남겨주세요"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-300 resize-none"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowReviewForm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600">취소</button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewSubmitting || !reviewRating || !reviewComment.trim()}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: BRAND.color }}
                >
                  {reviewSubmitting ? '등록 중...' : '리뷰 등록'}
                </button>
              </div>
            </div>
          )}

          {/* 리뷰 목록 */}
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {[...reviews].reverse().map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                        {review.nickname.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{review.nickname}</p>
                        <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('ko-KR')}</p>
                      </div>
                    </div>
                    <StarRating value={review.rating} readonly />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  {review.photoUrl && (
                    <div className="mt-2 h-32 rounded-lg overflow-hidden bg-gray-100">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${review.photoUrl})` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">아직 리뷰가 없어요</p>
              <p className="text-xs text-gray-300 mt-1">첫 번째 리뷰를 남겨보세요</p>
            </div>
          )}
        </div>

        {/* 파티 */}
        {matchedParties.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">🎉 이 가게 들르는 여행 파티</h2>
              <a href="http://localhost:3010" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline" style={{ color: BRAND.color }}>
                더 보기 →
              </a>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {matchedParties.map((party) => (
                <div key={party.id} onClick={() => window.open(`http://localhost:3010/party/${party.id}`, '_blank')}
                  className="min-w-[180px] bg-white rounded-xl border border-gray-100 shadow-sm p-3 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all flex-shrink-0">
                  <div className="text-2xl mb-2">{PARTY_EMOJI[party.category] ?? '🎉'}</div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{party.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{party.date} · {party.location}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(party.currentMembers / party.maxMembers) * 100}%`, backgroundColor: BRAND.color }} />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">{party.currentMembers}/{party.maxMembers}명</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR 코드 */}
        <QRSection shopId={shop.id} shopName={shop.name} />

        {/* 렌트카 CTA */}
        <div className="mt-8 rounded-xl overflow-hidden border border-orange-100">
          <div className="p-4 text-center" style={{ backgroundColor: BRAND.colorLight }}>
            <p className="text-sm font-bold text-gray-800">이 가게, 렌트카로 더 편하게 가세요</p>
            <p className="text-xs text-gray-500 mt-0.5">제주패스에서 렌트카 최저가를 비교해보세요</p>
            <a
              href="https://www.jejupass.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND.color }}
            >
              🚗 렌트카 최저가 비교하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
