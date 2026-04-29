import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getShopById } from '@/lib/store';
import { CATEGORY_MAP, REGION_MAP } from '@/lib/constants';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { shopId, selectedMenus } = await req.json() as { shopId: string; selectedMenus?: string[] };

  const shop = await getShopById(shopId);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });

  const category = CATEGORY_MAP[shop.category] || shop.category;
  const region = REGION_MAP[shop.region] || shop.region;
  const menuText = selectedMenus?.length ? `대표 메뉴: ${selectedMenus.join(', ')}` : '';

  const prompt = `제주도 "${shop.name}" (${category}, ${region})에 맞는 인스타그램 해시태그를 추천해주세요.
가게 소개: ${shop.description || ''}
${menuText}

요구사항:
- 총 10~15개
- 제주 여행자가 실제로 검색할 태그 위주
- 가게 분위기/특색이 드러나는 태그 포함
- 메뉴명 기반 태그 포함
- # 포함하여 배열로만 응답

JSON: {"hashtags": ["#태그1", "#태그2", ...]}`;

  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = res.choices[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return NextResponse.json({ hashtags: parsed.hashtags || [] });
    }
  } catch (err) {
    console.error('Hashtag generation failed:', err);
  }

  // fallback
  return NextResponse.json({
    hashtags: [`#${shop.name}`, `#제주${category}`, `#${region}`, '#제주여행', '#제주맛집'],
  });
}
