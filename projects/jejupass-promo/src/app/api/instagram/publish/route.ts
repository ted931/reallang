import { NextRequest, NextResponse } from 'next/server';
import { getShopById } from '@/lib/store';

// Instagram Graph API로 이미지 게시
// https://developers.facebook.com/docs/instagram-api/guides/content-publishing
async function publishToInstagram(token: string, userId: string, imageUrl: string, caption: string) {
  // Step 1: 미디어 컨테이너 생성
  const containerRes = await fetch(
    `https://graph.instagram.com/${userId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: token,
      }),
    }
  );
  const container = await containerRes.json();
  if (!containerRes.ok || !container.id) {
    throw new Error(container.error?.message || '미디어 컨테이너 생성 실패');
  }

  // Step 2: 게시
  const publishRes = await fetch(
    `https://graph.instagram.com/${userId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: token,
      }),
    }
  );
  const published = await publishRes.json();
  if (!publishRes.ok || !published.id) {
    throw new Error(published.error?.message || '게시 실패');
  }

  return published.id;
}

// POST /api/instagram/publish
// Body: { shopId, imageUrl, caption }
// imageUrl은 공개 접근 가능한 URL이어야 함 (Instagram API 요구사항)
export async function POST(req: NextRequest) {
  const { shopId, imageUrl, caption } = await req.json();

  if (!shopId || !imageUrl || !caption) {
    return NextResponse.json({ error: 'shopId, imageUrl, caption은 필수입니다.' }, { status: 400 });
  }

  const shop = await getShopById(shopId);
  if (!shop) return NextResponse.json({ error: '가게를 찾을 수 없습니다.' }, { status: 404 });

  // 연동 여부 확인
  if (!shop.instagram?.token) {
    return NextResponse.json({ status: 'not_connected', error: 'Instagram 계정이 연동되지 않았습니다.' }, { status: 200 });
  }

  // 개발 환경에서는 실제 게시 스킵 (localhost URL은 Instagram이 접근 불가)
  if (imageUrl.includes('localhost') || imageUrl.startsWith('/')) {
    return NextResponse.json({
      status: 'dev_skip',
      message: '개발 환경에서는 실제 게시가 생략됩니다. 프로덕션 배포 후 공개 URL로 정상 동작합니다.',
      caption,
      shop: shop.name,
    });
  }

  try {
    const postId = await publishToInstagram(
      shop.instagram.token,
      shop.instagram.userId,
      imageUrl,
      caption
    );
    return NextResponse.json({ status: 'published', postId });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}
