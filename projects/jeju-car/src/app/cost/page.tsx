"use client";

import { useState, useEffect } from "react";
import { CARS, type CarType } from "@/lib/car-data";
import { CAR_FUEL_EFFICIENCY, STATIONS } from "@/lib/fuel-data";
import { loadSelectedCar } from "@/lib/shared-state";

const INSURANCE_OPTIONS = [
  { id: "basic", label: "기본 보험", desc: "자차 면책 50만원", pricePerDay: 0 },
  { id: "standard", label: "일반 보험", desc: "자차 면책 30만원", pricePerDay: 8000 },
  { id: "premium", label: "완전자차", desc: "면책 0원", pricePerDay: 15000 },
];

const AVG_FUEL_PRICE = { gasoline: 1680, diesel: 1500 };
const JEJU_DAILY_KM = 100; // 제주 하루 평균 주행거리

export default function CostSimulatorPage() {
  const [selectedCarId, setSelectedCarId] = useState(CARS[0].id);
  const [days, setDays] = useState(3);
  const [insurance, setInsurance] = useState("standard");
  const [dailyKm, setDailyKm] = useState(JEJU_DAILY_KM);

  // 차종추천에서 선택된 차종/일수 자동 적용
  useEffect(() => {
    const saved = loadSelectedCar();
    if (saved) {
      const matched = CARS.find((c) => c.id === saved.carId);
      if (matched) setSelectedCarId(matched.id);
      if (saved.days) setDays(saved.days);
    }
  }, []);

  const car = CARS.find((c) => c.id === selectedCarId)!;
  const carFuel = CAR_FUEL_EFFICIENCY[car.name.split(" ").pop()!];
  const insuranceOption = INSURANCE_OPTIONS.find((i) => i.id === insurance)!;

  // 비용 계산
  const rentCost = car.pricePerDay * days;
  const insuranceCost = insuranceOption.pricePerDay * days;
  const isEV = car.fuelType === "전기";

  const totalKm = dailyKm * days;
  let fuelCost = 0;
  let fuelLiters = 0;
  if (carFuel && !isEV) {
    fuelLiters = Math.ceil(totalKm / carFuel.kmPerLiter);
    const pricePerLiter = carFuel.fuelType === "diesel" ? AVG_FUEL_PRICE.diesel : AVG_FUEL_PRICE.gasoline;
    fuelCost = fuelLiters * pricePerLiter;
  }
  const evChargeCost = isEV ? Math.round(totalKm * 40) : 0; // 약 40원/km

  const parkingCost = days * 5000;
  const totalCost = rentCost + insuranceCost + fuelCost + evChargeCost + parkingCost;

  const formatPrice = (n: number) =>
    n >= 10000 ? `${(n / 10000).toFixed(1)}만원` : `${n.toLocaleString()}원`;

  const costBreakdown = [
    { label: "렌트비", amount: rentCost, color: "bg-violet-400", icon: "🚗" },
    { label: "보험료", amount: insuranceCost, color: "bg-blue-400", icon: "🛡️" },
    { label: isEV ? "충전비" : "주유비", amount: isEV ? evChargeCost : fuelCost, color: "bg-amber-400", icon: isEV ? "⚡" : "⛽" },
    { label: "주차비(예상)", amount: parkingCost, color: "bg-gray-400", icon: "🅿️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white/80 backdrop-blur border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">💰 렌터카 총 비용 시뮬레이터</h1>
          <p className="text-sm text-gray-500 mt-1">렌트비 + 주유비 + 보험 + 주차비를 한눈에 비교하세요</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* 차종 선택 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-3">차종 선택</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CARS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCarId(c.id)}
                className={`p-3 rounded-xl text-center transition-all border-2 ${
                  selectedCarId === c.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="text-2xl">{c.image}</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{c.name.split(" ").pop()}</div>
                <div className="text-[10px] text-gray-400">{formatPrice(c.pricePerDay)}/일</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {car.features.map((f) => (
              <span key={f} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full">{f}</span>
            ))}
          </div>
        </div>

        {/* 옵션 */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* 일수 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-3">대여 기간</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setDays(Math.max(1, days - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">-</button>
              <span className="text-2xl font-bold text-gray-900 w-16 text-center">{days}일</span>
              <button onClick={() => setDays(Math.min(14, days + 1))}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">+</button>
            </div>
          </div>

          {/* 일일 주행거리 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-2">하루 주행거리</h3>
            <input
              type="range"
              min={50}
              max={250}
              step={10}
              value={dailyKm}
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full accent-emerald-500"
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
                className={`p-3 rounded-xl text-center transition-all border-2 ${
                  insurance === opt.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="text-sm font-bold text-gray-900">{opt.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
                <div className="text-xs font-medium text-emerald-600 mt-1">
                  {opt.pricePerDay === 0 ? "무료" : `+${formatPrice(opt.pricePerDay)}/일`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 총 비용 결과 */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
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
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {costBreakdown.map((item) => {
              const pct = totalCost > 0 ? (item.amount / totalCost) * 100 : 0;
              return pct > 0 ? (
                <div key={item.label} className={`${item.color}`} style={{ width: `${pct}%` }} title={`${item.label}: ${formatPrice(item.amount)}`} />
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
            {!isEV && carFuel && (
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">⛽ {carFuel.fuelType === "diesel" ? "경유" : "휘발유"} {fuelLiters}L (총 {totalKm}km)</span>
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
              <span className="text-emerald-600">{formatPrice(totalCost)}</span>
            </div>
          </div>
        </div>

        {/* 최저가 주유소 안내 */}
        {!isEV && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-3">⛽ 최저가 주유소 (제주)</h3>
            <div className="space-y-2">
              {[...STATIONS]
                .sort((a, b) =>
                  carFuel?.fuelType === "diesel" ? a.diesel - b.diesel : a.gasoline - b.gasoline
                )
                .slice(0, 3)
                .map((s, i) => {
                  const price = carFuel?.fuelType === "diesel" ? s.diesel : s.gasoline;
                  return (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        i === 0 ? "bg-emerald-500" : "bg-gray-400"
                      }`}>{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-[10px] text-gray-400">{s.address} {s.selfService ? "· 셀프" : ""}</p>
                      </div>
                      <p className="text-sm font-bold text-emerald-600">{price.toLocaleString()}원/L</p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="/" className="flex items-center justify-center gap-2 py-3 bg-violet-500 text-white rounded-xl font-medium text-sm hover:bg-violet-600 transition-colors">
            🚗 다른 차종 추천받기
          </a>
          <a href="/fuel" className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors">
            ⛽ 주유 가이드 보기
          </a>
        </div>
      </main>
    </div>
  );
}
