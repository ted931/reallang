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

// ── 로그인 유도 카드 ───────────────────────────────────────
function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto shadow-sm">
      <div
        className="w-16 h-16 mx-auto rounded-2xl grid place-items-center text-3xl"
        style={{ background: 'linear-gradient(135deg,#FED7AA,#FB923C)' }}
      >
        🔐
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 mt-5">사장님, 로그인이 필요해요</h2>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        제주패스 프로모션 대시보드를<br />이용하려면 사업자 계정으로 로그인하세요.
      </p>
      <Link
        href="/login"
        className="mt-6 w-full py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow shadow-orange-200/50 transition-colors block text-center"
        onClick={onLogin}
      >
        로그인하기
      </Link>
      <Link
        href="/signup"
        className="mt-2 w-full py-2 text-sm text-slate-500 hover:text-slate-700 block text-center"
      >
        아직 계정이 없으신가요? 사업자 등록 →
      </Link>
    </div>
  );
}

// ── 빈 가게 상태 ─────────────────────────────────────────
function EmptyShops() {
  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-orange-200 p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 grid place-items-center text-3xl">🏪</div>
      <p className="text-slate-900 font-bold text-lg mt-4">아직 등록된 가게가 없어요</p>
      <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
        제주패스 사용자에게 매장을 노출시키려면 가게를 등록하세요.
      </p>
      <Link
        href="/register"
        className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 shadow shadow-orange-200/50 transition-colors"
      >
        + 가게 등록하기
      </Link>
    </div>
  );
}

// ── 통계 카드 ─────────────────────────────────────────────
interface StatItem {
  label: string;
  value: string;
  change: string;
  changeColor: string;
  icon: string;
  up?: boolean;
  tintBg: string;
  tintColor: string;
}

function StatCard({ stat }: { stat: StatItem }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-lg grid place-items-center text-base shrink-0"
          style={{ background: stat.tintBg, color: stat.tintColor }}
        >
          {stat.icon}
        </div>
        {stat.change && (
          <span className={`text-[10px] font-bold ${stat.changeColor}`}>
            {stat.up === true ? '▲ ' : stat.up === false ? '▼ ' : ''}{stat.change}
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-3">{stat.label}</p>
      <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">{stat.value}</p>
    </div>
  );
}

// ── 가게 카드 ─────────────────────────────────────────────
function ShopCard({ shop }: { shop: Shop }) {
  const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    active: { label: '영업중', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: '#10B981' },
    pending: { label: '심사중', bg: 'bg-amber-50', text: 'text-amber-700', dot: '#F59E0B' },
    paused: { label: '중지', bg: 'bg-slate-100', text: 'text-slate-600', dot: '#94A3B8' },
  };
  const statusKey = shop.isPublished ? 'active' : 'paused';
  const c = statusConfig[statusKey];
  const primaryPhoto = shop.photos?.find((p) => p.isPrimary);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-orange-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        {primaryPhoto ? (
          <img
            src={primaryPhoto.url}
            alt={shop.name}
            className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 shrink-0 grid place-items-center text-xl">
            🏪
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold text-slate-900 truncate">{shop.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text} inline-flex items-center gap-1`}>
              <span className="w-1 h-1 rounded-full" style={{ background: c.dot }} />
              {c.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{shop.address}</p>
          <div className="flex items-center gap-3 mt-3 text-xs">
            <span className="text-slate-500">
              👁 <span className="font-bold text-slate-800 tabular-nums">{(shop.stats?.views ?? 0).toLocaleString()}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">
              ⭐ <span className="font-bold text-slate-800 tabular-nums">{shop.reviews?.length ?? 0}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">
              📷 <span className="font-bold text-slate-800 tabular-nums">{shop.visitorPhotos?.length ?? 0}</span>
            </span>
          </div>
        </div>
        <Link
          href={`/dashboard/shop/${shop.id}/edit`}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 px-2 py-1 rounded-lg hover:bg-orange-50 shrink-0 transition-colors"
        >
          관리 →
        </Link>
      </div>
    </div>
  );
}

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
    ? `${Math.abs(Math.round(((monthViews - prevViews) / prevViews) * 100))}%`
    : '첫 달';
  const viewUp = prevViews > 0 ? monthViews >= prevViews : undefined;

  const STATS: StatItem[] = shop
    ? [
        {
          label: '이번 달 페이지 조회',
          value: `${monthViews.toLocaleString()}회`,
          change: totalViews > 0 ? `누적 ${totalViews.toLocaleString()}회` : viewChange,
          changeColor: monthViews >= prevViews ? 'text-emerald-600' : 'text-rose-500',
          icon: '👁️',
          up: viewUp,
          tintBg: '#FFF7ED',
          tintColor: '#EA580C',
        },
        {
          label: '리뷰 수',
          value: `${shop.reviews?.length ?? 0}개`,
          change: '총 누적',
          changeColor: 'text-slate-400',
          icon: '⭐',
          tintBg: '#FEFCE8',
          tintColor: '#CA8A04',
        },
        {
          label: '방문자 사진',
          value: `${shop.visitorPhotos?.length ?? 0}장`,
          change: '총 누적',
          changeColor: 'text-orange-500',
          icon: '📷',
          tintBg: '#EFF6FF',
          tintColor: '#2563EB',
        },
        {
          label: '공지사항',
          value: `${shop.notices?.length ?? 0}개`,
          change: '등록됨',
          changeColor: 'text-slate-400',
          icon: '📢',
          tintBg: '#F0FDF4',
          tintColor: '#16A34A',
        },
      ]
    : [
        { label: '이번 달 페이지 조회', value: '—', change: '', changeColor: 'text-slate-400', icon: '👁️', tintBg: '#FFF7ED', tintColor: '#EA580C' },
        { label: '리뷰 수', value: '—', change: '', changeColor: 'text-slate-400', icon: '⭐', tintBg: '#FEFCE8', tintColor: '#CA8A04' },
        { label: '방문자 사진', value: '—', change: '', changeColor: 'text-slate-400', icon: '📷', tintBg: '#EFF6FF', tintColor: '#2563EB' },
        { label: '공지사항', value: '—', change: '', changeColor: 'text-slate-400', icon: '📢', tintBg: '#F0FDF4', tintColor: '#16A34A' },
      ];

  const today = new Date();
  const todayStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg" style={{ color: BRAND.color }}>
            제주패스
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-600 hidden sm:block">{user.name}님</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-bold px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow shadow-orange-200/50">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 비로그인 상태 */}
      {!user ? (
        <div className="px-4 py-16 max-w-3xl mx-auto">
          <LoginPrompt onLogin={() => router.push('/login')} />
        </div>
      ) : (
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

          {/* 인사 + CTA */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">{todayStr}</p>
              <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
                안녕하세요, {user.name}님 👋
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">오늘도 좋은 하루 되세요</p>
            </div>
            <Link
              href="/register"
              className="px-4 py-2.5 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 transition-colors shadow shadow-orange-200/50"
            >
              + 가게 등록
            </Link>
          </div>

          {/* 통계 카드 */}
          <section>
            <h2 className="text-sm font-bold text-slate-700 mb-3">이번 달 현황</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </section>

          {/* 내 가게 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700">
                내 가게{' '}
                <span className="text-slate-400">({user.shopIds.length})</span>
              </h2>
              <button className="text-xs text-orange-600 font-bold hover:text-orange-700 transition-colors">
                전체 보기 →
              </button>
            </div>

            {shopLoading && (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!shopLoading && user.shopIds.length === 0 && <EmptyShops />}

            {!shopLoading && shop && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ShopCard shop={shop} />
              </div>
            )}
          </section>

          {/* 빠른 메뉴 */}
          <section>
            <h2 className="text-sm font-bold text-slate-700 mb-3">빠른 메뉴</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/sns"
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-200 hover:shadow-sm transition-all block"
              >
                <div className="text-2xl mb-2">📸</div>
                <h3 className="font-extrabold text-slate-900">SNS 콘텐츠 만들기</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">인스타그램 카드, 스토리, 카카오톡 공유 카드를 자동 생성</p>
              </Link>

              <Link
                href="/register"
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-200 hover:shadow-sm transition-all block"
              >
                <div className="text-2xl mb-2">🏪</div>
                <h3 className="font-extrabold text-slate-900">새 가게 등록</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">새로운 가게를 등록하고 홍보를 시작하세요</p>
              </Link>

              <Link
                href="/explore"
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-200 hover:shadow-sm transition-all block"
              >
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-extrabold text-slate-900">가게 탐색</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">등록된 제주 가게들을 둘러보세요</p>
              </Link>

              <a
                href="http://localhost:3022/partner"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl p-5 border border-amber-200 hover:shadow-sm transition-all block"
                style={{ backgroundColor: '#FFFBEB' }}
              >
                <div className="text-2xl mb-2">📣</div>
                <h3 className="font-extrabold text-slate-900">파티 파트너 신청</h3>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">jeju-party 여행자에게 할인 오퍼를 노출하세요</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">외부 연동</span>
              </a>

              <Link
                href="/dashboard/cafepass"
                className="rounded-2xl p-5 border border-orange-200 hover:shadow-sm transition-all block sm:col-span-2"
                style={{ backgroundColor: '#FFF7F0' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">☕</div>
                    <h3 className="font-extrabold text-slate-900">카페패스 입점 신청</h3>
                    <p className="text-xs text-orange-700 mt-1 leading-relaxed">검증된 카페만 선정. 월 안정적인 고객 유입</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-white bg-orange-500 px-2.5 py-1 rounded-full shrink-0 mt-1">수익화</span>
                </div>
              </Link>
            </div>
          </section>

          {/* SNS 게시 이력 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700">이번 달 SNS 게시 이력</h2>
              <Link href="/dashboard/sns" className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors">
                전체 보기 →
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5">
              {SNS_HISTORY.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${item.typeColor}`}>
                    {item.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 truncate">{item.content}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium tabular-nums">{item.date}</p>
                  </div>
                  <Link
                    href="/dashboard/sns"
                    className="shrink-0 text-xs font-bold border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    다시 생성
                  </Link>
                </div>
              ))}
            </div>
          </section>

        </main>
      )}
    </div>
  );
}
