import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import path from 'path';
import { loadFonts } from './fontLoader';
import { BRAND } from '../constants';

interface CardData {
  shopName: string;
  category: string;
  region: string;
  caption: string;
  photoUrl?: string;  // /uploads/xxx.jpg 또는 외부 URL
}

// 이미지 URL을 base64 data URI로 변환 (Satori에서 필요)
async function resolveImageUrl(url?: string): Promise<string | null> {
  if (!url) return null;
  try {
    if (url.startsWith('/')) {
      // 로컬 파일
      const filePath = path.join(process.cwd(), 'public', url);
      const buffer = await readFile(filePath);
      const ext = url.split('.').pop()?.toLowerCase();
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    } else if (url.startsWith('http')) {
      const res = await fetch(url);
      const buffer = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get('content-type') || 'image/jpeg';
      return `data:${contentType};base64,${buffer.toString('base64')}`;
    }
  } catch {
    // 이미지 로드 실패 시 null 반환
  }
  return null;
}

function getCategoryEmoji(category: string): string {
  if (category.includes('카페')) return '☕';
  if (category.includes('맛집') || category.includes('식당')) return '🍽️';
  if (category.includes('디저트')) return '🧁';
  if (category.includes('베이커리')) return '🍞';
  if (category.includes('브런치')) return '🥂';
  if (category.includes('바')) return '🍸';
  return '🏪';
}

// 사진 영역: 실제 사진 or 그라데이션 플레이스홀더
function photoOrPlaceholder(photoDataUri: string | null, category: string, w: number, h: number) {
  if (photoDataUri) {
    return {
      type: 'img',
      props: {
        src: photoDataUri,
        width: w,
        height: h,
        style: { objectFit: 'cover' as const, width: `${w}px`, height: `${h}px` },
      },
    };
  }
  return {
    type: 'div',
    props: {
      style: {
        width: `${w}px`, height: `${h}px`,
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF9A76 50%, #FFDAC1 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      },
      children: [{ type: 'div', props: { style: { fontSize: `${Math.min(w, h) * 0.2}px` }, children: getCategoryEmoji(category) } }],
    },
  };
}

// ─── Instagram Square (1080x1080) ───
function InstagramSquareTemplate(data: CardData, photoDataUri: string | null) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1080px', height: '1080px', display: 'flex', flexDirection: 'column',
        backgroundColor: '#ffffff', fontFamily: 'Pretendard',
      },
      children: [
        photoOrPlaceholder(photoDataUri, data.category, 1080, 680),
        {
          type: 'div',
          props: {
            style: { flex: 1, padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '12px' },
                  children: [
                    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [
                      { type: 'div', props: { style: { backgroundColor: BRAND.colorLight, color: BRAND.color, padding: '4px 12px', borderRadius: '20px', fontSize: '24px', fontWeight: 600 }, children: `${data.category} · ${data.region}` } },
                    ] } },
                    { type: 'div', props: { style: { fontSize: '48px', fontWeight: 700, color: '#1f2937', lineHeight: 1.3 }, children: data.shopName } },
                    { type: 'div', props: { style: { fontSize: '28px', color: '#6b7280', lineHeight: 1.5 }, children: data.caption.slice(0, 60) } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '20px' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '22px', color: BRAND.color, fontWeight: 700 }, children: '제주패스' } },
                    { type: 'div', props: { style: { fontSize: '20px', color: '#9ca3af' }, children: BRAND.url } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ─── Instagram Story (1080x1920) ───
function InstagramStoryTemplate(data: CardData, photoDataUri: string | null) {
  // 사진이 있으면 전체 배경으로 사용
  const bgStyle = photoDataUri
    ? { width: '1080px', height: '1920px', display: 'flex', flexDirection: 'column' as const, fontFamily: 'Pretendard', position: 'relative' as const }
    : { width: '1080px', height: '1920px', display: 'flex', flexDirection: 'column' as const, background: 'linear-gradient(180deg, #FF6B35 0%, #E55A2B 100%)', fontFamily: 'Pretendard', padding: '80px 60px', justifyContent: 'space-between' };

  if (photoDataUri) {
    return {
      type: 'div',
      props: {
        style: bgStyle,
        children: [
          // 배경 이미지
          { type: 'img', props: { src: photoDataUri, width: 1080, height: 1920, style: { objectFit: 'cover' as const, position: 'absolute' as const, top: 0, left: 0, width: '1080px', height: '1920px' } } },
          // 그라데이션 오버레이
          { type: 'div', props: { style: { position: 'absolute' as const, top: 0, left: 0, width: '1080px', height: '1920px', background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.85) 100%)' } } },
          // 콘텐츠 (하단)
          {
            type: 'div',
            props: {
              style: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: '60px', display: 'flex', flexDirection: 'column', gap: '24px' },
              children: [
                { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [
                  { type: 'div', props: { style: { backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px', color: 'white', fontSize: '28px', fontWeight: 600 }, children: `${data.category} · ${data.region}` } },
                ] } },
                { type: 'div', props: { style: { fontSize: '56px', fontWeight: 700, color: 'white', lineHeight: 1.3 }, children: data.shopName } },
                { type: 'div', props: { style: { fontSize: '30px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }, children: data.caption.slice(0, 80) } },
                { type: 'div', props: { style: { backgroundColor: 'white', color: BRAND.color, padding: '16px 48px', borderRadius: '40px', fontSize: '28px', fontWeight: 700, alignSelf: 'flex-start' }, children: '제주패스에서 보기 →' } },
                { type: 'div', props: { style: { fontSize: '22px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }, children: BRAND.url } },
              ],
            },
          },
        ],
      },
    };
  }

  // 사진 없는 버전 (그라데이션 배경)
  return {
    type: 'div',
    props: {
      style: bgStyle,
      children: [
        { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [
          { type: 'div', props: { style: { backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px', color: 'white', fontSize: '28px', fontWeight: 600 }, children: `${data.category} · ${data.region}` } },
        ] } },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' },
            children: [
              { type: 'div', props: { style: { fontSize: '160px' }, children: getCategoryEmoji(data.category) } },
              { type: 'div', props: { style: { fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', lineHeight: 1.3 }, children: data.shopName } },
              { type: 'div', props: { style: { fontSize: '32px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 1.5, maxWidth: '800px' }, children: data.caption.slice(0, 80) } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' },
            children: [
              { type: 'div', props: { style: { backgroundColor: 'white', color: BRAND.color, padding: '16px 48px', borderRadius: '40px', fontSize: '30px', fontWeight: 700 }, children: '제주패스에서 보기 →' } },
              { type: 'div', props: { style: { fontSize: '24px', color: 'rgba(255,255,255,0.5)' }, children: BRAND.url } },
            ],
          },
        },
      ],
    },
  };
}

// ─── KakaoTalk Card (800x400) ───
function KakaoCardTemplate(data: CardData, photoDataUri: string | null) {
  return {
    type: 'div',
    props: {
      style: { width: '800px', height: '400px', display: 'flex', backgroundColor: '#ffffff', fontFamily: 'Pretendard' },
      children: [
        photoOrPlaceholder(photoDataUri, data.category, 400, 400),
        {
          type: 'div',
          props: {
            style: { flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '12px' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '18px', color: BRAND.color, fontWeight: 600 }, children: `${data.category} · ${data.region}` } },
                    { type: 'div', props: { style: { fontSize: '32px', fontWeight: 700, color: '#1f2937' }, children: data.shopName } },
                    { type: 'div', props: { style: { fontSize: '20px', color: '#6b7280', lineHeight: 1.5 }, children: data.caption.slice(0, 40) } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '16px', color: BRAND.color, fontWeight: 700 }, children: '제주패스' } },
                    { type: 'div', props: { style: { fontSize: '14px', color: '#9ca3af' }, children: '자세히 보기 →' } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

const TEMPLATES = {
  'instagram-square': { fn: InstagramSquareTemplate, width: 1080, height: 1080 },
  'instagram-story': { fn: InstagramStoryTemplate, width: 1080, height: 1920 },
  'kakao': { fn: KakaoCardTemplate, width: 800, height: 400 },
} as const;

export type TemplateType = keyof typeof TEMPLATES;

export async function generateCard(
  template: TemplateType,
  data: CardData
): Promise<Buffer> {
  const fonts = await loadFonts();
  const tmpl = TEMPLATES[template];

  // 이미지 로드 (있으면)
  const photoDataUri = await resolveImageUrl(data.photoUrl);

  const element = tmpl.fn(data, photoDataUri);

  const svg = await satori(element as React.ReactNode, {
    width: tmpl.width,
    height: tmpl.height,
    fonts: [
      { name: 'Pretendard', data: fonts.regular, weight: 400, style: 'normal' as const },
      { name: 'Pretendard', data: fonts.bold, weight: 700, style: 'normal' as const },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
  return png;
}
