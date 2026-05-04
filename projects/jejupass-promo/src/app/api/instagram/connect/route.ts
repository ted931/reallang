import { NextRequest, NextResponse } from 'next/server';
import { getShopById, updateShop } from '@/lib/store';
import type { InstagramConfig } from '@/lib/types';

// POST /api/instagram/connect
// Body: { shopId, token, userId, username }
export async function POST(req: NextRequest) {
  const { shopId, token, userId, username } = await req.json();

  if (!shopId || !token || !userId) {
    return NextResponse.json({ error: 'shopId, token, userId는 필수입니다.' }, { status: 400 });
  }

  const shop = await getShopById(shopId);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });

  const instagram: InstagramConfig = {
    token,
    userId,
    username: username || userId,
    connectedAt: new Date().toISOString(),
  };

  await updateShop(shopId, { instagram });

  return NextResponse.json({ success: true, username: instagram.username });
}

// DELETE /api/instagram/connect
// Body: { shopId }
export async function DELETE(req: NextRequest) {
  const { shopId } = await req.json();
  const shop = await getShopById(shopId);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });

  await updateShop(shopId, { instagram: undefined });
  return NextResponse.json({ success: true });
}
