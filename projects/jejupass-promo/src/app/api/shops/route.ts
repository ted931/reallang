import { NextRequest, NextResponse } from 'next/server';
import { getShops, createShop, filterShops } from '@/lib/store';
import { generateId, generateSlug } from '@/lib/utils';
import type { Shop } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') || undefined;
  const region = searchParams.get('region') || undefined;
  const q = searchParams.get('q') || undefined;

  const shops = await filterShops({ category, region, q });
  return NextResponse.json({ shops, total: shops.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, category, region, description, address, phone, businessHours, menus, photos } = body;

  if (!name || !category || !region || !address) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const shop: Shop = {
    id: generateId(),
    slug: generateSlug(name),
    name,
    category,
    region,
    description: description || '',
    address,
    phone: phone || '',
    businessHours: businessHours || {},
    photos: photos || [],
    menus: menus || [],
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  };

  await createShop(shop);
  return NextResponse.json({ shop }, { status: 201 });
}
