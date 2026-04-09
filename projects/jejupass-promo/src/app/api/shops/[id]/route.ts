import { NextRequest, NextResponse } from 'next/server';
import { getShopById, updateShop } from '@/lib/store';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ shop });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const shop = await updateShop(id, updates);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });
  return NextResponse.json({ shop });
}
