import { NextRequest, NextResponse } from 'next/server';
import { generateCaption } from '@/lib/sns/generateCaption';
import { getShopById } from '@/lib/store';
import { CATEGORY_MAP, REGION_MAP } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { shopId } = body as { shopId: string };

  if (!shopId) {
    return NextResponse.json({ error: 'shopId가 필요합니다.' }, { status: 400 });
  }

  const shop = await getShopById(shopId);
  if (!shop) {
    return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });
  }

  const result = await generateCaption({
    shopName: shop.name,
    category: CATEGORY_MAP[shop.category] || shop.category,
    region: REGION_MAP[shop.region] || shop.region,
    description: shop.description,
    menuHighlights: shop.menus.filter((m) => m.isPopular).map((m) => m.name),
  });

  return NextResponse.json(result);
}
