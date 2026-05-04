import { NextRequest, NextResponse } from 'next/server';
import { getShopById, updateShop } from '@/lib/store';
import type { Review } from '@/lib/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ reviews: shop.reviews ?? [] });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });

  const body = await req.json();
  const { rating, comment, nickname, photoUrl } = body;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: '별점을 선택해주세요.' }, { status: 400 });
  }
  if (!comment?.trim()) {
    return NextResponse.json({ error: '리뷰 내용을 입력해주세요.' }, { status: 400 });
  }

  const review: Review = {
    id: `rv-${Date.now()}`,
    rating,
    comment: comment.trim(),
    nickname: nickname?.trim() || '방문객',
    photoUrl: photoUrl || undefined,
    createdAt: new Date().toISOString(),
  };

  const reviews = [...(shop.reviews ?? []), review];
  await updateShop(id, { reviews });

  return NextResponse.json({ review });
}
