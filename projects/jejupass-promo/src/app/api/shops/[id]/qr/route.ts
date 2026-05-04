import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getShopById } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'png'; // png | svg

  const shopUrl = `https://jejupass.com/web/shop/${shop.slug}`;

  if (format === 'svg') {
    const svg = await QRCode.toString(shopUrl, {
      type: 'svg',
      margin: 2,
      color: { dark: '#1F2937', light: '#FFFFFF' },
    });
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // PNG — 카드 크기 (600×600)
  const buffer = await QRCode.toBuffer(shopUrl, {
    type: 'png',
    width: 600,
    margin: 2,
    color: { dark: '#1F2937', light: '#FFFFFF' },
  });

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${shop.slug}-qr.png"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
