'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import type { Shop } from '@/lib/types';

type TemplateType = 'instagram-square' | 'instagram-story' | 'kakao' | 'cafepass-card';
type ToneType = 'warm' | 'punchy' | 'clean';
type PlatformType = 'instagram' | 'naver' | 'kakao';

const TEMPLATES: { value: TemplateType; label: string; size: string; desc: string }[] = [
  { value: 'instagram-square', label: '인스타 피드', size: '1080×1080', desc: '정사각형 피드 게시물' },
  { value: 'instagram-story', label: '인스타 스토리', size: '1080×1920', desc: '세로형 스토리' },
  { value: 'kakao', label: '카카오톡', size: '800×400', desc: '카카오톡 공유 카드' },
  { value: 'cafepass-card', label: '카페패스 카드', size: '1080×720', desc: '카페패스 입점용 표준 카드' },
];

const TONE_LABELS: Record<ToneType, string> = {
  warm: '따뜻한 ☀️',
  punchy: '펀치 ⚡',
  clean: '미니멀 □',
};

const PLATFORM_META: Record<PlatformType, { label: string; icon: string }> = {
  instagram: { label: 'Instagram', icon: '📷' },
  naver: { label: '네이버 블로그', icon: 'N' },
  kakao: { label: '카카오스토리', icon: 'K' },
};

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

// ─── SEO 고정 태그 ───
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
  const all = [...SEO_TAGS, ...catTags.slice(0, 2), ...regionTags.slice(0, 2), shopTag, ...menuTags];
  return [...new Set(all)];
}

// ─── 품질 점수 패널 ───
function QualityScorePanel({ hasPhoto, captionLength, hashtagCount, menuCount, descriptionLength }: {
  hasPhoto: boolean; captionLength: number; hashtagCount: number; menuCount: number; descriptionLength: number;
}) {
  const { score, breakdown } = calcQualityScore({ hasPhoto, captionLength, hashtagCount, menuCount, descriptionLength });
  const grade = getGrade(score);
  const missing = breakdown.filter((b) => !b.met);

  return (
    <div className="mt-4 rounded-xl border p-4" style={{ backgroundColor: grade.bgColor, borderColor: grade.borderColor }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">카페패스 품질 점수</p>
          <div className="flex items-center gap-1.5">
            <span className="text-base">{grade.emoji}</span>
            <span className="text-sm font-semibold" style={{ color: grade.color }}>{grade.text}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold" style={{ color: grade.color }}>{score}</span>
          <span className="text-sm text-slate-400">/100</span>
        </div>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: score >= 70 ? (score >= 90 ? '#15803d' : '#1d4ed8') : (score >= 50 ? '#d97706' : '#dc2626') }} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {breakdown.map((b) => (
          <span key={b.label} className="text-[11px] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: b.met ? '#dcfce7' : '#f3f4f6', color: b.met ? '#15803d' : '#9ca3af' }}>
            {b.met ? '✓' : '+'} {b.label} (+{b.max}점)
          </span>
        ))}
      </div>
      {score < 70 && missing.length > 0 && (
        <div className="border-t pt-3" style={{ borderColor: grade.borderColor }}>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">개선하면 점수가 오릅니다</p>
          <ul className="space-y-1">
            {missing.map((b) => (
              <li key={b.label} className="text-xs text-slate-600 flex items-center gap-1">
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

// ─── 플랫폼 미리보기 컴포넌트 ───
function PlatformPreview({ platform, headline, body, tags, shopName, photoUrl }: {
  platform: PlatformType;
  headline: string;
  body: string;
  tags: string[];
  shopName: string;
  photoUrl: string | null;
}) {
  const placeholderStyle = {
    background: 'repeating-linear-gradient(45deg,#fef3e8,#fef3e8 8px,#fed7aa 8px,#fed7aa 16px)',
  };

  if (platform === 'instagram') return (
    <div className="p-5 bg-slate-50">
      <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold truncate">{shopName.replace(/\s/g, '_').toLowerCase()}</p>
            <p className="text-[10px] text-slate-400">제주</p>
          </div>
          <span className="text-slate-400 text-sm">···</span>
        </div>
        <div className="aspect-square relative grid place-items-center" style={photoUrl ? {} : placeholderStyle}>
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <span className="text-5xl opacity-40">☕</span>
          )}
        </div>
        <div className="px-3 py-2 flex gap-3 text-lg">
          <span>♡</span><span>💬</span><span>↗</span>
          <span className="ml-auto">◫</span>
        </div>
        <div className="px-3 pb-4 text-xs space-y-1.5">
          <p className="font-extrabold">{shopName.replace(/\s/g, '_').toLowerCase()}</p>
          <p className="font-bold text-sm text-slate-900">{headline}</p>
          <p className="whitespace-pre-line text-slate-700 leading-relaxed">{body}</p>
          <p className="text-blue-500 leading-relaxed">{tags.join(' ')}</p>
        </div>
      </div>
    </div>
  );

  if (platform === 'naver') return (
    <div className="p-5 bg-emerald-50/30">
      <div className="bg-white border border-emerald-200 rounded-xl p-5 max-w-2xl mx-auto shadow-sm">
        <p className="font-mono text-[10px] text-emerald-600">NAVER blog · {shopName}</p>
        <h2 className="text-xl font-extrabold text-slate-900 mt-2">{headline}</h2>
        <div className="my-4 aspect-video rounded-lg grid place-items-center" style={photoUrl ? {} : placeholderStyle}>
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-5xl opacity-40">☕</span>
          )}
        </div>
        <p className="whitespace-pre-line text-sm text-slate-700 leading-relaxed">{body}</p>
        <p className="text-emerald-700 text-xs mt-3 leading-relaxed">{tags.join(' ')}</p>
      </div>
    </div>
  );

  return (
    <div className="p-5 bg-amber-50/30">
      <div className="bg-white border border-amber-200 rounded-xl p-4 max-w-sm mx-auto shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-400 grid place-items-center font-extrabold text-white shrink-0">
            {shopName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-extrabold">{shopName}</p>
            <p className="text-[10px] text-slate-400">방금 전</p>
          </div>
        </div>
        <p className="font-bold text-sm text-slate-900">{headline}</p>
        <p className="whitespace-pre-line text-xs text-slate-700 mt-2 leading-relaxed">{body}</p>
        {photoUrl && (
          <img src={photoUrl} alt="" className="mt-3 rounded-lg w-full aspect-square object-cover" />
        )}
        <p className="text-amber-600 text-xs mt-2 leading-relaxed">{tags.join(' ')}</p>
      </div>
    </div>
  );
}

type IGPostStatus = 'idle' | 'connecting' | 'publishing' | 'published' | 'dev_skip' | 'error';

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
  const [activeTone, setActiveTone] = useState<ToneType>('warm');
  const [activePlatform, setActivePlatform] = useState<PlatformType>('instagram');

  // 인라인 편집용 상태
  const [editHeadline, setEditHeadline] = useState('');
  const [editBody, setEditBody] = useState('');

  // Instagram 연동 상태
  const [igStatus, setIgStatus] = useState<IGPostStatus>('idle');
  const [igMessage, setIgMessage] = useState('');
  const [showIgConnect, setShowIgConnect] = useState(false);
  const [igToken, setIgToken] = useState('');
  const [igUserId, setIgUserId] = useState('');
  const [igUsername, setIgUsername] = useState('');
  const [igConnecting, setIgConnecting] = useState(false);

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

  const handleSelectShop = (shop: Shop | null) => {
    setSelectedShop(shop);
    setSelectedMenuIds([]);
    setPreviewUrl(null);
    setCaption('');
    setHashtags(shop ? buildBaseHashtags(shop, []) : []);
    setEditHeadline('');
    setEditBody('');
  };

  const toggleMenu = (menuId: string, menuName: string) => {
    const next = selectedMenuIds.includes(menuId)
      ? selectedMenuIds.filter((id) => id !== menuId)
      : [...selectedMenuIds, menuId];
    setSelectedMenuIds(next);
    if (selectedShop) {
      const names = selectedShop.menus.filter((m) => next.includes(m.id)).map((m) => m.name);
      setHashtags((prev) => {
        const nonMenuTags = prev.filter((t) => !names.some((n) => t === `#${n.replace(/\s+/g, '')}`));
        const menuTags = names.map((n) => `#${n.replace(/\s+/g, '')}`);
        return [...new Set([...nonMenuTags, ...menuTags])];
      });
    }
  };

  const addTag = () => {
    const raw = tagInput.trim();
    if (!raw) return;
    const tag = raw.startsWith('#') ? raw : `#${raw}`;
    if (!hashtags.includes(tag)) setHashtags((prev) => [...prev, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    if (SEO_TAGS.includes(tag)) return;
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  const handleGenerateHashtags = async () => {
    if (!selectedShop) return;
    setGeneratingHashtags(true);
    try {
      const selectedMenuNames = selectedShop.menus.filter((m) => selectedMenuIds.includes(m.id)).map((m) => m.name);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/sns/generate-hashtags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: selectedShop.id, selectedMenus: selectedMenuNames }),
      });
      const data = await res.json();
      if (data.hashtags) {
        setHashtags((prev) => [...new Set([...SEO_TAGS, ...prev.filter(t => !SEO_TAGS.includes(t)), ...data.hashtags])]);
      }
    } catch (err) { console.error(err); }
    finally { setGeneratingHashtags(false); }
  };

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
      setEditHeadline('');
      setEditBody(data.caption || '');
      if (data.hashtags?.length) {
        setHashtags((prev) => [...new Set([...SEO_TAGS, ...prev.filter(t => !SEO_TAGS.includes(t)), ...data.hashtags])]);
      }
    } catch (err) { console.error(err); }
    finally { setGeneratingCaption(false); }
  };

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
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleGenerateCard = async () => {
    if (!selectedShop) return;
    setGeneratingCard(true);
    setPreviewUrl(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/sns/generate-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: selectedShop.id, template,
          caption: caption || selectedShop.description,
          photoUrl: uploadedPhotoUrl || undefined,
        }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({ error: '이미지 생성 실패' })); alert(`오류: ${err.error || res.statusText}`); return; }
      const blob = await res.blob();
      if (blob.size < 100) { alert('이미지 생성에 실패했습니다. 다시 시도해주세요.'); return; }
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) { console.error(err); }
    finally { setGeneratingCard(false); }
  };

  const handleDownload = () => {
    if (!previewUrl || !selectedShop) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${selectedShop.slug}-${template}.png`;
    a.click();
  };

  const handleIgConnect = async () => {
    if (!selectedShop || !igToken || !igUserId) return;
    setIgConnecting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/instagram/connect`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: selectedShop.id, token: igToken, userId: igUserId, username: igUsername }),
      });
      if (res.ok) {
        const updated = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/shops/${selectedShop.id}`).then(r => r.json());
        setSelectedShop(updated.shop);
        setShowIgConnect(false);
        setIgToken(''); setIgUserId(''); setIgUsername('');
      }
    } finally { setIgConnecting(false); }
  };

  const handleIgDisconnect = async () => {
    if (!selectedShop) return;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/instagram/connect`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId: selectedShop.id }),
    });
    const updated = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/shops/${selectedShop.id}`).then(r => r.json());
    setSelectedShop(updated.shop);
  };

  const handleIgPublish = async () => {
    if (!selectedShop || !previewUrl) return;
    setIgStatus('publishing');
    setIgMessage('');
    try {
      const fullCaption = `${caption}\n\n${hashtags.join(' ')}\n\n📍 ${selectedShop.name} | 제주패스에서 더 보기 jejupass.com`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/instagram/publish`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: selectedShop.id, imageUrl: previewUrl, caption: fullCaption }),
      });
      const data = await res.json();
      if (data.status === 'published') { setIgStatus('published'); setIgMessage('인스타그램에 게시 완료!'); }
      else if (data.status === 'dev_skip') { setIgStatus('dev_skip'); setIgMessage(data.message); }
      else { setIgStatus('error'); setIgMessage(data.error || '게시 중 오류가 발생했습니다.'); }
    } catch { setIgStatus('error'); setIgMessage('네트워크 오류가 발생했습니다.'); }
  };

  const handleCafepassSubmit = useCallback(() => {
    if (!previewUrl || !selectedShop) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `cafepass-${selectedShop.slug}-${template}.png`;
    a.click();
    setCafepassToast(true);
    setTimeout(() => setCafepassToast(false), 4000);
  }, [previewUrl, selectedShop, template]);

  const menuCount = selectedShop?.menus?.length ?? 0;
  const descriptionLength = selectedShop?.description?.length ?? 0;

  // 미리보기에 사용할 헤드라인/본문 (편집 시 편집값 우선)
  const displayHeadline = editHeadline || (selectedShop ? selectedShop.name : '가게 이름');
  const displayBody = editBody || caption || (selectedShop?.description ?? '');
  const displayTags = hashtags;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 토스트 */}
      {cafepassToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <span>✅</span>
          <span>카페패스 심사팀에 전송 완료! 24시간 내 확인해드립니다.</span>
        </div>
      )}

      {/* 헤더 */}
      <header className="bg-white border-b border-slate-100 sticky top-10 z-40">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/explore" className="text-slate-500 hover:text-slate-900 transition-colors">탐색</Link>
            <Link href="/register" className="text-slate-500 hover:text-slate-900 transition-colors">등록</Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              생성 완료 · {new Date().toLocaleDateString('ko-KR')}
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">SNS 콘텐츠 만들기</h1>
            <p className="text-sm text-slate-500 mt-1">가게를 선택하면 인스타그램 / 블로그 / 카카오 홍보 콘텐츠를 자동으로 만들어드려요</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateCard}
              disabled={!selectedShop || generatingCard}
              className="px-4 py-2 text-sm font-bold border border-slate-200 bg-white rounded-xl text-slate-700 disabled:opacity-40"
            >
              ↻ 다시 생성
            </button>
            <button
              onClick={handleCafepassSubmit}
              disabled={!previewUrl}
              className="px-4 py-2 text-sm font-extrabold bg-orange-500 text-white rounded-xl disabled:opacity-40"
            >
              예약 게시
            </button>
          </div>
        </div>

        {/* 가게 선택 + 톤 선택 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-500 shrink-0">가게</label>
              <select
                value={selectedShop?.id || ''}
                onChange={(e) => { const shop = shops.find((s) => s.id === e.target.value) || null; handleSelectShop(shop); }}
                className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-orange-300"
              >
                <option value="">가게를 선택하세요</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>

            {/* 톤 선택 */}
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">톤</p>
              <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                {(['warm', 'punchy', 'clean'] as ToneType[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setActiveTone(tone)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTone === tone ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {TONE_LABELS[tone]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* 플랫폼 미리보기 */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* 플랫폼 탭 */}
            <div className="border-b border-slate-200 flex">
              {(['instagram', 'naver', 'kakao'] as PlatformType[]).map((p) => {
                const on = activePlatform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setActivePlatform(p)}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
                      on ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <span className="mr-1">{PLATFORM_META[p].icon}</span>
                    {PLATFORM_META[p].label}
                  </button>
                );
              })}
            </div>

            {/* 미리보기 */}
            <PlatformPreview
              platform={activePlatform}
              headline={displayHeadline}
              body={displayBody}
              tags={displayTags}
              shopName={selectedShop?.name ?? '봄날 카페'}
              photoUrl={uploadedPhotoUrl ?? previewUrl}
            />

            {/* 생성 카드 이미지 표시 영역 */}
            {(generatingCard || previewUrl) && (
              <div className="p-5 border-t border-slate-100">
                {generatingCard ? (
                  <div className="flex items-center justify-center py-8 gap-3">
                    <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-slate-400">이미지 생성 중...</span>
                  </div>
                ) : previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="SNS 카드 미리보기" className="w-full rounded-xl shadow-sm" />
                    <QualityScorePanel
                      hasPhoto={!!uploadedPhotoUrl}
                      captionLength={caption.length}
                      hashtagCount={hashtags.length}
                      menuCount={menuCount}
                      descriptionLength={descriptionLength}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* 편집 패널 */}
          <aside className="space-y-4">
            {/* 캡션 편집 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">헤드라인</p>
                  <button
                    onClick={handleGenerateCaption}
                    disabled={!selectedShop || generatingCaption}
                    className="text-xs font-bold px-3 py-1 rounded-lg disabled:opacity-40"
                    style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}
                  >
                    {generatingCaption ? 'AI 생성 중...' : 'AI가 작성해줘'}
                  </button>
                </div>
                <textarea
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  placeholder={selectedShop?.name ?? '헤드라인을 입력하세요'}
                  rows={2}
                  className="w-full text-sm font-bold border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">본문</p>
                <textarea
                  value={editBody || caption}
                  onChange={(e) => { setEditBody(e.target.value); setCaption(e.target.value); }}
                  placeholder="홍보 문구를 입력하거나 AI가 작성해드려요"
                  rows={7}
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:border-orange-300"
                />
                <p className="text-right text-[11px] text-slate-400 mt-1">{(editBody || caption).length}자</p>
              </div>

              {/* 해시태그 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    해시태그 <span className="text-slate-300">{hashtags.length}개</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateHashtags}
                    disabled={!selectedShop || generatingHashtags}
                    className="text-xs font-bold px-3 py-1 rounded-lg disabled:opacity-40"
                    style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}
                  >
                    {generatingHashtags ? 'AI 추천 중...' : '✨ AI 추천'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl min-h-[48px]">
                  {hashtags.map((tag) => {
                    const isFixed = SEO_TAGS.includes(tag);
                    return (
                      <span key={tag}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          isFixed ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'
                        }`}>
                        {tag}
                        {!isFixed && (
                          <button type="button" onClick={() => removeTag(tag)}
                            className="text-blue-400 hover:text-blue-700 leading-none ml-0.5" aria-label={`${tag} 삭제`}>×</button>
                        )}
                      </span>
                    );
                  })}
                  {hashtags.length === 0 && (
                    <span className="text-xs text-slate-400">가게를 선택하면 자동으로 생성됩니다</span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="#태그 직접 추가"
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-300" />
                  <button type="button" onClick={addTag} disabled={!tagInput.trim()}
                    className="px-3 py-2 text-xs font-bold text-white rounded-xl disabled:opacity-40"
                    style={{ backgroundColor: BRAND.color }}>추가</button>
                </div>
              </div>
            </div>

            {/* 사진 + 메뉴 선택 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              {/* 사진 업로드 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">이미지</p>
                  {uploadedPhotoUrl && (
                    <button onClick={() => { setUploadedPhotoUrl(null); setPreviewUrl(null); }}
                      className="text-[10px] font-mono text-slate-400 hover:text-red-500">삭제</button>
                  )}
                </div>
                {uploadedPhotoUrl ? (
                  <img src={uploadedPhotoUrl} alt="업로드된 사진" className="w-full h-36 object-cover rounded-xl" />
                ) : (
                  <label className={`block border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                    uploading ? 'border-orange-300 bg-orange-50' : 'border-slate-200 hover:border-orange-200 hover:bg-orange-50/30'
                  }`}>
                    <input type="file" accept="image/*" className="hidden" disabled={uploading}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
                    {uploading ? (
                      <p className="text-sm text-orange-600">업로드 중...</p>
                    ) : (
                      <>
                        <div className="text-2xl mb-1">📸</div>
                        <p className="text-xs text-slate-500">사진을 올리면 카드에 포함됩니다</p>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* 메뉴 선택 */}
              {selectedShop?.menus && selectedShop.menus.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
                    메뉴 선택 <span className="text-slate-300">— 해시태그에 포함</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedShop.menus.map((menu) => (
                      <button key={menu.id} type="button" onClick={() => toggleMenu(menu.id, menu.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedMenuIds.includes(menu.id) ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        style={selectedMenuIds.includes(menu.id) ? { backgroundColor: BRAND.color } : {}}>
                        {menu.isPopular && '⭐ '}{menu.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 템플릿 선택 */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">템플릿</p>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((t) => (
                    <button key={t.value} onClick={() => { setTemplate(t.value); setPreviewUrl(null); }}
                      className={`p-3 rounded-xl text-center transition-all text-sm ${
                        template === t.value ? 'bg-orange-50 shadow-sm' : 'bg-white border border-slate-200 hover:bg-slate-50'
                      }`}
                      style={template === t.value ? { border: `2px solid ${BRAND.color}` } : {}}>
                      <div className="font-bold text-slate-800 flex items-center justify-center gap-1 text-xs">
                        {t.value === 'cafepass-card' && <span className="text-[9px] bg-orange-100 text-orange-600 px-1 rounded font-bold">NEW</span>}
                        {t.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.size}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="space-y-2">
              <button onClick={handleGenerateCard} disabled={!selectedShop || generatingCard}
                className="w-full py-3 rounded-xl text-white text-sm font-extrabold disabled:opacity-40 transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND.color }}>
                {generatingCard ? '이미지 생성 중...' : '이미지 생성하기'}
              </button>

              {/* Instagram 연동 */}
              {selectedShop?.instagram ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 bg-pink-50 rounded-xl border border-pink-100">
                    <div className="flex items-center gap-2">
                      <span>📸</span>
                      <div>
                        <p className="text-xs font-bold text-pink-800">@{selectedShop.instagram.username}</p>
                        <p className="text-[10px] text-pink-500">연동됨</p>
                      </div>
                    </div>
                    <button onClick={handleIgDisconnect} className="text-[10px] text-pink-400 hover:text-pink-600 underline">연동 해제</button>
                  </div>
                  {igStatus === 'idle' && (
                    <button onClick={handleIgPublish}
                      className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
                      <span>📱</span><span>인스타그램에 바로 올리기</span>
                    </button>
                  )}
                  {igStatus === 'publishing' && (
                    <div className="w-full py-3 rounded-xl bg-pink-100 text-pink-700 text-sm font-medium text-center flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />게시 중...
                    </div>
                  )}
                  {igStatus === 'published' && (
                    <div className="w-full py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-bold text-center">✅ 인스타그램 게시 완료!</div>
                  )}
                  {igStatus === 'dev_skip' && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 space-y-1">
                      <p className="font-bold">🛠 개발 환경 — 실제 게시 생략</p>
                      <p>{igMessage}</p>
                      <button onClick={() => setIgStatus('idle')} className="text-blue-500 underline">다시 시도</button>
                    </div>
                  )}
                  {igStatus === 'error' && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 space-y-1">
                      <p className="font-bold">❌ 게시 실패</p><p>{igMessage}</p>
                      <button onClick={() => setIgStatus('idle')} className="text-red-500 underline">다시 시도</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => setShowIgConnect(!showIgConnect)}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-colors"
                    style={{ borderColor: '#E1306C', color: '#E1306C' }}>
                    <span>📱</span><span>Instagram 연동하고 바로 올리기</span>
                  </button>
                  {showIgConnect && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                      <p className="text-sm font-bold text-slate-800">Instagram 계정 연동</p>
                      <input type="text" value={igUserId} onChange={(e) => setIgUserId(e.target.value)}
                        placeholder="Instagram User ID (숫자)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-pink-300" />
                      <input type="text" value={igUsername} onChange={(e) => setIgUsername(e.target.value)}
                        placeholder="Instagram 아이디 (@ 없이)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-pink-300" />
                      <input type="password" value={igToken} onChange={(e) => setIgToken(e.target.value)}
                        placeholder="Access Token"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-pink-300 font-mono" />
                      <button onClick={handleIgConnect} disabled={igConnecting || !igToken || !igUserId}
                        className="w-full py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50"
                        style={{ backgroundColor: '#E1306C' }}>
                        {igConnecting ? '연동 중...' : '연동하기'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleDownload} disabled={!previewUrl}
                  className="py-3 text-sm font-bold border border-slate-200 bg-white rounded-xl text-slate-700 disabled:opacity-40 hover:bg-slate-50">
                  📋 텍스트 복사
                </button>
                <button onClick={handleDownload} disabled={!previewUrl}
                  className="py-3 text-sm font-bold border border-slate-200 bg-white rounded-xl text-slate-700 disabled:opacity-40 hover:bg-slate-50">
                  ⬇ ZIP 다운로드
                </button>
              </div>

              <button onClick={handleCafepassSubmit} disabled={!previewUrl}
                className="w-full py-3.5 text-sm font-extrabold text-white rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: BRAND.color }}>
                인스타그램으로 가져가기 →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
