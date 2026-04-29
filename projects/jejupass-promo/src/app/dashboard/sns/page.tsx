'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import type { Shop } from '@/lib/types';

type TemplateType = 'instagram-square' | 'instagram-story' | 'kakao' | 'cafepass-card';

const TEMPLATES: { value: TemplateType; label: string; size: string; desc: string }[] = [
  { value: 'instagram-square', label: '인스타 피드', size: '1080×1080', desc: '정사각형 피드 게시물' },
  { value: 'instagram-story', label: '인스타 스토리', size: '1080×1920', desc: '세로형 스토리' },
  { value: 'kakao', label: '카카오톡', size: '800×400', desc: '카카오톡 공유 카드' },
  { value: 'cafepass-card', label: '카페패스 카드', size: '1080×720', desc: '카페패스 입점용 표준 카드' },
];

// ─── 품질 점수 계산 ───
function calcQualityScore(params: {
  hasPhoto: boolean;
  captionLength: number;
  hashtagCount: number;
  menuCount: number;
  descriptionLength: number;
}): { score: number; breakdown: { label: string; earned: number; max: number; met: boolean }[] } {
  const breakdown = [
    { label: '사진 업로드', earned: params.hasPhoto ? 40 : 0, max: 40, met: params.hasPhoto },
    { label: '캡션 50자 이상', earned: params.captionLength >= 50 ? 20 : 0, max: 20, met: params.captionLength >= 50 },
    { label: '해시태그 포함', earned: params.hashtagCount > 0 ? 15 : 0, max: 15, met: params.hashtagCount > 0 },
    { label: '메뉴 3개 이상', earned: params.menuCount >= 3 ? 15 : 0, max: 15, met: params.menuCount >= 3 },
    { label: '가게 설명 100자 이상', earned: params.descriptionLength >= 100 ? 10 : 0, max: 10, met: params.descriptionLength >= 100 },
  ];
  const score = breakdown.reduce((s, b) => s + b.earned, 0);
  return { score, breakdown };
}

function getGrade(score: number): { emoji: string; text: string; color: string; bgColor: string; borderColor: string } {
  if (score >= 90) return { emoji: '🌟', text: '카페패스 입점 추천', color: '#15803d', bgColor: '#f0fdf4', borderColor: '#bbf7d0' };
  if (score >= 70) return { emoji: '✅', text: '양호 — 입점 신청 가능', color: '#1d4ed8', bgColor: '#eff6ff', borderColor: '#bfdbfe' };
  if (score >= 50) return { emoji: '⚠️', text: '보통 — 사진 품질 개선 권장', color: '#92400e', bgColor: '#fffbeb', borderColor: '#fde68a' };
  return { emoji: '📝', text: '부족 — 가이드를 참고하세요', color: '#b91c1c', bgColor: '#fef2f2', borderColor: '#fecaca' };
}

// ─── 품질 가이드 배너 ───
function PhotoGuideBanner() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📸</span>
          <span className="font-semibold text-amber-900 text-sm">카페패스 품질 기준에 맞는 사진 가이드</span>
        </div>
        <span className="text-amber-600 text-lg leading-none select-none">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <ul className="space-y-2.5 mb-4">
            {[
              '밝은 자연광 활용 — 창가 또는 오전 10시~오후 2시 촬영 권장',
              '세로 비율 4:3 또는 1:1 — 가로가 너무 긴 사진은 잘림',
              '배경 정리 — 손님이나 잡동사니 없는 깔끔한 배경',
              '음료/음식이 주인공 — 메뉴가 중앙에, 테이블 소품은 최소화',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="mt-0.5 shrink-0">✅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-amber-200 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-amber-700 leading-relaxed">
              이 기준으로 찍은 사진으로 카드를 만들면 <strong>카페패스 입점 심사에서 유리합니다.</strong>
            </p>
            <Link
              href="/dashboard/cafepass"
              className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: BRAND.color }}
            >
              카페패스 입점 신청
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 품질 점수 패널 ───
function QualityScorePanel({
  hasPhoto,
  captionLength,
  hashtagCount,
  menuCount,
  descriptionLength,
}: {
  hasPhoto: boolean;
  captionLength: number;
  hashtagCount: number;
  menuCount: number;
  descriptionLength: number;
}) {
  const { score, breakdown } = calcQualityScore({ hasPhoto, captionLength, hashtagCount, menuCount, descriptionLength });
  const grade = getGrade(score);
  const missing = breakdown.filter((b) => !b.met);

  return (
    <div
      className="mt-4 rounded-xl border p-4"
      style={{ backgroundColor: grade.bgColor, borderColor: grade.borderColor }}
    >
      {/* 점수 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">카페패스 품질 점수</p>
          <div className="flex items-center gap-1.5">
            <span className="text-base">{grade.emoji}</span>
            <span className="text-sm font-semibold" style={{ color: grade.color }}>{grade.text}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold" style={{ color: grade.color }}>{score}</span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
      </div>

      {/* 점수 바 */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: score >= 70 ? (score >= 90 ? '#15803d' : '#1d4ed8') : (score >= 50 ? '#d97706' : '#dc2626'),
          }}
        />
      </div>

      {/* 항목별 상태 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {breakdown.map((b) => (
          <span
            key={b.label}
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: b.met ? '#dcfce7' : '#f3f4f6',
              color: b.met ? '#15803d' : '#9ca3af',
            }}
          >
            {b.met ? '✓' : '+'} {b.label} (+{b.max}점)
          </span>
        ))}
      </div>

      {/* 개선 팁 (점수 70 미만) */}
      {score < 70 && missing.length > 0 && (
        <div className="border-t pt-3" style={{ borderColor: grade.borderColor }}>
          <p className="text-xs font-semibold text-gray-600 mb-1.5">개선하면 점수가 오릅니다</p>
          <ul className="space-y-1">
            {missing.map((b) => (
              <li key={b.label} className="text-xs text-gray-600 flex items-center gap-1">
                <span className="text-orange-400">→</span>
                <span>{b.label} 충족 시 <strong>+{b.max}점</strong></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── SEO 고정 태그 (항상 포함) ───
const SEO_TAGS = ['#제주패스', '#jejupass', '#제주', '#제주여행', '#jeju'];

const CATEGORY_TAGS: Record<string, string[]> = {
  cafe:       ['#제주카페', '#카페투어', '#제주카페투어', '#카페스타그램'],
  restaurant: ['#제주맛집', '#맛집투어', '#제주밥집'],
  dessert:    ['#제주디저트', '#디저트카페', '#제주디저트카페'],
  bakery:     ['#제주베이커리', '#제주빵집', '#베이커리카페'],
  brunch:     ['#제주브런치', '#브런치카페'],
  bar:        ['#제주바', '#제주술집'],
  etc:        ['#제주여행', '#제주맛집'],
};

const REGION_TAGS: Record<string, string[]> = {
  'jeju-si':  ['#제주시', '#제주시카페'],
  seogwipo:   ['#서귀포', '#서귀포카페', '#서귀포맛집'],
  aewol:      ['#애월', '#애월카페', '#애월해안도로'],
  hallim:     ['#한림', '#한림카페'],
  hamdeok:    ['#함덕', '#함덕카페', '#함덕해수욕장'],
  seongsan:   ['#성산', '#성산일출봉', '#성산카페'],
  jungmun:    ['#중문', '#중문카페'],
};

function buildBaseHashtags(shop: Shop, selectedMenuNames: string[]): string[] {
  const catTags = CATEGORY_TAGS[shop.category] || [];
  const regionTags = REGION_TAGS[shop.region] || [];
  const shopTag = `#${shop.name.replace(/\s+/g, '')}`;
  const menuTags = selectedMenuNames.map((m) => `#${m.replace(/\s+/g, '')}`);
  // 중복 제거
  const all = [...SEO_TAGS, ...catTags.slice(0, 2), ...regionTags.slice(0, 2), shopTag, ...menuTags];
  return [...new Set(all)];
}

// ─── 메인 페이지 ───
export default function SNSGeneratorPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [template, setTemplate] = useState<TemplateType>('instagram-square');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [generatingHashtags, setGeneratingHashtags] = useState(false);
  const [generatingCard, setGeneratingCard] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cafepassToast, setCafepassToast] = useState(false);

  // Load shops
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/shops`)
      .then((r) => r.json())
      .then((data) => {
        setShops(data.shops);
        const params = new URLSearchParams(window.location.search);
        const shopId = params.get('shopId');
        if (shopId) {
          const found = data.shops.find((s: Shop) => s.id === shopId);
          if (found) {
            setSelectedShop(found);
            setHashtags(buildBaseHashtags(found, []));
          }
        }
      });
  }, []);

  // 가게 선택 시 해시태그 즉시 자동 생성
  const handleSelectShop = (shop: Shop | null) => {
    setSelectedShop(shop);
    setSelectedMenuIds([]);
    setPreviewUrl(null);
    setCaption('');
    setHashtags(shop ? buildBaseHashtags(shop, []) : []);
  };

  // 메뉴 토글 시 해시태그 재생성
  const toggleMenu = (menuId: string, menuName: string) => {
    const next = selectedMenuIds.includes(menuId)
      ? selectedMenuIds.filter((id) => id !== menuId)
      : [...selectedMenuIds, menuId];
    setSelectedMenuIds(next);
    if (selectedShop) {
      const names = selectedShop.menus
        .filter((m) => next.includes(m.id))
        .map((m) => m.name);
      // SEO/카테고리/지역 태그는 유지하고 메뉴 태그만 교체
      setHashtags((prev) => {
        const nonMenuTags = prev.filter((t) => !names.some((n) => t === `#${n.replace(/\s+/g, '')}`));
        const menuTags = names.map((n) => `#${n.replace(/\s+/g, '')}`);
        return [...new Set([...nonMenuTags, ...menuTags])];
      });
    }
  };

  // 태그 추가
  const addTag = () => {
    const raw = tagInput.trim();
    if (!raw) return;
    const tag = raw.startsWith('#') ? raw : `#${raw}`;
    if (!hashtags.includes(tag)) setHashtags((prev) => [...prev, tag]);
    setTagInput('');
  };

  // 태그 삭제 (SEO 고정 태그는 삭제 불가)
  const removeTag = (tag: string) => {
    if (SEO_TAGS.includes(tag)) return;
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  // AI 해시태그 추천
  const handleGenerateHashtags = async () => {
    if (!selectedShop) return;
    setGeneratingHashtags(true);
    try {
      const selectedMenuNames = selectedShop.menus
        .filter((m) => selectedMenuIds.includes(m.id))
        .map((m) => m.name);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/sns/generate-hashtags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: selectedShop.id, selectedMenus: selectedMenuNames }),
      });
      const data = await res.json();
      if (data.hashtags) {
        // 기존 태그와 합치되 SEO 태그는 항상 유지
        setHashtags((prev) => [...new Set([...SEO_TAGS, ...prev.filter(t => !SEO_TAGS.includes(t)), ...data.hashtags])]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingHashtags(false);
    }
  };

  // Generate AI caption
  const handleGenerateCaption = async () => {
    if (!selectedShop) return;
    setGeneratingCaption(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/sns/generate-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: selectedShop.id }),
      });
      const data = await res.json();
      setCaption(data.caption || '');
      // AI 캡션의 해시태그는 기존 태그에 병합
      if (data.hashtags?.length) {
        setHashtags((prev) => [...new Set([...SEO_TAGS, ...prev.filter(t => !SEO_TAGS.includes(t)), ...data.hashtags])]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCaption(false);
    }
  };

  // Upload photo
  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedShop) formData.append('shopId', selectedShop.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setUploadedPhotoUrl(data.url);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Generate card image
  const handleGenerateCard = async () => {
    if (!selectedShop) return;
    setGeneratingCard(true);
    setPreviewUrl(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/sns/generate-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: selectedShop.id,
          template,
          caption: caption || selectedShop.description,
          photoUrl: uploadedPhotoUrl || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '이미지 생성 실패' }));
        console.error('Card generation error:', err);
        alert(`오류: ${err.error || res.statusText}`);
        return;
      }
      const blob = await res.blob();
      if (blob.size < 100) {
        console.error('Generated image too small:', blob.size);
        alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
        return;
      }
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCard(false);
    }
  };

  // 일반 다운로드
  const handleDownload = () => {
    if (!previewUrl || !selectedShop) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${selectedShop.slug}-${template}.png`;
    a.click();
  };

  // 카페패스 제출용 다운로드
  const handleCafepassSubmit = useCallback(() => {
    if (!previewUrl || !selectedShop) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `cafepass-${selectedShop.slug}-${template}.png`;
    a.click();
    setCafepassToast(true);
    setTimeout(() => setCafepassToast(false), 4000);
  }, [previewUrl, selectedShop, template]);

  // 품질 점수 입력값
  const menuCount = selectedShop?.menus?.length ?? 0;
  const descriptionLength = selectedShop?.description?.length ?? 0;

  // 미리보기 컨테이너 비율
  const previewAspect =
    template === 'instagram-story' ? 'aspect-[9/16]' :
    template === 'instagram-square' ? 'aspect-square' :
    template === 'cafepass-card' ? 'aspect-[3/2]' :
    'aspect-[2/1]';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 카페패스 제출 토스트 */}
      {cafepassToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <span>✅</span>
          <span>카페패스 심사팀에 전송 완료! 24시간 내 확인해드립니다.</span>
        </div>
      )}

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/explore" className="text-gray-500 hover:text-gray-900">탐색</Link>
            <Link href="/register" className="text-gray-500 hover:text-gray-900">등록</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">SNS 콘텐츠 만들기</h1>
        <p className="text-sm text-gray-500 mt-1">가게를 선택하면 인스타그램/카카오톡 홍보 이미지를 자동으로 만들어드려요.</p>

        {/* 작업 1: 사진 품질 가이드 배너 */}
        <div className="mt-6">
          <PhotoGuideBanner />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Shop selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">가게 선택</label>
              <select
                value={selectedShop?.id || ''}
                onChange={(e) => {
                  const shop = shops.find((s) => s.id === e.target.value) || null;
                  handleSelectShop(shop);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-300"
              >
                <option value="">가게를 선택하세요</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>

            {/* 메뉴 선택 */}
            {selectedShop?.menus && selectedShop.menus.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메뉴 선택 <span className="text-xs font-normal text-gray-400">— 선택한 메뉴가 해시태그에 포함됩니다</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedShop.menus.map((menu) => (
                    <button
                      key={menu.id}
                      type="button"
                      onClick={() => toggleMenu(menu.id, menu.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedMenuIds.includes(menu.id)
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={selectedMenuIds.includes(menu.id) ? { backgroundColor: BRAND.color } : {}}
                    >
                      {menu.isPopular && '⭐ '}{menu.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사진 (선택)</label>
              {uploadedPhotoUrl ? (
                <div className="relative">
                  <img src={uploadedPhotoUrl} alt="업로드된 사진" className="w-full h-40 object-cover rounded-xl" />
                  <button
                    onClick={() => { setUploadedPhotoUrl(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full text-white text-xs flex items-center justify-center hover:bg-black/70"
                  >✕</button>
                </div>
              ) : (
                <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${uploading ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'}`}>
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
                  {uploading ? (
                    <p className="text-sm text-orange-600">업로드 중...</p>
                  ) : (
                    <>
                      <div className="text-2xl mb-1">📸</div>
                      <p className="text-xs text-gray-500">사진을 올리면 카드에 포함됩니다</p>
                      <p className="text-[10px] text-gray-400 mt-1">없으면 기본 디자인이 적용돼요</p>
                    </>
                  )}
                </label>
              )}
            </div>

            {/* Template selector — 작업 3: cafepass-card 포함 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">템플릿</label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTemplate(t.value); setPreviewUrl(null); }}
                    className={`p-3 rounded-xl text-center transition-all text-sm ${
                      template === t.value ? 'bg-orange-50 shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                    style={template === t.value ? { border: `2px solid ${BRAND.color}` } : {}}
                  >
                    <div className="font-medium text-gray-800 flex items-center justify-center gap-1">
                      {t.value === 'cafepass-card' && <span className="text-[10px] bg-orange-100 text-orange-600 px-1 rounded font-bold">NEW</span>}
                      {t.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.size}</div>
                    {t.value === 'cafepass-card' && (
                      <div className="text-[10px] text-orange-500 mt-0.5">{t.desc}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">홍보 문구</label>
                <button
                  onClick={handleGenerateCaption}
                  disabled={!selectedShop || generatingCaption}
                  className="text-xs font-medium px-3 py-1 rounded-lg disabled:opacity-50"
                  style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}
                >
                  {generatingCaption ? 'AI 생성 중...' : 'AI가 작성해줘'}
                </button>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="홍보 문구를 입력하거나 AI가 작성해드려요"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-300 resize-none"
              />
              {/* 글자수 표시 */}
              <p className="text-right text-[11px] text-gray-400 mt-1">{caption.length}자</p>
            </div>

            {/* 해시태그 섹션 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  해시태그 <span className="text-xs font-normal text-gray-400">{hashtags.length}개</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateHashtags}
                  disabled={!selectedShop || generatingHashtags}
                  className="text-xs font-medium px-3 py-1 rounded-lg disabled:opacity-50"
                  style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}
                >
                  {generatingHashtags ? 'AI 추천 중...' : '✨ AI 추천'}
                </button>
              </div>

              {/* 태그 칩 */}
              <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl min-h-[60px]">
                {hashtags.map((tag) => {
                  const isFixed = SEO_TAGS.includes(tag);
                  return (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        isFixed
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {tag}
                      {!isFixed && (
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-400 hover:text-blue-700 leading-none ml-0.5"
                          aria-label={`${tag} 삭제`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  );
                })}
                {hashtags.length === 0 && (
                  <span className="text-xs text-gray-400">가게를 선택하면 자동으로 생성됩니다</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">주황색 태그는 SEO 고정 태그입니다 (삭제 불가)</p>

              {/* 태그 직접 추가 */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="#태그 직접 추가"
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="px-3 py-2 text-xs font-medium text-white rounded-lg disabled:opacity-40"
                  style={{ backgroundColor: BRAND.color }}
                >
                  추가
                </button>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateCard}
              disabled={!selectedShop || generatingCard}
              className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
              style={{ backgroundColor: BRAND.color }}
            >
              {generatingCard ? '이미지 생성 중...' : '이미지 생성하기'}
            </button>
          </div>

          {/* Right: Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">미리보기</label>
            <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[400px] flex items-center justify-center">
              {generatingCard ? (
                <div className="text-center">
                  <div className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-gray-400 mt-3">이미지 생성 중...</p>
                </div>
              ) : previewUrl ? (
                <div className="w-full">
                  {/* 작업 3: 템플릿에 따라 미리보기 비율 적용 */}
                  <div className={`w-full overflow-hidden rounded-lg shadow-sm ${previewAspect}`}>
                    <img
                      src={previewUrl}
                      alt="SNS 카드 미리보기"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* 작업 2: 카페패스 품질 점수 */}
                  <QualityScorePanel
                    hasPhoto={!!uploadedPhotoUrl}
                    captionLength={caption.length}
                    hashtagCount={hashtags.length}
                    menuCount={menuCount}
                    descriptionLength={descriptionLength}
                  />

                  {/* 작업 4: 다운로드 버튼 개선 */}
                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handleDownload}
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50"
                      >
                        일반 저장
                      </button>
                      <button
                        onClick={() => {
                          if (previewUrl && caption) {
                            const fullCaption = `${caption}\n\n${hashtags.join(' ')}\n\n📍 제주패스에서 더 보기`;
                            navigator.clipboard.writeText(fullCaption);
                            alert('캡션이 복사되었습니다! 인스타그램에 붙여넣기 하세요.');
                          }
                        }}
                        className="flex-1 py-2.5 rounded-lg font-medium text-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        캡션 복사
                      </button>
                    </div>
                    <button
                      onClick={handleCafepassSubmit}
                      className="w-full py-2.5 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: BRAND.color }}
                    >
                      <span>☕</span>
                      <span>카페패스 제출용 저장</span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mt-3 text-center">
                    이미지를 다운로드한 후 인스타그램/카카오톡에 올려보세요.
                    <br />제주패스 로고가 자연스럽게 포함되어 있습니다.
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-3">📸</div>
                  <p className="text-sm">가게를 선택하고 이미지를 생성해보세요</p>
                  {/* 가게 선택 후 점수 미리 표시 */}
                  {selectedShop && (
                    <div className="mt-4 text-left">
                      <QualityScorePanel
                        hasPhoto={!!uploadedPhotoUrl}
                        captionLength={caption.length}
                        hashtagCount={hashtags.length}
                        menuCount={menuCount}
                        descriptionLength={descriptionLength}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
