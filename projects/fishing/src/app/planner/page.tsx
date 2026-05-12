"use client";
import { useState } from "react";
import Link from "next/link";

// ─── 데이터 상수 ────────────────────────────────────────────
const REGIONS = ['한림', '애월', '서귀포', '성산', '모슬포', '구좌', '표선', '협재'];

const FISH_LIST = ['갈치', '감성돔', '참돔', '벵에돔', '볼락', '방어', '광어', '한치', '참치', '농어'];

const RECOMMENDATIONS: Record<string, { point: string; depth: string; tackle: string; bait: string; tip: string }> = {
  '갈치-한림': { point: '한림 갯바위 P-12', depth: '12~15m', tackle: '갈치 6단 채비', bait: '꽁치 토막', tip: '밤 9시~자정 입질 집중. 형광 발광체 필수.' },
  '갈치-서귀포': { point: '서귀포 황금좌대', depth: '10~14m', tackle: '갈치 4단 채비', bait: '크릴새우', tip: '물때 9~11물이 최적. 좌대에서 편하게 즐길 수 있음.' },
  '감성돔-서귀포': { point: '서귀포 황우지해안', depth: '8~12m', tackle: '반유동 찌낚시', bait: '크릴+밑밥', tip: '새벽 5~7시 피크. 수면 가까이 흘려야 함.' },
  '참돔-성산': { point: '성산 일출봉 앞 여밭', depth: '25~35m', tackle: '선상 참돔 채비', bait: '새우 생미끼', tip: '5~6월 최성기. 물때 6~8물이 유리.' },
  '벵에돔-한림': { point: '한림 비양도 갯바위', depth: '5~8m', tackle: '전유동 찌낚시', bait: '크릴+집어제', tip: '조류 약할 때 효과적. 목줄 1.5호 이하 추천.' },
  '방어-모슬포': { point: '모슬포 외해 여밭', depth: '30~50m', tackle: '지깅 200g 슬로우지그', bait: '메탈 지그', tip: '11~2월 시즌. 집어등 주변 노리면 굿.' },
  '광어-협재': { point: '협재 방파제 앞', depth: '3~8m', tackle: '루어 (지그헤드+웜)', bait: '생미끼/웜', tip: '썰물 시간대 모래밭 경계 노림. 아침·저녁 유리.' },
};

const DEFAULT_REC = { point: '지역 대표 갯바위', depth: '8~20m', tackle: '범용 찌낚시 채비', bait: '크릴새우', tip: '현지 낚시점에서 최신 조황 확인 후 출조 권장.' };

// ─── 헬퍼 함수 ────────────────────────────────────────────
function getTideInfo(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const tideNum = ((day % 15) + 1);
  const flow = tideNum <= 7 ? '들물' : '날물';
  const isGood = tideNum >= 6 && tideNum <= 11;
  return { num: tideNum, flow, isGood, label: `${tideNum}물 ${flow}` };
}

function getWeatherForecast(dateStr: string) {
  const weathers = ['☀️ 맑음', '⛅ 구름 조금', '🌤️ 맑음', '💨 바람 강함', '⛅ 흐림'];
  const d = new Date(dateStr);
  return {
    sky: weathers[d.getDate() % 5],
    wind: `${(d.getDate() % 6) + 1}.${d.getMonth() % 9}m/s`,
    wave: `${((d.getDate() % 4) * 0.3 + 0.3).toFixed(1)}m`,
    temp: `${13 + (d.getMonth() * 2)}°C`,
  };
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ─── 서브 컴포넌트 ────────────────────────────────────────────

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: '날짜/인원' },
    { num: 2, label: '지역' },
    { num: 3, label: '어종' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '20px 20px 8px', position: 'relative' }}>
      {steps.map((s, i) => {
        const done = step > s.num;
        const active = step === s.num;
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? 'var(--hook)' : active ? 'var(--hook)' : 'var(--tint-08)',
                border: active ? '2px solid var(--hook-300)' : done ? 'none' : '2px solid var(--line-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800,
                color: done || active ? 'var(--ocean-950)' : 'var(--text-dim)',
                boxShadow: active ? '0 0 0 4px rgba(233,78,59,0.18)' : 'none',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}>
                {done ? '✓' : s.num}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: active ? 'var(--hook-300)' : done ? 'var(--text-dim)' : 'var(--text-mute)',
                whiteSpace: 'nowrap',
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 6px', marginBottom: 18,
                background: done ? 'var(--hook)' : 'var(--line-2)',
                borderRadius: 2, transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ResultCard({ date, region, targetFish, people, onReset }: {
  date: string; region: string; targetFish: string; people: number; onReset: () => void;
}) {
  const weather = getWeatherForecast(date);
  const tide = getTideInfo(date);
  const key = `${targetFish}-${region}`;
  const rec = RECOMMENDATIONS[key] || DEFAULT_REC;

  const cost_jwaedae = 15000 * people;
  const cost_rentcar = people >= 4 ? 89000 : 38000;
  const cost_bait = 12000 * people;
  const total = cost_jwaedae + cost_rentcar + cost_bait;
  const perPerson = Math.round(total / people);

  const cardStyle: React.CSSProperties = {
    background: 'var(--tint-04)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-card)',
    padding: '18px 16px',
    marginBottom: 12,
  };
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, display: 'block' };
  const valueStyle: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' };
  const subStyle: React.CSSProperties = { fontSize: 11, color: 'var(--text-dim)', marginTop: 2 };

  return (
    <div style={{ padding: '0 20px 20px' }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--hook-300)', fontWeight: 700, marginBottom: 4 }}>🎉 출조 계획 완성!</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1.3 }}>
          {region} · {targetFish} 출조
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
          {date} · {people}명
        </div>
      </div>

      {/* 날씨 예보 카드 */}
      <div style={cardStyle}>
        <span style={labelStyle}>날씨 예보</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { icon: '🌡️', label: '기온', value: weather.temp },
            { icon: '💨', label: '바람', value: weather.wind },
            { icon: '🌊', label: '파고', value: weather.wave },
            { icon: '🌤️', label: '날씨', value: weather.sky.replace(/^[^\s]+\s/, '').substring(0, 4) },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center', background: 'var(--tint-05)', borderRadius: 10, padding: '10px 4px' }}>
              <div style={{ fontSize: 18, lineHeight: 1.2 }}>{item.icon}</div>
              <div style={{ fontSize: 10, color: 'var(--text-mute)', marginTop: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-strong)', marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
          전체 날씨: <strong style={{ color: 'var(--text)' }}>{weather.sky}</strong>
        </div>
      </div>

      {/* 물때 카드 */}
      <div style={cardStyle}>
        <span style={labelStyle}>물때 정보</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: tide.isGood ? 'rgba(233,78,59,0.15)' : 'var(--tint-08)',
            border: `2px solid ${tide.isGood ? 'var(--hook)' : 'var(--line-2)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: tide.isGood ? 'var(--hook-300)' : 'var(--text-dim)', lineHeight: 1 }}>{tide.num}</span>
            <span style={{ fontSize: 9, color: 'var(--text-mute)', marginTop: 1 }}>물</span>
          </div>
          <div>
            <div style={valueStyle}>{tide.label}</div>
            <div style={subStyle}>음력 기준 물때</div>
            <div style={{
              display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 999,
              fontSize: 11, fontWeight: 800,
              background: tide.isGood ? 'rgba(233,78,59,0.15)' : 'var(--tint-08)',
              color: tide.isGood ? 'var(--hook-300)' : 'var(--text-dim)',
              border: `1px solid ${tide.isGood ? 'rgba(233,78,59,0.3)' : 'var(--line)'}`,
            }}>
              {tide.isGood ? '✅ 출조 적합' : '⚠️ 주의 필요'}
            </div>
          </div>
        </div>
      </div>

      {/* 추천 포인트 카드 */}
      <div style={cardStyle}>
        <span style={labelStyle}>추천 포인트</span>
        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--hook-300)', marginBottom: 12 }}>
          📍 {rec.point}
        </div>
        {[
          { label: '수심', icon: '🌊', value: rec.depth },
          { label: '채비', icon: '🎣', value: rec.tackle },
          { label: '미끼', icon: '🦐', value: rec.bait },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{row.icon}</span>
            <span style={{ fontSize: 11, color: 'var(--text-mute)', width: 28, flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.value}</span>
          </div>
        ))}
        <div style={{
          marginTop: 10, padding: '10px 12px',
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10, fontSize: 12, color: 'var(--text)', lineHeight: 1.6,
        }}>
          💡 {rec.tip}
        </div>
      </div>

      {/* 예상 비용 카드 */}
      <div style={cardStyle}>
        <span style={labelStyle}>예상 비용 ({people}명 기준)</span>
        {[
          { label: '좌대/방파제', value: cost_jwaedae },
          { label: `렌터카 (${people >= 4 ? '대형' : '소형'} 1대)`, value: cost_rentcar },
          { label: '미끼+채비', value: cost_bait },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{row.value.toLocaleString()}원</span>
          </div>
        ))}
        <div style={{ height: 1, background: 'var(--line-2)', margin: '10px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-strong)' }}>합계</span>
          <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--hook-300)' }}>{total.toLocaleString()}원</span>
        </div>
        <div style={{ textAlign: 'right', marginTop: 4, fontSize: 11, color: 'var(--text-mute)' }}>
          1인당 약 {perPerson.toLocaleString()}원
        </div>
      </div>

      {/* 바로가기 버튼 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { label: '좌대 예약', href: '/jwaedae', emoji: '🏝️' },
          { label: '렌터카', href: '/rentcar', emoji: '🚗' },
          { label: '숙소', href: '/stay', emoji: '🏠' },
        ].map((btn) => (
          <Link
            key={btn.href}
            href={btn.href}
            style={{
              flex: 1, padding: '12px 8px', textAlign: 'center',
              background: 'var(--tint-06)', border: '1px solid var(--line)',
              borderRadius: 12, fontSize: 12, fontWeight: 700,
              color: 'var(--text)', textDecoration: 'none',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{btn.emoji}</div>
            {btn.label}
          </Link>
        ))}
      </div>

      {/* 다시 계획 버튼 */}
      <button
        onClick={onReset}
        style={{
          width: '100%', padding: '14px', background: 'var(--tint-08)',
          border: '1px solid var(--line-2)', borderRadius: 12,
          fontSize: 14, fontWeight: 800, color: 'var(--text-dim)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        🔄 다시 계획하기
      </button>
    </div>
  );
}

// ─── 메인 페이지 ────────────────────────────────────────────
export default function PlannerPage() {
  const today = todayStr();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState(today);
  const [region, setRegion] = useState('');
  const [targetFish, setTargetFish] = useState('');
  const [people, setPeople] = useState(2);
  const [showResult, setShowResult] = useState(false);

  function handleReset() {
    setStep(1);
    setDate(today);
    setRegion('');
    setTargetFish('');
    setPeople(2);
    setShowResult(false);
  }

  const canFinish = date && region && targetFish;

  // ── 스타일 상수 ──
  const sectionStyle: React.CSSProperties = {
    margin: '0 20px 16px',
    background: 'var(--tint-04)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-card)',
    padding: '18px 16px',
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, color: 'var(--text-mute)',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, display: 'block',
  };

  if (showResult) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 12 }}>
        <ResultCard
          date={date}
          region={region}
          targetFish={targetFish}
          people={people}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 40 }}>
      {/* 페이지 타이틀 */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 12, color: 'var(--hook-300)', fontWeight: 700, marginBottom: 4 }}>🗓️ 출조 플래너</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-strong)', margin: 0, lineHeight: 1.3 }}>
          나만의 출조 계획<br />
          <span style={{ color: 'var(--hook-300)' }}>3단계로 완성</span>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6, marginBottom: 0 }}>
          날짜·지역·어종을 고르면 맞춤 포인트와 채비를 추천해드려요.
        </p>
      </div>

      {/* 프로그레스 바 */}
      <ProgressBar step={step} />

      {/* ─ 스텝 1: 날짜 & 인원 ─ */}
      <div style={{
        ...sectionStyle,
        border: step === 1 ? '1px solid var(--hook)' : '1px solid var(--line)',
        boxShadow: step === 1 ? '0 0 0 3px rgba(233,78,59,0.08)' : 'none',
        opacity: step === 1 ? 1 : 0.7,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ ...sectionLabel, margin: 0 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%', fontSize: 10, fontWeight: 800,
              background: step > 1 ? 'var(--hook)' : step === 1 ? 'var(--hook)' : 'var(--tint-08)',
              color: step >= 1 ? 'white' : 'var(--text-mute)',
              marginRight: 6, verticalAlign: 'middle',
            }}>1</span>
            날짜 &amp; 인원
          </span>
          {step > 1 && (
            <button onClick={() => setStep(1)} style={{ fontSize: 11, color: 'var(--ocean-400)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
              수정
            </button>
          )}
        </div>

        {step === 1 ? (
          <>
            {/* 날짜 */}
            <div className="fl-ss-field" style={{ marginBottom: 14 }}>
              <label>출조 날짜</label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* 인원 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-dim)' }}>인원</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  style={{
                    width: 38, height: 38, borderRadius: 10, fontSize: 20, fontWeight: 700,
                    background: 'var(--tint-08)', border: '1px solid var(--line)',
                    color: 'var(--text)', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                  }}
                >－</button>
                <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-strong)', minWidth: 40, textAlign: 'center' }}>
                  {people}<span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', marginLeft: 2 }}>명</span>
                </span>
                <button
                  onClick={() => setPeople(Math.min(10, people + 1))}
                  style={{
                    width: 38, height: 38, borderRadius: 10, fontSize: 20, fontWeight: 700,
                    background: 'var(--tint-08)', border: '1px solid var(--line)',
                    color: 'var(--text)', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                  }}
                >＋</button>
              </div>
            </div>

            <button
              className={`fl-ss-submit-btn on`}
              style={{ marginTop: 18 }}
              onClick={() => setStep(2)}
            >
              다음 — 지역 선택 →
            </button>
          </>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            📅 {date} &nbsp;·&nbsp; 👥 {people}명
          </div>
        )}
      </div>

      {/* ─ 스텝 2: 지역 선택 ─ */}
      <div style={{
        ...sectionStyle,
        border: step === 2 ? '1px solid var(--hook)' : '1px solid var(--line)',
        boxShadow: step === 2 ? '0 0 0 3px rgba(233,78,59,0.08)' : 'none',
        opacity: step >= 2 ? 1 : 0.5,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ ...sectionLabel, margin: 0 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%', fontSize: 10, fontWeight: 800,
              background: step > 2 ? 'var(--hook)' : step === 2 ? 'var(--hook)' : 'var(--tint-08)',
              color: step >= 2 ? 'white' : 'var(--text-mute)',
              marginRight: 6, verticalAlign: 'middle',
            }}>2</span>
            지역 선택
          </span>
          {step > 2 && (
            <button onClick={() => setStep(2)} style={{ fontSize: 11, color: 'var(--ocean-400)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
              수정
            </button>
          )}
        </div>

        {step >= 2 ? (
          step === 2 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 18 }}>
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    className={`fl-chip${region === r ? ' on' : ''}`}
                    style={{ width: '100%', borderRadius: 10, padding: '11px 8px', fontSize: 14, fontWeight: 700, justifyContent: 'center' }}
                    onClick={() => setRegion(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                className={`fl-ss-submit-btn${region ? ' on' : ''}`}
                onClick={() => { if (region) setStep(3); }}
                disabled={!region}
              >
                {region ? `${region} 선택 완료 → 어종 선택` : '지역을 선택해주세요'}
              </button>
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>📍 {region}</div>
          )
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>앞 단계를 먼저 완료해주세요</div>
        )}
      </div>

      {/* ─ 스텝 3: 어종 선택 ─ */}
      <div style={{
        ...sectionStyle,
        border: step === 3 ? '1px solid var(--hook)' : '1px solid var(--line)',
        boxShadow: step === 3 ? '0 0 0 3px rgba(233,78,59,0.08)' : 'none',
        opacity: step >= 3 ? 1 : 0.5,
      }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ ...sectionLabel, margin: 0 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%', fontSize: 10, fontWeight: 800,
              background: step === 3 ? 'var(--hook)' : 'var(--tint-08)',
              color: step >= 3 ? 'white' : 'var(--text-mute)',
              marginRight: 6, verticalAlign: 'middle',
            }}>3</span>
            목표 어종
          </span>
        </div>

        {step >= 3 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
              {FISH_LIST.map((f) => (
                <button
                  key={f}
                  className={`fl-chip${targetFish === f ? ' on' : ''}`}
                  style={{ width: '100%', borderRadius: 10, padding: '11px 6px', fontSize: 13, fontWeight: 700, justifyContent: 'center' }}
                  onClick={() => setTargetFish(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              className={`fl-ss-submit-btn${canFinish ? ' on' : ''}`}
              onClick={() => { if (canFinish) setShowResult(true); }}
              disabled={!canFinish}
            >
              {targetFish ? '🎣 출조 계획 완성!' : '어종을 선택해주세요'}
            </button>
          </>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>앞 단계를 먼저 완료해주세요</div>
        )}
      </div>
    </div>
  );
}
