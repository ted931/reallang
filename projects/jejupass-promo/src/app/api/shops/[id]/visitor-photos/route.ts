import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getShopById, updateShop } from '@/lib/store';
import type { VisitorPhoto } from '@/lib/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get('photo') as File | null;
  const nickname = (formData.get('nickname') as string) || '방문객';

  if (!file) return NextResponse.json({ error: '사진을 선택해주세요.' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `visitor-${Date.now()}.${ext}`;
  const dirPath = path.join(process.cwd(), 'public', 'uploads', id);
  await mkdir(dirPath, { recursive: true });
  await writeFile(path.join(dirPath, filename), buffer);

  const photo: VisitorPhoto = {
    id: `vp-${Date.now()}`,
    url: `/uploads/${id}/${filename}`,
    nickname,
    uploadedAt: new Date().toISOString(),
  };

  const visitorPhotos = [...(shop.visitorPhotos ?? []), photo];
  await updateShop(id, { visitorPhotos });

  return NextResponse.json({ photo });
}
