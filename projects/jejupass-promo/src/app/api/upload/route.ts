import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const shopId = formData.get('shopId') as string | null;

  if (!file) {
    return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 파일명 생성
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}.${ext}`;
  const dirPath = shopId
    ? path.join(process.cwd(), 'public', 'uploads', shopId)
    : path.join(process.cwd(), 'public', 'uploads');

  await mkdir(dirPath, { recursive: true });

  const filePath = path.join(dirPath, filename);
  await writeFile(filePath, buffer);

  const url = shopId ? `/uploads/${shopId}/${filename}` : `/uploads/${filename}`;

  return NextResponse.json({ url, filename });
}
