'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/constants';
import type { Shop } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface LocalUser {
  id: string;
  name: string;
  email: string;
  shopIds: string[];
}

const SNS_HISTORY = [
  { type: '인스타 피드', date: '2026-04-25', content: '제주 감귤 에이드 새 메뉴 출시🍊', typeColor: 'bg-pink-100 text-pink-700' },
  { type: '인스타 스토리', date: '2026-04-20', content: '주말 특별 메뉴 안내', typeColor: 'bg-purple-100 text-purple-700' },
  { type: '카카오톡', date: '2026-04-15', content: '봄 시즌 한정 메뉴', typeColor: 'bg-yellow-100 text-yellow-700' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopLoading, setShopLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('jejupass_user');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as LocalUser;
      setUser(parsed);
      if (parsed.shopIds && parsed.shopIds.length > 0) {
        fetchShop(parsed.shopIds[0]);
      }
    } catch {
      // 파싱 실패 시 무시
    }
  }, []);

  async function fetchShop(shopId: string) {
    setShopLoading(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shopId}`);
      if (res.ok) {
        const data = await res.json();
        setShop(data.shop);
      }
    } finally {
      setShopLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('jejupass_user');
    router.push('/login');
  }

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthViews = shop?.stats?.viewsByMonth?.[thisMonth] ?? 0;
  const totalViews = shop?.stats?.views ?? 0;
  const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  const prevViews = shop?.stats?.viewsByMonth?.[prevMonth] ?? 0;
  const viewChange = prevViews > 0
    ? `${monthViews >= prevViews ? '+' : ''}${Math.round(((monthViews - prevViews) / prevViews) * 100)}%`
    : '첫 달';

  const STATS = shop
    ? [
        { label: '이번 달 페이지 조회', value: `${monthViews.toLocaleString()}회`, change: totalViews > 0 ? `누적 ${totalViews.toLocaleString()}회` : viewChange, changeColor: monthViews >= prevViews ? 'text-green-600' : 'text-red-500', icon: '👁️' },
        { label: '리뷰 수', value: `${shop.reviews?.length ?? 0}개`, change: '총 누적', changeColor: 'text-gray-400', icon: '⭐' },
        { label: '방문자 사진', value: `${shop.visitorPhotos?.length ?? 0}장`, change: '총 누적', changeColor: 'text-orange-500', icon: '📷' },
        { label: '공지사항', value: `${shop.notices?.length ?? 0}개`, change: '등록됨', changeColor: 'text-gray-400', icon: '📢' },
      ]
    : [
        { label: '이번 달 페이지 조회', value: '—', change: '', changeColor: 'text-gray-400', icon: '👁️' },
        { label: '리뷰 수', value: '—', change: '', changeColor: 'text-gray-400', icon: '⭐' },
        { label: '방문자 사진', value: '—', change: '', changeColor: 'text-gray-400', icon: '📷' },
        { label: '공지사항', value: '—', change: '', changeColor: 'text-gray-400', icon: '📢' },
      ];

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">{user.name}님</span>
                <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm text-gray-500">로그인</Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">사장님 대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user ? `${user.name}님, 내 가게를 관리하고 SNS 콘텐츠를 만들어보세요.` : '내 가게를 관리하고 SNS 콘텐츠를 만들어보세요.'}
            </p>
          </div>
          {!user && (
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND.color }}
            >
              로그인
            </Link>
          )}
        </div>

        {/* 내 가게 카드 */}
        {shopLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-center h-24">
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : shop ? (
          <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3">내 가게</h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {shop.photos?.find((p) => p.isPrimary) && (
                  <img
                    src={shop.photos.find((p) => p.isPrimary)!.url}
                    alt={shop.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{shop.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{shop.address}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${shop.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {shop.isPublished ? '영업중' : '비공개'}
                    </span>
                    <span className="text-xs text-gray-400">리뷰 {shop.reviews?.length ?? 0}개</span>
                    <span className="text-xs text-gray-400">방문사진 {shop.visitorPhotos?.length ?? 0}장</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/dashboard/shop/${shop.id}/edit`}
                className="shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:bg-orange-50"
                style={{ color: BRAND.color, borderColor: BRAND.color }}
              >
                내 가게 관리
              </Link>
            </div>
          </section>
        ) : user && user.shopIds.length === 0 ? (
          <section>
            <div className="bg-white rounded-2xl border border-dashed border-orange-200 p-8 text-center">
              <div className="text-4xl mb-3">🏪</div>
              <p className="text-gray-700 font-semibold">아직 등록된 가게가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">첫 번째 가게를 등록하고 홍보를 시작하세요!</p>
              <Link
                href="/register"
                className="inline-block text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND.color }}
              >
                가게 등록하기
              </Link>
            </div>
          </section>
        ) : null}

        {/* 섹션 1: 이번 달 현황 통계 */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">이번 달 현황</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                {stat.change && <div className={`text-xs font-medium mt-1 ${stat.changeColor}`}>{stat.change}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* 섹션 2: 빠른 메뉴 */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">빠른 메뉴</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/dashboard/sns" className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-bold text-gray-900">SNS 콘텐츠 만들기</h3>
              <p className="text-sm text-gray-500 mt-1">인스타그램 카드, 스토리, 카카오톡 공유 카드를 자동 생성</p>
            </Link>

            <Link href="/register" className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all">
              <div className="text-3xl mb-3">🏪</div>
              <h3 className="font-bold text-gray-900">새 가게 등록</h3>
              <p className="text-sm text-gray-500 mt-1">새로운 가게를 등록하고 홍보를 시작하세요</p>
            </Link>

            <Link href="/explore" className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-900">가게 탐색</h3>
              <p className="text-sm text-gray-500 mt-1">등록된 제주 가게들을 둘러보세요</p>
            </Link>

            <a
              href="http://localhost:3022/partner"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl p-6 border border-amber-200 hover:shadow-sm transition-all"
              style={{ backgroundColor: '#FFFBEB' }}
            >
              <div className="text-3xl mb-3">📣</div>
              <h3 className="font-bold text-gray-900">파티 파트너 신청</h3>
              <p className="text-sm text-amber-700 mt-1">jeju-party 여행자에게 할인 오퍼를 노출하세요</p>
              <span className="inline-block mt-2 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">외부 연동</span>
            </a>

            <Link
              href="/dashboard/cafepass"
              className="block rounded-xl p-6 border border-orange-200 hover:shadow-sm transition-all sm:col-span-2"
              style={{ backgroundColor: '#FFF7F0' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl mb-3">☕</div>
                  <h3 className="font-bold text-gray-900">카페패스 입점 신청</h3>
                  <p className="text-sm text-orange-700 mt-1">검증된 카페만 선정. 월 안정적인 고객 유입</p>
                </div>
                <span className="text-xs font-semibold text-white bg-orange-500 px-2.5 py-1 rounded-full shrink-0 mt-1">수익화</span>
              </div>
            </Link>
          </div>
        </section>

        {/* 섹션 3: SNS 게시 이력 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-700">이번 달 SNS 게시 이력</h2>
            <Link href="/dashboard/sns" className="text-xs font-medium" style={{ color: BRAND.color }}>전체 보기 →</Link>
          </div>
          <div className="space-y-3">
            {SNS_HISTORY.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${item.typeColor}`}>{item.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{item.content}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                </div>
                <Link
                  href="/dashboard/sns"
                  className="shrink-0 text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  다시 생성
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
