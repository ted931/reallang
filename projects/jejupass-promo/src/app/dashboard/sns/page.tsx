'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import type { Shop } from '@/lib/types';

type TemplateType = 'instagram-square' | 'instagram-story' | 'kakao';

const TEMPLATES: { value: TemplateType; label: string; size: string; desc: string }[] = [
  { value: 'instagram-square', label: '인스타 피드', size: '1080×1080', desc: '정사각형 피드 게시물' },
  { value: 'instagram-story', label: '인스타 스토리', size: '1080×1920', desc: '세로형 스토리' },
  { value: 'kakao', label: '카카오톡', size: '800×400', desc: '카카오톡 공유 카드' },
];

export default function SNSGeneratorPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [template, setTemplate] = useState<TemplateType>('instagram-square');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [generatingCard, setGeneratingCard] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load shops
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/shops`)
      .then((r) => r.json())
      .then((data) => {
        setShops(data.shops);
        // Auto-select from URL param
        const params = new URLSearchParams(window.location.search);
        const shopId = params.get('shopId');
        if (shopId) {
          const found = data.shops.find((s: Shop) => s.id === shopId);
          if (found) setSelectedShop(found);
        }
      });
  }, []);

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
      setHashtags(data.hashtags || []);
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

  // Download
  const handleDownload = () => {
    if (!previewUrl || !selectedShop) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${selectedShop.slug}-${template}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Shop selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">가게 선택</label>
              <select
                value={selectedShop?.id || ''}
                onChange={(e) => {
                  const shop = shops.find((s) => s.id === e.target.value);
                  setSelectedShop(shop || null);
                  setPreviewUrl(null);
                  setCaption('');
                  setHashtags([]);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-300"
              >
                <option value="">가게를 선택하세요</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>

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

            {/* Template selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">템플릿</label>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTemplate(t.value); setPreviewUrl(null); }}
                    className={`p-3 rounded-xl text-center transition-all text-sm ${
                      template === t.value ? 'bg-orange-50 shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                    style={template === t.value ? { border: `2px solid ${BRAND.color}` } : {}}
                  >
                    <div className="font-medium text-gray-800">{t.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.size}</div>
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
              {hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {hashtags.map((tag, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
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
                  <img
                    src={previewUrl}
                    alt="SNS 카드 미리보기"
                    className="w-full rounded-lg shadow-sm"
                  />
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm"
                      style={{ backgroundColor: BRAND.color }}
                    >
                      다운로드
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
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    이미지를 다운로드한 후 인스타그램/카카오톡에 올려보세요.
                    <br />제주패스 로고가 자연스럽게 포함되어 있습니다.
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-3">📸</div>
                  <p className="text-sm">가게를 선택하고 이미지를 생성해보세요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
