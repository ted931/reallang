import { NextRequest, NextResponse } from 'next/server';
import { getShopBySlug } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const shop = await getShopBySlug(decodeURIComponent(slug));
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ shop });
}
