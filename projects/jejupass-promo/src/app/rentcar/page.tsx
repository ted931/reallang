'use client';

import { useState } from 'react';
import { BRAND } from '@/lib/constants';
import { CARS, type CarType } from '@/lib/car-data';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Recommendation {
  recommendation: {
    carId: string;
    reason: string;
    tips: string[];
    totalCost: number;
    costBreakdown: string;
    car?: CarType;
  };
  alternative: {
    carId: string;
    reason: string;
    priceDiff: string;
    car?: CarType;
  };
  summary: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PURPOSES = [
  { id: 'healing', label: '힐링/휴양', emoji: '🧘', desc: '카페·드라이브·휴식' },
  { id: 'drive', label: '드라이브', emoji: '🚗', desc: '해안도로·야경·감성' },
  { id: 'hiking', label: '올레길/등산', emoji: '🥾', desc: '한라산·트레킹·자연' },
  { id: 'food', label: '맛집투어', emoji: '🍊', desc: '로컬 식당·제주 맛집' },
  { id: 'family', label: '가족여행', emoji: '👨‍👩‍👧‍👦', desc: '키즈 친화·넓은 공간' },
  { id: 'camping', label: '캠핑', emoji: '⛺', desc: '캠핑장·야외 액티비티' },
  { id: 'activity', label: '액티비티', emoji: '🏄', desc: '서핑·승마·스쿠버' },
];

const LUGGAGE_OPTIONS = [
  { id: '짐 거의 없음', label: '짐 거의 없음', icon: '🎒' },
  { id: '캐리어 1개', label: '캐리어 1개', icon: '🧳' },
  { id: '캐리어 2개', label: '캐리어 2개', icon: '🧳🧳' },
  { id: '캐리어 3개 이상', label: '캐리어 3개+', icon: '📦' },
  { id: '캐리어 + 등산/서핑 장비', label: '캐리어 + 장비', icon: '🏕️' },
];

const INSURANCE_OPTIONS = [
  { id: 'basic', label: '기본 보험', desc: '자차 면책 50만원', pricePerDay: 0 },
  { id: 'standard', label: '일반 자차', desc: '자차 면책 30만원', pricePerDay: 8000 },
  { id: 'premium', label: '완전자차', desc: '면책 0원', pricePerDay: 15000 },
];

const PRICE_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'budget', label: '3만원대' },
  { id: 'mid', label: '4~6만원' },
  { id: 'premium', label: '7만원+' },
];

const SEAT_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'small', label: '1~2인' },
  { id: 'medium', label: '3~4인' },
  { id: 'large', label: '5인+' },
];

const AVG_FUEL_PRICE = { gasoline: 1680, diesel: 1500 };
const JEJU_DAILY_KM = 100;

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}만원`;
  return `${n.toLocaleString()}원`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReservationCTA() {
  return (
    <div className="mt-6 rounded-2xl p-6 text-center bg-slate-900">
      <p className="text-sm font-semibold text-slate-300 mb-1">제주패스에서 최저가로 예약하세요</p>
      <div className="flex flex-wrap gap-2 justify-center mt-3 mb-4">
        {[
          { icon: '✅', text: '최저가 보장' },
          { icon: '🔄', text: '무료 취소' },
          { icon: '🛡️', text: '완전자차 옵션' },
          { icon: '📍', text: '제주 공항 픽업' },
        ].map((b) => (
          <span
            key={b.text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20"
          >
            <span>{b.icon}</span>
            {b.text}
          </span>
        ))}
      </div>
      <a
        href="https://jejupass.com/rentcar"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-extrabold text-sm shadow-lg transition-all hover:opacity-90 bg-blue-600 hover:bg-blue-700"
      >
        <span>🚗</span>
        렌터카 예약하기
      </a>
      <p className="mt-2 text-[11px] text-slate-500">jejupass.com · 최저가 보장 · 즉시 예약</p>
    </div>
  );
}

// ─── Tab 1: AI 추천 ────────────────────────────────────────────────────────────

function AITab({ quickSeats }: { quickSeats: string }) {
  const initTravelers = quickSeats === '1-2' ? 2 : quickSeats === '3-4' ? 3 : 5;
  const [travelers, setTravelers] = useState(initTravelers);
  const [days, setDays] = useState(3);
  const [luggage, setLuggage] = useState('캐리어 2개');
  const [purpose, setPurpose] = useState('healing');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);

  const handleRecommend = async () => {
    setLoading(true);
    setResult(null);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    try {
      const res = await fetch(`${basePath}/api/rentcar/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelers,
          days,
          luggage,
          purpose: PURPOSES.find((p) => p.id === purpose)?.label || purpose,
          budget: budget ? parseInt(budget) * 10000 : undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* 입력 폼 */}
      <div className="space-y-4">
        {/* 인원 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">인원</p>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setTravelers(n)}
                className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${
                  travelers === n
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n}{n >= 7 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* 여행 일수 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">여행 일수</p>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  days === d
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d}일
              </button>
            ))}
          </div>
        </div>

        {/* 짐 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">짐</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LUGGAGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLuggage(opt.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left border-2 ${
                  luggage === opt.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 여행 목적 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">여행 목적</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className={`p-3 rounded-xl text-left transition-all border-2 ${
                  purpose === p.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-transparent bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="text-xl mb-1">{p.emoji}</div>
                <div className="text-xs font-bold text-slate-800">{p.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 예산 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            렌터카 예산 <span className="text-slate-300 font-normal normal-case">(선택)</span>
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="예: 15"
              className="w-28 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-center font-semibold"
            />
            <span className="text-sm text-slate-500">만원 이하</span>
          </div>
        </div>

        {/* 추천 버튼 */}
        <button
          onClick={handleRecommend}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-extrabold text-base text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 bg-orange-500 hover:bg-orange-600"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI가 분석 중...
            </>
          ) : (
            <>
              <span>✨</span> 차종 추천받기
            </>
          )}
        </button>
      </div>

      {/* 결과 */}
      <div className="space-y-4">
        {!result && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-slate-800 font-extrabold text-lg mb-1">조건을 입력하면</p>
            <p className="text-slate-400 text-sm">AI가 최적 차종을 추천해드려요</p>
            <div className="mt-6 flex justify-center gap-4 text-xs text-slate-300">
              <span>{travelers}명</span>
              <span>·</span>
              <span>{days}일</span>
              <span>·</span>
              <span>{PURPOSES.find((p) => p.id === purpose)?.label}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-extrabold">AI가 최적 차종 분석 중</p>
            <p className="text-slate-400 text-sm mt-1">
              {travelers}명 · {days}일 · {PURPOSES.find((p) => p.id === purpose)?.label}
            </p>
          </div>
        )}

        {result && (
          <>
            {/* AI 요약 */}
            <div className="rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-blue-600 to-cyan-500">
              <p className="text-xs font-semibold text-white/70 mb-1">AI 분석 결과</p>
              <p className="text-sm font-medium leading-relaxed">{result.summary}</p>
            </div>

            {/* 1순위 추천 */}
            {result.recommendation?.car && (
              <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wide text-white bg-blue-600">
                    1순위 추천
                  </span>
                  <span className="text-xs text-slate-400">AI 최적 매칭</span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-5xl border border-slate-100 flex-shrink-0">
                    {result.recommendation.car.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-extrabold text-slate-900">{result.recommendation.car.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {result.recommendation.car.category}
                      </span>
                      <span className="text-xs text-slate-400">{result.recommendation.car.seats}인승</span>
                      <span className="text-xs text-slate-400">{result.recommendation.car.fuelType}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-black text-blue-600">
                        {result.recommendation.car.pricePerDay.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-400">원/일</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50 rounded-xl p-4">
                  {result.recommendation.reason}
                </p>

                <div className="text-xs text-slate-400 mb-4 font-medium">
                  {result.recommendation.costBreakdown}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {result.recommendation.car.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {result.recommendation.tips?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-xs font-extrabold text-amber-700 mb-2">💡 제주 여행 팁</p>
                    <ul className="space-y-1">
                      {result.recommendation.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-amber-700 flex gap-1.5">
                          <span className="text-amber-400 flex-shrink-0">·</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 대안 */}
            {result.alternative?.car && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                    대안 차종
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl border border-slate-100 flex-shrink-0">
                    {result.alternative.car.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-800">{result.alternative.car.name}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      일 {result.alternative.car.pricePerDay.toLocaleString()}원 · {result.alternative.priceDiff}
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{result.alternative.reason}</p>
                  </div>
                </div>
              </div>
            )}

            <ReservationCTA />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tab 2: 차종 비교 ──────────────────────────────────────────────────────────

function CompareTab({ quickSeats }: { quickSeats: string }) {
  const [priceFilter, setPriceFilter] = useState('all');
  const [seatFilter, setSeatFilter] = useState(
    quickSeats === '1-2' ? 'small' : quickSeats === '3-4' ? 'medium' : quickSeats === '5+' ? 'large' : 'all'
  );
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = CARS.filter((car) => {
    const priceOk =
      priceFilter === 'all' ||
      (priceFilter === 'budget' && car.pricePerDay < 40000) ||
      (priceFilter === 'mid' && car.pricePerDay >= 40000 && car.pricePerDay < 70000) ||
      (priceFilter === 'premium' && car.pricePerDay >= 70000);

    const seatOk =
      seatFilter === 'all' ||
      (seatFilter === 'small' && car.seats <= 4) ||
      (seatFilter === 'medium' && car.seats === 5) ||
      (seatFilter === 'large' && car.seats >= 7);

    return priceOk && seatOk;
  });

  const selectedCar = CARS.find((c) => c.id === selected);

  return (
    <div className="space-y-5">
      {/* 필터 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">가격대</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setPriceFilter(f.id)}
                className={`px-3.5 py-2 rounded-full text-sm font-bold border transition-all ${
                  priceFilter === f.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">인원</p>
          <div className="flex flex-wrap gap-2">
            {SEAT_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSeatFilter(f.id)}
                className={`px-3.5 py-2 rounded-full text-sm font-bold border transition-all ${
                  seatFilter === f.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 카운트 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-900 font-extrabold tabular-nums">{filtered.length}</strong>대
        </p>
      </div>

      {/* 차종 카드 리스트 */}
      <div className="space-y-3">
        {filtered.map((car) => {
          const isSelected = selected === car.id;
          return (
            <article
              key={car.id}
              className={`bg-white border rounded-2xl overflow-hidden transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-400 shadow-lg shadow-blue-100'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => setSelected(isSelected ? null : car.id)}
            >
              <div className="grid grid-cols-[120px_1fr_160px] md:grid-cols-[160px_1fr_180px]">
                {/* 이미지 플레이스홀더 */}
                <div
                  className="relative h-full min-h-[120px] grid place-items-center"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #e0e7ff, #e0e7ff 8px, #c7d2fe 8px, #c7d2fe 16px)',
                  }}
                >
                  <span className="text-4xl opacity-50">{car.emoji}</span>
                  {car.category === '준중형' && (
                    <span className="absolute top-2 left-2 font-extrabold text-[9px] px-2 py-0.5 rounded bg-amber-400 text-slate-900">
                      ★ BEST
                    </span>
                  )}
                </div>

                {/* 정보 */}
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">{car.category}</span>
                    <span className="text-slate-500">{car.fuelType}</span>
                    <span className="text-slate-500">{car.seats}인승</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 mt-1.5 text-base md:text-lg">{car.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">트렁크: {car.trunkCapacity} · 제주공항 픽업</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {car.features.map((f) => (
                      <span key={f} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        #{f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 가격 */}
                <div className="border-l border-slate-100 bg-slate-50/50 p-4 flex flex-col justify-between">
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 tabular-nums">
                      {formatPrice(car.pricePerDay)}
                    </p>
                    <p className="text-[10px] text-slate-400">/ 1일</p>
                  </div>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-lg transition-colors">
                    선택
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 선택 차량 상세 */}
      {selectedCar && (
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-5xl w-20 h-20 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
              {selectedCar.emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-slate-900">{selectedCar.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{selectedCar.category}</span>
                <span className="text-xs text-slate-500">{selectedCar.seats}인승</span>
                <span className="text-xs text-slate-500">{selectedCar.fuelType}</span>
                <span className="text-xs text-slate-500">트렁크: {selectedCar.trunkCapacity}</span>
              </div>
              <div className="mt-2 text-2xl font-black text-blue-600">
                {formatPrice(selectedCar.pricePerDay)}
                <span className="text-sm text-slate-400 font-normal ml-1">/일</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {selectedCar.features.map((f) => (
              <span key={f} className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700">
                {f}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedCar.bestFor.map((b) => (
              <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      <ReservationCTA />
    </div>
  );
}

// ─── Tab 3: 비용 계산 ──────────────────────────────────────────────────────────

function CostTab() {
  const [selectedCarId, setSelectedCarId] = useState(CARS[0].id);
  const [days, setDays] = useState(3);
  const [insurance, setInsurance] = useState('standard');
  const [dailyKm, setDailyKm] = useState(JEJU_DAILY_KM);

  const car = CARS.find((c) => c.id === selectedCarId)!;
  const insuranceOption = INSURANCE_OPTIONS.find((i) => i.id === insurance)!;

  const rentCost = car.pricePerDay * days;
  const insuranceCost = insuranceOption.pricePerDay * days;
  const isEV = car.fuelType === '전기';
  const totalKm = dailyKm * days;

  let fuelCost = 0;
  let fuelLiters = 0;
  if (car.kmPerLiter && !isEV) {
    fuelLiters = Math.ceil(totalKm / car.kmPerLiter);
    const pricePerLiter = car.fuelType === '디젤' ? AVG_FUEL_PRICE.diesel : AVG_FUEL_PRICE.gasoline;
    fuelCost = fuelLiters * pricePerLiter;
  }
  const evChargeCost = isEV ? Math.round(totalKm * 40) : 0;
  const parkingCost = days * 5000;
  const totalCost = rentCost + insuranceCost + fuelCost + evChargeCost + parkingCost;

  const costBreakdown = [
    { label: '렌트비', amount: rentCost, color: BRAND.color, icon: '🚗' },
    { label: '보험료', amount: insuranceCost, color: '#3B82F6', icon: '🛡️' },
    { label: isEV ? '충전비' : '주유비', amount: isEV ? evChargeCost : fuelCost, color: '#F59E0B', icon: isEV ? '⚡' : '⛽' },
    { label: '주차비(예상)', amount: parkingCost, color: '#9CA3AF', icon: '🅿️' },
  ];

  return (
    <div className="space-y-5">
      {/* 차종 선택 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4">차종 선택</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CARS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCarId(c.id)}
              className={`p-3 rounded-xl text-center transition-all border-2 ${
                selectedCarId === c.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="text-xs font-extrabold text-slate-900 mt-1">{c.name.split(' ').pop()}</div>
              <div className="text-[10px] text-slate-400">{formatPrice(c.pricePerDay)}/일</div>
            </button>
          ))}
        </div>
      </div>

      {/* 옵션 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* 일수 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-900 mb-3">대여 기간</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-extrabold hover:bg-slate-200 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-black text-slate-900 w-16 text-center">{days}일</span>
            <button
              onClick={() => setDays(Math.min(14, days + 1))}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-extrabold hover:bg-slate-200 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* 주행거리 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-900 mb-2">하루 주행거리</h3>
          <input
            type="range"
            min={50}
            max={250}
            step={10}
            value={dailyKm}
            onChange={(e) => setDailyKm(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#2563EB' }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-400">시내 위주</span>
            <span className="text-lg font-black text-slate-900">{dailyKm}km</span>
            <span className="text-[10px] text-slate-400">일주</span>
          </div>
        </div>
      </div>

      {/* 보험 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-extrabold text-slate-900 mb-3">보험 유형</h3>
        <div className="grid grid-cols-3 gap-2">
          {INSURANCE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setInsurance(opt.id)}
              className={`p-3 rounded-xl text-center transition-all border-2 ${
                insurance === opt.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="text-sm font-extrabold text-slate-900">{opt.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
              <div className="text-xs font-bold mt-1 text-blue-600">
                {opt.pricePerDay === 0 ? '무료' : `+${formatPrice(opt.pricePerDay)}/일`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 총 비용 결과 */}
      <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-white/80">예상 총 비용</p>
            <p className="text-3xl font-black">{formatPrice(totalCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">1인당 (2인 기준)</p>
            <p className="text-xl font-black">{formatPrice(Math.round(totalCost / 2))}</p>
          </div>
        </div>

        {/* 비용 바 */}
        <div className="flex h-3 rounded-full overflow-hidden mb-4 bg-white/20">
          {costBreakdown.map((item) => {
            const pct = totalCost > 0 ? (item.amount / totalCost) * 100 : 0;
            return pct > 0 ? (
              <div
                key={item.label}
                style={{ width: `${pct}%`, backgroundColor: item.color }}
                title={`${item.label}: ${formatPrice(item.amount)}`}
              />
            ) : null;
          })}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {costBreakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span>{item.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-white/70">{item.label}</p>
                <p className="text-sm font-extrabold">{formatPrice(item.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-extrabold text-slate-900 mb-3">상세 분석</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">🚗 {car.name} × {days}일</span>
            <span className="font-medium text-slate-900">{formatPrice(rentCost)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">🛡️ {insuranceOption.label} × {days}일</span>
            <span className="font-medium text-slate-900">{formatPrice(insuranceCost)}</span>
          </div>
          {!isEV && (
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">
                ⛽ {car.fuelType === '디젤' ? '경유' : '휘발유'} {fuelLiters}L (총 {totalKm}km)
              </span>
              <span className="font-medium text-slate-900">{formatPrice(fuelCost)}</span>
            </div>
          )}
          {isEV && (
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">⚡ 전기 충전 (총 {totalKm}km)</span>
              <span className="font-medium text-slate-900">{formatPrice(evChargeCost)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">🅿️ 주차비 (1일 5,000원 × {days}일)</span>
            <span className="font-medium text-slate-900">{formatPrice(parkingCost)}</span>
          </div>
          <div className="flex justify-between py-2 font-black text-lg">
            <span className="text-slate-900">합계</span>
            <span className="text-blue-600">{formatPrice(totalCost)}</span>
          </div>
        </div>
      </div>

      {/* 보험 안내 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: '🛡', title: '완전자차 (CDW)', sub: '면책금 0원 · 모든 차량 적용 가능', price: '+₩15,000/일' },
          { icon: '👶', title: '카시트', sub: '유아·주니어 카시트 무료 대여', price: '무료' },
          { icon: '⛽', title: '연료 풀투풀', sub: '반납 시 만땅 / 동일 잔량으로', price: '기본' },
        ].map((v) => (
          <div key={v.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl">{v.icon}</div>
            <p className="font-extrabold text-slate-900 text-sm mt-2">{v.title}</p>
            <p className="text-xs text-slate-500 mt-1">{v.sub}</p>
            <p className="font-bold text-xs text-blue-600 mt-2">{v.price}</p>
          </div>
        ))}
      </div>

      <ReservationCTA />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'ai', label: 'AI 추천', emoji: '✨' },
  { id: 'compare', label: '차종 비교', emoji: '🔍' },
  { id: 'cost', label: '비용 계산', emoji: '💰' },
];

const QUICK_SEATS = [
  { id: '1-2', label: '1~2명', emoji: '👤' },
  { id: '3-4', label: '3~4명', emoji: '👥' },
  { id: '5+', label: '5명+', emoji: '👨‍👩‍👧‍👦' },
];

export default function RentcarPage() {
  const [activeTab, setActiveTab] = useState('ai');
  const [quickSeats, setQuickSeats] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero — 시안 16 그대로: blue→cyan 그라디언트, 흰 검색바 */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">RENTCAR · 제휴 12개 업체</span>
          <h1 className="text-3xl md:text-4xl font-black mt-2 leading-tight">
            제주 렌터카<br />최저가 한 번에 비교
          </h1>
          <p className="opacity-90 text-sm mt-3 max-w-md">
            공항 도착 즉시 픽업. 보험 포함 가격으로 투명하게.
          </p>

          {/* 검색바 */}
          <div className="mt-6 bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-1 shadow-xl">
            <div className="flex-1 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">픽업 위치</p>
              <p className="font-extrabold text-slate-800 text-sm">제주국제공항</p>
            </div>
            <div className="hidden md:block w-px bg-slate-100" />
            <div className="flex-1 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">픽업 일시</p>
              <input
                type="text"
                defaultValue="5/12 (화) 10:00"
                className="font-extrabold text-slate-800 text-sm bg-transparent focus:outline-none w-full"
              />
            </div>
            <div className="hidden md:block w-px bg-slate-100" />
            <div className="flex-1 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">반납 일시</p>
              <input
                type="text"
                defaultValue="5/14 (목) 19:00"
                className="font-extrabold text-slate-800 text-sm bg-transparent focus:outline-none w-full"
              />
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-colors">
              검색
            </button>
          </div>

          {/* 옵션 필터 칩 */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs items-center">
            <span className="opacity-80">옵션:</span>
            {['보험포함', '초보환영', '전기차', '7인 이상', '면허 1년 미만'].map((v) => (
              <button
                key={v}
                className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur border border-white/30 font-bold hover:bg-white/30 transition-colors"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AI 추천 배너 */}
      <section className="px-6 md:px-10 py-5 bg-violet-50 border-b border-violet-100">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-extrabold px-2 py-1 rounded bg-violet-600 text-white uppercase tracking-widest">
            ✨ AI 추천
          </span>
          <p className="text-sm text-slate-700">
            인원·일정·목적에 맞는 차량을 <strong className="text-violet-700">AI가 자동 추천</strong>해드려요.
          </p>
          <button
            onClick={() => setActiveTab('ai')}
            className="ml-auto text-xs font-extrabold text-violet-700 hover:underline"
          >
            AI 추천받기 →
          </button>
        </div>
      </section>

      {/* 빠른 인원 선택 */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex justify-center gap-3">
          {QUICK_SEATS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setQuickSeats(s.id);
                setActiveTab('compare');
              }}
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl border-2 font-extrabold text-sm transition-all ${
                quickSeats === s.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">인원을 선택하면 적합한 차종을 바로 보여드려요</p>
      </div>

      {/* 탭 */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm mt-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-extrabold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'ai' && <AITab quickSeats={quickSeats} />}
        {activeTab === 'compare' && <CompareTab quickSeats={quickSeats} />}
        {activeTab === 'cost' && <CostTab />}
      </div>
    </div>
  );
}
