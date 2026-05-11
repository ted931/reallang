"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DUMMY_MARKET, MARKET_CATEGORY_LABEL, MARKET_CATEGORY_ICON, CONDITION_LABEL,
  type MarketCategory,
} from "@/lib/dummy-market";

const CATEGORIES: Array<MarketCategory | "전체"> = ["전체", "rod", "reel", "lure", "line", "hook", "box", "wear", "etc"];
type ViewMode = "list" | "card" | "album";

const CATS_META: Record<string, { icon: string; color: string }> = {
  전체:  { icon: '🛒', color: '#5fa3cf' },
  rod:   { icon: '🎣', color: '#5fa3cf' },
  reel:  { icon: '⚙️', color: '#fbbf24' },
  lure:  { icon: '🪝', color: '#86efac' },
  line:  { icon: '🧵', color: '#a78bfa' },
  hook:  { icon: '🎣', color: '#5fa3cf' },
  box:   { icon: '🧰', color: '#a78bfa' },
  wear:  { icon: '🧥', color: '#f87171' },
  etc:   { icon: '🪛', color: '#fb923c' },
};

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="2" width="16" height="2" rx="1"/>
      <rect x="0" y="7" width="16" height="2" rx="1"/>
      <rect x="0" y="12" width="16" height="2" rx="1"/>
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="0" width="7" height="7" rx="1"/>
      <rect x="9" y="0" width="7" height="7" rx="1"/>
      <rect x="0" y="9" width="7" height="7" rx="1"/>
      <rect x="9" y="9" width="7" height="7" rx="1"/>
    </svg>
  );
}
function AlbumIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="0" width="4.5" height="4.5" rx="0.5"/>
      <rect x="5.75" y="0" width="4.5" height="4.5" rx="0.5"/>
      <rect x="11.5" y="0" width="4.5" height="4.5" rx="0.5"/>
      <rect x="0" y="5.75" width="4.5" height="4.5" rx="0.5"/>
      <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.5"/>
      <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.5"/>
      <rect x="0" y="11.5" width="4.5" height="4.5" rx="0.5"/>
      <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.5"/>
      <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.5"/>
    </svg>
  );
}

type MarketItem = typeof DUMMY_MARKET[0];

function SectionHeader({ kicker, title, subtitle, accent }: {
  kicker: string; title: string; subtitle: string; accent?: string;
}) {
  return (
    <div className="fl-sec-head" style={{ paddingTop: 20, paddingBottom: 4 }}>
      <div className="fl-sec-bar" style={{ background: accent ?? 'var(--hook)' }} />
      <div className="fl-sec-text">
        <div className="fl-sec-kicker" style={{ color: accent ?? 'var(--hook)' }}>{kicker}</div>
        <div className="fl-sec-title">{title}</div>
        {subtitle && <div className="fl-sec-sub">{subtitle}</div>}
      </div>
    </div>
  );
}

function MarketCard({ it, onOpen }: { it: MarketItem; onOpen: (it: MarketItem) => void }) {
  const catMeta = CATS_META[it.category] ?? CATS_META.etc;
  const cond = CONDITION_LABEL[it.condition];
  const off = Math.round((1 - it.price / it.originalPrice) * 100);
  const isSold = it.status === 'sold';
  // dummy hue from category
  const hueMap: Record<string, number> = { rod: 210, reel: 30, lure: 150, line: 195, hook: 20, box: 270, wear: 350, etc: 180 };
  const hue = hueMap[it.category] ?? 200;

  return (
    <div
      className={`fl-mk-card ${isSold ? 'sold' : ''}`}
      onClick={() => !isSold && onOpen(it)}
    >
      <div className="fl-mk-strip" style={{ background: cond.color.split(' ')[0].replace('bg-', '') }}>
        <span style={{ color: 'var(--ocean-950)', fontWeight: 800 }}>{cond.label}</span>
        <span className="fl-mk-strip-cat">{catMeta.icon} {MARKET_CATEGORY_LABEL[it.category]}</span>
      </div>
      <div className="fl-mk-img" style={{ '--hue': hue } as React.CSSProperties}>
        <div className="fl-mk-img-pat" />
        <div className="fl-mk-img-icon">{it.images[0]}</div>
        {off > 30 && !isSold && (
          <div className="fl-mk-off">
            <svg viewBox="0 0 60 60" className="fl-mk-off-svg">
              <defs>
                <path id="cir" d="M30,30 m-22,0 a22,22 0 1,1 44,0 a22,22 0 1,1 -44,0" />
              </defs>
              <circle cx="30" cy="30" r="26" fill="#dc2626" />
              <text fontSize="9" fontWeight="700" fill="#fef3c7">
                <textPath href="#cir" startOffset="0">FISHING · LOG · SALE · </textPath>
              </text>
            </svg>
            <div className="fl-mk-off-n">-{off}<span>%</span></div>
          </div>
        )}
        {it.status === 'reserved' && !isSold && (
          <div className="fl-mk-hot">🔥 예약중</div>
        )}
        {isSold && (
          <div className="fl-mk-sold-overlay">
            <div className="fl-mk-sold-stamp">SOLD</div>
          </div>
        )}
      </div>
      <div className="fl-mk-body">
        <div className="fl-mk-title">{it.title}</div>
        <div className="fl-mk-desc">{it.description}</div>
        <div className="fl-mk-price-row">
          <div className="fl-mk-price">
            {it.price.toLocaleString()}<span>원</span>
          </div>
          {off > 0 && <div className="fl-mk-was">{it.originalPrice.toLocaleString()}원</div>}
        </div>
        <div className="fl-mk-foot">
          <span>📍 {it.region}</span>
          <span>♡ {it.likes}</span>
        </div>
      </div>
    </div>
  );
}

function MarketDetail({ it, onClose }: { it: MarketItem; onClose: () => void }) {
  const catMeta = CATS_META[it.category] ?? CATS_META.etc;
  const cond = CONDITION_LABEL[it.condition];
  const off = Math.round((1 - it.price / it.originalPrice) * 100);
  const hueMap: Record<string, number> = { rod: 210, reel: 30, lure: 150, line: 195, hook: 20, box: 270, wear: 350, etc: 180 };
  const hue = hueMap[it.category] ?? 200;

  return (
    <>
      <div className="fl-mk-detail-img" style={{ '--hue': hue } as React.CSSProperties}>
        <div className="fl-mk-img-pat" />
        <div className="fl-mk-detail-icon">{it.images[0]}</div>
        <button className="fl-mk-detail-back" onClick={onClose}>←</button>
        <div className="fl-mk-detail-dots">
          <span className="on" /><span /><span /><span />
        </div>
      </div>
      <div className="fl-mk-detail-body">
        <div className="fl-mk-detail-strip">
          <span className="fl-mk-detail-cond" style={{ background: '#5eead4', color: 'var(--ocean-950)' }}>{cond.label}</span>
          <span className="fl-mk-detail-cat">{catMeta.icon} {MARKET_CATEGORY_LABEL[it.category]}</span>
        </div>
        <h1 className="fl-mk-detail-title">{it.title}</h1>
        <div className="fl-mk-detail-meta">
          <span>📍 {it.region}</span>
          <span>♡ {it.likes}</span>
          <span>{new Date(it.createdAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</span>
        </div>

        <div className="fl-mk-detail-seller">
          <div className="fl-my-avatar" style={{ width: 44, height: 44, fontSize: 20 }}>👤</div>
          <div>
            <div className="fl-mk-seller-name">{it.sellerName}</div>
            <div className="fl-mk-seller-sub">매너온도 36.5° · 거래 12회</div>
          </div>
          <button className="fl-mk-seller-fol">팔로우</button>
        </div>

        <div className="fl-mk-detail-desc">
          <p>{it.description}</p>
          <p>제주시 직거래 우선이며, 안전결제 가능합니다. 사진 추가 요청 시 채팅으로 연락 주세요.</p>
        </div>

        <SectionHeader kicker="ITEMS" title="이 판매자의 다른 상품" subtitle="" accent="#5fa3cf" />
        <div className="fl-mk-rel">
          {DUMMY_MARKET.filter(i => i.id !== it.id).slice(0, 3).map(r => {
            const rMeta = CATS_META[r.category] ?? CATS_META.etc;
            const rHue = hueMap[r.category] ?? 200;
            return (
              <div key={r.id} className="fl-mk-rel-c" style={{ '--hue': rHue } as React.CSSProperties}>
                <div className="fl-mk-rel-img"><span>{rMeta.icon}</span></div>
                <div className="fl-mk-rel-info">
                  <div className="fl-mk-rel-t">{r.title}</div>
                  <div className="fl-mk-rel-p">{r.price.toLocaleString()}원</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fl-mk-bottom-bar">
        <button className="fl-mk-fav-btn"><span>♡</span></button>
        <div className="fl-mk-bottom-price">
          {off > 0 && (
            <div className="fl-mk-bottom-was">
              {it.originalPrice.toLocaleString()}원 <span style={{ color: '#f87171', fontWeight: 800 }}>-{off}%</span>
            </div>
          )}
          <div className="fl-mk-bottom-now">{it.price.toLocaleString()}<span>원</span></div>
        </div>
        <button className="fl-mk-chat">채팅하기</button>
      </div>
    </>
  );
}

function MarketList({ onOpen }: { onOpen: (it: MarketItem) => void }) {
  const [cat, setCat] = useState<MarketCategory | '전체'>('전체');
  const [sort, setSort] = useState('new');
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [view, setView] = useState<ViewMode>('card');

  const filtered = DUMMY_MARKET.filter(m => {
    if (!showSoldOut && m.status === 'sold') return false;
    if (cat !== '전체' && m.category !== cat) return false;
    return true;
  });

  return (
    <>
      <section className="fl-catch-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-tide-hero-inner">
          <div className="fl-catch-hero-kicker">MARKET</div>
          <h1 className="fl-catch-hero-title">
            중고 낚시장비<br /><span className="fl-hero-accent">싸게 사고 빠르게 팔자</span>
          </h1>
          <div className="fl-catch-hero-meta">
            <span>이번 주 거래 142건</span>
            <span className="fl-cond-sep" />
            <span>제주 지역 직거래</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link href="/market/sell" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--hook)', color: 'var(--ocean-950)', fontWeight: 800, fontSize: 14, padding: '10px 20px', borderRadius: 12, textDecoration: 'none' }}>
              ✏️ 판매글 올리기
            </Link>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      {/* 카테고리 */}
      <div className="fl-cat-pick">
        {CATEGORIES.map(c => {
          const meta = CATS_META[c] ?? CATS_META.etc;
          return (
            <button
              key={c}
              className={`fl-cat-c ${cat === c ? 'on' : ''}`}
              style={cat === c ? { '--cc': meta.color } as React.CSSProperties : {}}
              onClick={() => setCat(c)}
            >
              <div className="fl-cat-c-ic" style={{ background: `${meta.color}22`, color: meta.color }}>{meta.icon}</div>
              <div className="fl-cat-c-l">{c === '전체' ? '전체' : MARKET_CATEGORY_LABEL[c as MarketCategory]}</div>
            </button>
          );
        })}
      </div>

      {/* 옵션 바 */}
      <div className="fl-filters" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="fl-sort">
            {([['new', '최신순'], ['cheap', '낮은가격'], ['like', '관심많은']] as const).map(([k, l]) => (
              <button key={k} className={`fl-sort-btn ${sort === k ? 'on' : ''}`} onClick={() => setSort(k)}>{l}</button>
            ))}
          </div>
          <div className="fl-filter-count"><strong>{filtered.length}</strong>건</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 판매완료 토글 */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>완료포함</span>
            <div
              onClick={() => setShowSoldOut(v => !v)}
              style={{
                width: 32, height: 16, borderRadius: 8, position: 'relative', cursor: 'pointer',
                background: showSoldOut ? 'var(--hook)' : 'var(--tint-10)',
              }}
            >
              <div style={{
                position: 'absolute', top: 2, width: 12, height: 12, borderRadius: '50%',
                background: '#fff', transition: 'all 0.2s',
                left: showSoldOut ? 18 : 2,
              }} />
            </div>
          </label>
          {/* 뷰 모드 */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--ocean-900)', border: '1px solid var(--line)', borderRadius: 10, padding: 3 }}>
            {([
              { mode: 'list' as ViewMode, Icon: ListIcon },
              { mode: 'card' as ViewMode, Icon: CardIcon },
              { mode: 'album' as ViewMode, Icon: AlbumIcon },
            ]).map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                style={{
                  width: 28, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: view === mode ? 'var(--hook)' : 'transparent',
                  color: view === mode ? 'var(--ocean-950)' : 'var(--text-dim)',
                }}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      {filtered.length === 0 ? (
        <div className="fl-empty">
          <div className="fl-empty-title">해당 카테고리 상품이 없습니다</div>
          <div className="fl-empty-sub">다른 카테고리를 선택해 보세요</div>
        </div>
      ) : (
        <>
          {view === 'card' && (
            <div className="fl-mk-grid">
              {filtered.map(m => <MarketCard key={m.id} it={m} onOpen={onOpen} />)}
            </div>
          )}
          {view === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 20px 20px' }}>
              {filtered.map(m => {
                const cond = CONDITION_LABEL[m.condition];
                const discountPct = Math.round((1 - m.price / m.originalPrice) * 100);
                const isSold = m.status === 'sold';
                const isReserved = m.status === 'reserved';
                return (
                  <div
                    key={m.id}
                    onClick={() => !isSold && onOpen(m)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16, border: '1px solid var(--line)', background: 'var(--ocean-900)', padding: 12, cursor: isSold ? 'default' : 'pointer', opacity: isSold ? 0.5 : 1 }}
                  >
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 12, background: 'var(--ocean-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
                      {m.images[0]}
                      {(isSold || isReserved) && (
                        <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 9, fontWeight: 900, color: '#fff' }}>{isSold ? '완료' : '예약'}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999, border: '1px solid', color: 'var(--text-dim)', borderColor: 'var(--line)' }}>{cond.label}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-mute)' }}>{MARKET_CATEGORY_LABEL[m.category]}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--hook-300)' }}>{m.price.toLocaleString()}원</span>
                        <span style={{ fontSize: 11, color: 'var(--text-mute)', textDecoration: 'line-through' }}>{m.originalPrice.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: '#f87171', fontWeight: 700 }}>-{discountPct}%</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{m.region}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>조회 {m.views}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {view === 'album' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: '0 20px 20px' }}>
              {filtered.map(m => {
                const isSold = m.status === 'sold';
                const isReserved = m.status === 'reserved';
                const discountPct = Math.round((1 - m.price / m.originalPrice) * 100);
                return (
                  <div
                    key={m.id}
                    onClick={() => !isSold && onOpen(m)}
                    style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)', cursor: isSold ? 'default' : 'pointer', opacity: isSold ? 0.5 : 1 }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--ocean-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                      {m.images[0]}
                      {(isSold || isReserved) && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: '#fff' }}>{isSold ? '완료' : '예약'}</span>
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 900, padding: '2px 5px', borderRadius: 999 }}>
                        -{discountPct}%
                      </div>
                    </div>
                    <div style={{ background: 'var(--ocean-900)', padding: '6px 8px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--hook-300)' }}>{m.price.toLocaleString()}원</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function MarketPage() {
  const router = useRouter();
  return (
    <MarketList onOpen={(it) => router.push(`/market/${it.id}`)} />
  );
}
