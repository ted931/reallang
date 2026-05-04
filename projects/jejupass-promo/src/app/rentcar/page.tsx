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

const BENEFITS = [
  { icon: '✅', text: '최저가 보장' },
  { icon: '🔄', text: '무료 취소' },
  { icon: '🛡️', text: '완전자차 옵션' },
  { icon: '📍', text: '제주 공항 픽업' },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}만원`;
  return `${n.toLocaleString()}원`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BenefitBadges() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {BENEFITS.map((b) => (
        <span
          key={b.text}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-orange-200 text-orange-700"
        >
          <span>{b.icon}</span>
          {b.text}
        </span>
      ))}
    </div>
  );
}

function ReservationCTA() {
  return (
    <div className="mt-6 rounded-2xl p-5 text-center" style={{ backgroundColor: BRAND.colorLight }}>
      <p className="text-sm font-semibold text-gray-700 mb-3">제주패스에서 최저가로 예약하세요</p>
      <BenefitBadges />
      <a
        href="https://jejupass.com/rentcar"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-4 px-8 py-3 rounded-xl text-white font-bold text-base shadow-lg transition-all hover:shadow-xl hover:opacity-90"
        style={{ backgroundColor: BRAND.color }}
      >
        <span>🚗</span>
        렌터카 예약하기
      </a>
      <p className="mt-2 text-[11px] text-gray-400">jejupass.com · 최저가 보장 · 즉시 예약</p>
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
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">인원</p>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setTravelers(n)}
                className="w-11 h-11 rounded-xl text-sm font-bold transition-all"
                style={
                  travelers === n
                    ? { backgroundColor: BRAND.color, color: '#fff' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                }
              >
                {n}{n >= 7 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* 여행 일수 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">여행 일수</p>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={
                  days === d
                    ? { backgroundColor: BRAND.color, color: '#fff' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                }
              >
                {d}일
              </button>
            ))}
          </div>
        </div>

        {/* 짐 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">짐</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LUGGAGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLuggage(opt.id)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left border-2"
                style={
                  luggage === opt.id
                    ? { borderColor: BRAND.color, backgroundColor: BRAND.colorLight, color: BRAND.color }
                    : { borderColor: 'transparent', backgroundColor: '#F9FAFB', color: '#6B7280' }
                }
              >
                <span className="text-base">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 여행 목적 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">여행 목적</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className="p-3 rounded-xl text-left transition-all border-2"
                style={
                  purpose === p.id
                    ? { borderColor: BRAND.color, backgroundColor: BRAND.colorLight }
                    : { borderColor: 'transparent', backgroundColor: '#F9FAFB' }
                }
              >
                <div className="text-xl mb-1">{p.emoji}</div>
                <div className="text-xs font-bold text-gray-800">{p.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 예산 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            렌터카 예산 <span className="text-gray-300 font-normal normal-case">(선택)</span>
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="예: 15"
              className="w-28 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-gray-50 text-center font-semibold"
            />
            <span className="text-sm text-gray-500">만원 이하</span>
          </div>
        </div>

        {/* 추천 버튼 */}
        <button
          onClick={handleRecommend}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ backgroundColor: BRAND.color }}
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
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-gray-800 font-bold text-lg mb-1">조건을 입력하면</p>
            <p className="text-gray-400 text-sm">AI가 최적 차종을 추천해드려요</p>
            <div className="mt-6 flex justify-center gap-4 text-xs text-gray-300">
              <span>{travelers}명</span>
              <span>·</span>
              <span>{days}일</span>
              <span>·</span>
              <span>{PURPOSES.find((p) => p.id === purpose)?.label}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: BRAND.colorLight, borderTopColor: BRAND.color }}
            />
            <p className="text-gray-600 font-semibold">AI가 최적 차종 분석 중</p>
            <p className="text-gray-400 text-sm mt-1">
              {travelers}명 · {days}일 · {PURPOSES.find((p) => p.id === purpose)?.label}
            </p>
          </div>
        )}

        {result && (
          <>
            {/* AI 요약 */}
            <div
              className="rounded-2xl p-5 text-white shadow-lg"
              style={{ backgroundColor: BRAND.color }}
            >
              <p className="text-xs font-semibold text-white/70 mb-1">AI 분석 결과</p>
              <p className="text-sm font-medium leading-relaxed">{result.summary}</p>
            </div>

            {/* 1순위 추천 */}
            {result.recommendation?.car && (
              <div className="bg-white rounded-2xl border-2 p-6" style={{ borderColor: BRAND.color }}>
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide text-white"
                    style={{ backgroundColor: BRAND.color }}
                  >
                    1순위 추천
                  </span>
                  <span className="text-xs text-gray-400">AI 최적 매칭</span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-5xl border border-gray-100 flex-shrink-0">
                    {result.recommendation.car.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900">{result.recommendation.car.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {result.recommendation.car.category}
                      </span>
                      <span className="text-xs text-gray-400">{result.recommendation.car.seats}인승</span>
                      <span className="text-xs text-gray-400">{result.recommendation.car.fuelType}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold" style={{ color: BRAND.color }}>
                        {result.recommendation.car.pricePerDay.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400">원/일</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 rounded-xl p-4">
                  {result.recommendation.reason}
                </p>

                <div className="text-xs text-gray-400 mb-4 font-medium">
                  {result.recommendation.costBreakdown}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {result.recommendation.car.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {result.recommendation.tips?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-amber-700 mb-2">💡 제주 여행 팁</p>
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
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    대안 차종
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl border border-gray-100 flex-shrink-0">
                    {result.alternative.car.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{result.alternative.car.name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      일 {result.alternative.car.pricePerDay.toLocaleString()}원 · {result.alternative.priceDiff}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{result.alternative.reason}</p>
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
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">가격대</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setPriceFilter(f.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={
                  priceFilter === f.id
                    ? { backgroundColor: BRAND.color, color: '#fff' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">인원</p>
          <div className="flex flex-wrap gap-2">
            {SEAT_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSeatFilter(f.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={
                  seatFilter === f.id
                    ? { backgroundColor: BRAND.color, color: '#fff' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 차종 그리드 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((car) => (
          <button
            key={car.id}
            onClick={() => setSelected(selected === car.id ? null : car.id)}
            className="bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md"
            style={
              selected === car.id
                ? { borderColor: BRAND.color, backgroundColor: BRAND.colorLight }
                : { borderColor: '#F3F4F6' }
            }
          >
            <div className="text-4xl mb-3">{car.emoji}</div>
            <div className="font-bold text-gray-900 text-sm">{car.name}</div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {car.category}
              </span>
              <span className="text-[10px] text-gray-400">{car.seats}인승</span>
              <span className="text-[10px] text-gray-400">{car.fuelType}</span>
            </div>
            <div className="mt-3 font-bold text-lg" style={{ color: BRAND.color }}>
              {formatPrice(car.pricePerDay)}
              <span className="text-xs text-gray-400 font-normal">/일</span>
            </div>
            <div className="mt-2 space-y-0.5">
              {car.features.slice(0, 2).map((f) => (
                <p key={f} className="text-[10px] text-gray-400">· {f}</p>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* 선택 차량 상세 */}
      {selectedCar && (
        <div className="bg-white rounded-2xl border-2 p-5" style={{ borderColor: BRAND.color }}>
          <div className="flex items-center gap-4">
            <div className="text-5xl w-20 h-20 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
              {selectedCar.emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{selectedCar.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{selectedCar.category}</span>
                <span className="text-xs text-gray-500">{selectedCar.seats}인승</span>
                <span className="text-xs text-gray-500">{selectedCar.fuelType}</span>
                <span className="text-xs text-gray-500">트렁크: {selectedCar.trunkCapacity}</span>
              </div>
              <div className="mt-2 text-2xl font-bold" style={{ color: BRAND.color }}>
                {formatPrice(selectedCar.pricePerDay)}
                <span className="text-sm text-gray-400 font-normal ml-1">/일</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {selectedCar.features.map((f) => (
              <span key={f} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}>
                {f}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedCar.bestFor.map((b) => (
              <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
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
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">차종 선택</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CARS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCarId(c.id)}
              className="p-3 rounded-xl text-center transition-all border-2"
              style={
                selectedCarId === c.id
                  ? { borderColor: BRAND.color, backgroundColor: BRAND.colorLight }
                  : { borderColor: 'transparent', backgroundColor: '#F9FAFB' }
              }
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="text-xs font-bold text-gray-900 mt-1">{c.name.split(' ').pop()}</div>
              <div className="text-[10px] text-gray-400">{formatPrice(c.pricePerDay)}/일</div>
            </button>
          ))}
        </div>
      </div>

      {/* 옵션 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* 일수 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-3">대여 기간</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold text-gray-900 w-16 text-center">{days}일</span>
            <button
              onClick={() => setDays(Math.min(14, days + 1))}
              className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* 주행거리 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-2">하루 주행거리</h3>
          <input
            type="range"
            min={50}
            max={250}
            step={10}
            value={dailyKm}
            onChange={(e) => setDailyKm(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: BRAND.color }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">시내 위주</span>
            <span className="text-lg font-bold text-gray-900">{dailyKm}km</span>
            <span className="text-[10px] text-gray-400">일주</span>
          </div>
        </div>
      </div>

      {/* 보험 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-3">보험 유형</h3>
        <div className="grid grid-cols-3 gap-2">
          {INSURANCE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setInsurance(opt.id)}
              className="p-3 rounded-xl text-center transition-all border-2"
              style={
                insurance === opt.id
                  ? { borderColor: BRAND.color, backgroundColor: BRAND.colorLight }
                  : { borderColor: 'transparent', backgroundColor: '#F9FAFB' }
              }
            >
              <div className="text-sm font-bold text-gray-900">{opt.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
              <div className="text-xs font-medium mt-1" style={{ color: BRAND.color }}>
                {opt.pricePerDay === 0 ? '무료' : `+${formatPrice(opt.pricePerDay)}/일`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 총 비용 결과 */}
      <div className="rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${BRAND.color}, ${BRAND.colorDark})` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-white/80">예상 총 비용</p>
            <p className="text-3xl font-bold">{formatPrice(totalCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">1인당 (2인 기준)</p>
            <p className="text-xl font-bold">{formatPrice(Math.round(totalCost / 2))}</p>
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
                <p className="text-sm font-bold">{formatPrice(item.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-3">상세 분석</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">🚗 {car.name} × {days}일</span>
            <span className="font-medium text-gray-900">{formatPrice(rentCost)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">🛡️ {insuranceOption.label} × {days}일</span>
            <span className="font-medium text-gray-900">{formatPrice(insuranceCost)}</span>
          </div>
          {!isEV && (
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">
                ⛽ {car.fuelType === '디젤' ? '경유' : '휘발유'} {fuelLiters}L (총 {totalKm}km)
              </span>
              <span className="font-medium text-gray-900">{formatPrice(fuelCost)}</span>
            </div>
          )}
          {isEV && (
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">⚡ 전기 충전 (총 {totalKm}km)</span>
              <span className="font-medium text-gray-900">{formatPrice(evChargeCost)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">🅿️ 주차비 (1일 5,000원 × {days}일)</span>
            <span className="font-medium text-gray-900">{formatPrice(parkingCost)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span className="text-gray-900">합계</span>
            <span style={{ color: BRAND.color }}>{formatPrice(totalCost)}</span>
          </div>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section
        className="py-10 px-4 text-center"
        style={{ background: `linear-gradient(135deg, ${BRAND.color}15 0%, white 60%)` }}
      >
        <div className="max-w-2xl mx-auto">
          <span
            className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}
          >
            제주패스 렌터카
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            제주 렌터카<br />최저가 비교 · AI 추천
          </h1>
          <p className="mt-3 text-gray-500 text-base">
            인원, 짐, 여행 목적에 맞는 차종을 AI가 추천하고<br />총 비용까지 한눈에 계산해드려요
          </p>

          {/* 빠른 인원 선택 */}
          <div className="mt-6 flex justify-center gap-3">
            {QUICK_SEATS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setQuickSeats(s.id);
                  setActiveTab('compare');
                }}
                className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all"
                style={
                  quickSeats === s.id
                    ? { borderColor: BRAND.color, backgroundColor: BRAND.colorLight, color: BRAND.color }
                    : { borderColor: '#E5E7EB', backgroundColor: 'white', color: '#374151' }
                }
              >
                <span className="text-xl">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">인원을 선택하면 적합한 차종을 바로 보여드려요</p>
        </div>
      </section>

      {/* 탭 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2"
                style={
                  activeTab === tab.id
                    ? { borderColor: BRAND.color, color: BRAND.color }
                    : { borderColor: 'transparent', color: '#9CA3AF' }
                }
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
