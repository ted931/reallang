import { NextRequest, NextResponse } from 'next/server';
import { getShopById, updateShop } from '@/lib/store';

// POST /api/shops/[id]/view — 조회수 1 증가
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) return NextResponse.json({ ok: false }, { status: 404 });

  const monthKey = new Date().toISOString().slice(0, 7); // "2026-05"
  const prev = shop.stats ?? { views: 0, viewsByMonth: {} };
  const stats = {
    views: prev.views + 1,
    viewsByMonth: {
      ...prev.viewsByMonth,
      [monthKey]: (prev.viewsByMonth[monthKey] ?? 0) + 1,
    },
  };

  await updateShop(id, { stats });
  return NextResponse.json({ ok: true, views: stats.views });
}
