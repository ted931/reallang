"use client";
import { useState } from "react";
import Link from "next/link";

type RentalType  = 'small' | 'mid' | 'van';
type StayType    = 'pension' | 'guest' | 'camping';
type JwaedaeType = 'good' | 'normal';

const COSTS = {
  rental:  { small: 28000, mid: 38000, van: 89000 },
  stay:    { pension: 120000, guest: 60000, camping: 30000 },
  jwaedae: { good: 30000, normal: 20000 },
  bait: 12000,
  food: 15000,
  fuel: 30000,
};

const RENTAL_LABELS:  Record<RentalType,  string> = { small: '소형', mid: '중형', van: '승합' };
const STAY_LABELS:    Record<StayType,    string> = { pension: '펜션', guest: '게스트하우스', camping: '캠핑' };
const JWAEDAE_LABELS: Record<JwaedaeType, string> = { good: '명당 좌대', normal: '일반 좌대' };

function comma(n: number) { return n.toLocaleString(); }

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-checked={on}
      role="switch"
      style={{
        width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
        background: on ? 'var(--hook)' : 'var(--tint-12)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </button>
  );
}

function SubTabs<T extends string>({
  options, labels, value, onChange,
}: {
  options: T[];
  labels: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '5px 12px', borderRadius: 99, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700,
            background: value === opt ? 'var(--hook)' : 'var(--tint-08)',
            color: value === opt ? '#fff' : 'var(--text-dim)',
            transition: 'all 0.15s',
          }}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export default function CostPage() {
  const [people,     setPeople]     = useState(2);
  const [items,      setItems]      = useState({
    rental:  true,
    stay:    false,
    jwaedae: true,
    bait:    true,
    food:    true,
    fuel:    false,
  });
  const [rentalType,  setRentalType]  = useState<RentalType>('mid');
  const [stayType,    setStayType]    = useState<StayType>('pension');
  const [jwaedaeType, setJwaedaeType] = useState<JwaedaeType>('normal');
  const [breakdown,   setBreakdown]   = useState(false);

  function toggle(key: keyof typeof items) {
    setItems(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const rentalCost  = items.rental  ? COSTS.rental[rentalType]           : 0;
  const stayCost    = items.stay    ? COSTS.stay[stayType]                : 0;
  const jwaedaeCost = items.jwaedae ? COSTS.jwaedae[jwaedaeType] * people : 0;
  const baitCost    = items.bait    ? COSTS.bait * people                  : 0;
  const foodCost    = items.food    ? COSTS.food * people                  : 0;
  const fuelCost    = items.fuel && items.rental ? COSTS.fuel              : 0;
  const total       = rentalCost + stayCost + jwaedaeCost + baitCost + foodCost + fuelCost;
  const perPerson   = Math.round(total / people);

  const breakdownItems = [
    { label: `렌터카 (${RENTAL_LABELS[rentalType]})`, amt: rentalCost,  show: items.rental },
    { label: `주유비`,                                  amt: fuelCost,    show: items.fuel && items.rental },
    { label: `숙소 (${STAY_LABELS[stayType]})`,       amt: stayCost,    show: items.stay },
    { label: `좌대/배삯 (${JWAEDAE_LABELS[jwaedaeType]}) × ${people}명`, amt: jwaedaeCost, show: items.jwaedae },
    { label: `미끼+채비 × ${people}명`,                amt: baitCost,    show: items.bait },
    { label: `식비 × ${people}명`,                     amt: foodCost,    show: items.food },
  ].filter(i => i.show && i.amt > 0);

  const CARD_ITEMS = [
    {
      key:   'rental' as const,
      icon:  '🚗',
      label: '렌터카',
      sub:   '이동 필수 — 제주 전역',
      extra: (
        <SubTabs
          options={['small', 'mid', 'van'] as RentalType[]}
          labels={RENTAL_LABELS}
          value={rentalType}
          onChange={setRentalType}
        />
      ),
    },
    {
      key:   'fuel' as const,
      icon:  '⛽',
      label: '주유비',
      sub:   '렌터카 이용 시 추가',
      extra: null,
    },
    {
      key:   'stay' as const,
      icon:  '🏠',
      label: '숙소',
      sub:   '1박 기준',
      extra: (
        <SubTabs
          options={['pension', 'guest', 'camping'] as StayType[]}
          labels={STAY_LABELS}
          value={stayType}
          onChange={setStayType}
        />
      ),
    },
    {
      key:   'jwaedae' as const,
      icon:  '🎣',
      label: '좌대/배삯',
      sub:   '1인 기준',
      extra: (
        <SubTabs
          options={['good', 'normal'] as JwaedaeType[]}
          labels={JWAEDAE_LABELS}
          value={jwaedaeType}
          onChange={setJwaedaeType}
        />
      ),
    },
    {
      key:   'bait' as const,
      icon:  '🪱',
      label: '미끼+채비',
      sub:   '1인 기준',
      extra: null,
    },
    {
      key:   'food' as const,
      icon:  '🍱',
      label: '식비',
      sub:   '1인 기준',
      extra: null,
    },
  ] as const;

  return (
    <div style={{ paddingBottom: 160 }}>
      {/* ── 히어로 ── */}
      <section style={{
        background: 'linear-gradient(160deg, var(--ocean-100) 0%, var(--ocean-200) 100%)',
        padding: '36px 20px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(14,165,233,0.14) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--hook)', marginBottom: 8, textTransform: 'uppercase' }}>
          COST PLANNER
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1.25 }}>
          출조 비용 계산기
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-dim)' }}>
          항목을 켜고 끄며 예산을 한눈에 확인하세요
        </p>
      </section>

      {/* ── 인원 선택 ── */}
      <section style={{ padding: '24px 20px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 12 }}>
          👥 출조 인원
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          background: 'var(--tint-04)', borderRadius: 'var(--r-sm)',
          border: '1px solid var(--line)',
          padding: '14px 20px',
        }}>
          <button
            onClick={() => setPeople(p => Math.max(1, p - 1))}
            aria-label="인원 감소"
            style={{
              width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--line)',
              background: 'var(--tint-06)', cursor: 'pointer',
              fontSize: 20, fontWeight: 700, color: 'var(--text-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >−</button>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-strong)', minWidth: 60, textAlign: 'center' }}>
            {people} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-dim)' }}>명</span>
          </div>
          <button
            onClick={() => setPeople(p => Math.min(10, p + 1))}
            aria-label="인원 증가"
            style={{
              width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--line)',
              background: 'var(--hook)', cursor: 'pointer',
              fontSize: 20, fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >+</button>
        </div>
      </section>

      {/* ── 항목별 카드 ── */}
      <section style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 12 }}>
          📋 비용 항목
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CARD_ITEMS.map(({ key, icon, label, sub, extra }) => {
            const on = items[key];
            return (
              <div key={key} style={{
                background: 'var(--tint-04)',
                borderRadius: 'var(--r-card)',
                border: `1px solid ${on ? 'var(--line-2)' : 'var(--line)'}`,
                padding: '14px 16px',
                transition: 'border-color 0.2s, opacity 0.2s',
                opacity: on ? 1 : 0.6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: on ? 'var(--tint-10)' : 'var(--tint-06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, transition: 'background 0.2s',
                    }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>{label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                  <Toggle on={on} onToggle={() => toggle(key)} />
                </div>
                {on && extra && <div>{extra}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 바로가기 CTA ── */}
      {(items.rental || items.stay || items.jwaedae) && (
        <section style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 10 }}>
            🔗 바로가기
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.rental && (
              <Link href="/rentcar" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 'var(--r-sm)',
                  background: 'linear-gradient(90deg, #0ea5e922, transparent)',
                  border: '1px solid #0ea5e933',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0ea5e9' }}>🚗 땡처리 렌터카 보기</span>
                  <span style={{ fontSize: 16, color: '#0ea5e9' }}>›</span>
                </div>
              </Link>
            )}
            {items.stay && (
              <Link href="/stay" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 'var(--r-sm)',
                  background: 'linear-gradient(90deg, #a78bfa22, transparent)',
                  border: '1px solid #a78bfa33',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>🏠 낚시 숙소 찾기</span>
                  <span style={{ fontSize: 16, color: '#a78bfa' }}>›</span>
                </div>
              </Link>
            )}
            {items.jwaedae && (
              <Link href="/jwaedae" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 'var(--r-sm)',
                  background: 'linear-gradient(90deg, #10b98122, transparent)',
                  border: '1px solid #10b98133',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>🎣 좌대 예약하기</span>
                  <span style={{ fontSize: 16, color: '#10b981' }}>›</span>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── 결과 sticky ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--ocean-100)',
        borderTop: '1px solid var(--line-2)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
        zIndex: 200,
        padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', marginBottom: 2 }}>총 예상 비용</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--hook)', lineHeight: 1 }}>
              {comma(total)}
              <span style={{ fontSize: 14, fontWeight: 500, marginLeft: 3 }}>원</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', marginBottom: 2 }}>1인당</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1 }}>
              {comma(perPerson)}
              <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 2 }}>원</span>
            </div>
          </div>
        </div>
        {/* 접이식 내역 */}
        <button
          onClick={() => setBreakdown(b => !b)}
          style={{
            width: '100%', border: 'none', background: 'var(--tint-06)',
            borderRadius: 8, padding: '8px 12px',
            fontSize: 12, fontWeight: 700, color: 'var(--text-dim)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span>항목별 내역 보기</span>
          <span style={{ transition: 'transform 0.2s', transform: breakdown ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
        </button>
        {breakdown && (
          <div style={{
            marginTop: 8, padding: '10px 12px',
            background: 'var(--tint-04)', borderRadius: 8,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {breakdownItems.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-mute)', textAlign: 'center' }}>항목을 선택해 주세요</div>
            )}
            {breakdownItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-dim)' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>{comma(item.amt)}원</span>
              </div>
            ))}
            {breakdownItems.length > 0 && (
              <>
                <div style={{ height: 1, background: 'var(--line)', margin: '2px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>합계</span>
                  <span style={{ fontWeight: 900, color: 'var(--hook)' }}>{comma(total)}원</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
