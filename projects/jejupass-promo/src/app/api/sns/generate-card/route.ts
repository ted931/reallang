import { NextRequest, NextResponse } from 'next/server';
import { generateCard, type TemplateType } from '@/lib/sns/generateCard';
import { getShopById } from '@/lib/store';
import { CATEGORY_MAP, REGION_MAP } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shopId, template, caption, photoUrl } = body as {
      shopId: string;
      template: TemplateType;
      caption?: string;
      photoUrl?: string;
    };

    if (!shopId || !template) {
      return NextResponse.json({ error: 'shopId와 template이 필요합니다.' }, { status: 400 });
    }

    const shop = await getShopById(shopId);
    if (!shop) {
      return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });
    }

    const categoryLabel = CATEGORY_MAP[shop.category] || shop.category;
    const regionLabel = REGION_MAP[shop.region] || shop.region;

    // 사진: 요청에서 지정된 것 > 가게 대표 사진 > 없음 (없으면 플레이스홀더)
    const photo = photoUrl || shop.photos?.find(p => p.isPrimary)?.url || shop.photos?.[0]?.url || undefined;

    const png = await generateCard(template, {
      shopName: shop.name,
      category: categoryLabel,
      region: regionLabel,
      caption: caption || shop.description || `${regionLabel}의 ${categoryLabel}`,
      photoUrl: photo,
    });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="card-${template}.png"`,
      },
    });
  } catch (err) {
    console.error('SNS card generation error:', err);
    return NextResponse.json(
      { error: '이미지 생성 중 오류가 발생했습니다.', detail: String(err) },
      { status: 500 }
    );
  }
}
