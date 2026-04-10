"use client";

import { useState, useEffect } from "react";
import { STATIONS, CAR_FUEL_EFFICIENCY, calculateFuel, type GasStation } from "@/lib/fuel-data";
import { loadSelectedCar } from "@/lib/shared-state";

const CAR_NAMES = Object.keys(CAR_FUEL_EFFICIENCY);

const RETURN_LOCATIONS = [
  { name: "제주공항", lat: 33.5066, lng: 126.4928 },
  { name: "서귀포 반납점", lat: 33.2541, lng: 126.5600 },
  { name: "중문 반납점", lat: 33.2490, lng: 126.4122 },
];

export default function SmartFuelPage() {
  const [carName, setCarName] = useState("아반떼");

  // 차종추천에서 선택된 차종 자동 적용
  useEffect(() => {
    const saved = loadSelectedCar();
    if (saved) {
      const shortName = saved.carName.split(" ").pop() || "";
      if (CAR_FUEL_EFFICIENCY[shortName]) setCarName(shortName);
    }
  }, []);
  const [fuelPercent, setFuelPercent] = useState(30);
  const [returnLocation, setReturnLocation] = useState("제주공항");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const ret = RETURN_LOCATIONS.find((l) => l.name === returnLocation)!;
    const fuelInfo = calculateFuel(carName, fuelPercent, 15); // 반납점까지 약 15km 가정

    // 가장 가까운 + 가장 저렴한 주유소 찾기
    const carFuelType = CAR_FUEL_EFFICIENCY[carName]?.fuelType;
    const sortedByPrice = [...STATIONS].sort((a, b) =>
      carFuelType === "diesel" ? a.diesel - b.diesel : a.gasoline - b.gasoline
    );

    const cheapest = sortedByPrice[0];
    const nearest = STATIONS[0]; // 실제로는 거리 계산 필요

    const pricePerLiter = carFuelType === "diesel" ? cheapest.diesel : cheapest.gasoline;
    const totalCost = fuelInfo.needed * pricePerLiter;

    setResult({
      ...fuelInfo,
      cheapest,
      nearest,
      pricePerLiter,
      totalCost,
      returnLocation,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white/80 backdrop-blur border-b border-green-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">⛽ 스마트 주유</h1>
          <p className="text-sm text-gray-500 mt-0.5">반납 전 최적 주유소 + 정확한 주유량 계산</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
          {/* 차종 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">차종</label>
            <div className="flex flex-wrap gap-2">
              {CAR_NAMES.map((name) => (
                <button key={name} onClick={() => setCarName(name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    carName === name ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* 현재 연료 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 연료 잔량: <span className="text-green-600 font-bold">{fuelPercent}%</span>
            </label>
            <input type="range" min={0} max={100} step={5} value={fuelPercent}
              onChange={(e) => setFuelPercent(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>E (비어있음)</span><span>F (가득)</span>
            </div>
          </div>

          {/* 반납 위치 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">반납 위치</label>
            <div className="flex gap-2">
              {RETURN_LOCATIONS.map((loc) => (
                <button key={loc.name} onClick={() => setReturnLocation(loc.name)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
                    returnLocation === loc.name ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCalculate}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-500 transition-all">
            주유량 계산하기
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div className="space-y-4">
            {/* 주유 요약 */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">주유 가이드</h3>

              {result.needed === 0 ? (
                <div className="text-center py-6">
                  <span className="text-5xl">⚡</span>
                  <p className="text-lg font-bold text-green-600 mt-3">{result.message}</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500">필요 주유량</p>
                    <p className="text-2xl font-bold text-green-600">{result.needed}L</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500">예상 비용</p>
                    <p className="text-2xl font-bold text-green-600">{result.totalCost.toLocaleString()}원</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500">연료 타입</p>
                    <p className="text-2xl font-bold text-green-600">{result.fuelType === "diesel" ? "경유" : "휘발유"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 추천 주유소 */}
            {result.needed > 0 && result.cheapest && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-3">💰 최저가 주유소</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{result.cheapest.name}</p>
                    <p className="text-xs text-gray-500">{result.cheapest.address}</p>
                    <div className="flex gap-2 mt-2">
                      {result.cheapest.selfService && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">셀프</span>}
                      {result.cheapest.open24h && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">24시간</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{result.pricePerLiter.toLocaleString()}원/L</p>
                    <a href={`https://map.kakao.com/link/to/${result.cheapest.name},${result.cheapest.lat},${result.cheapest.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-500">
                      길찾기
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 전체 주유소 리스트 */}
            {result.needed > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-3">주변 주유소</h3>
                <div className="space-y-2">
                  {STATIONS.sort((a, b) => {
                    const key = result.fuelType === "diesel" ? "diesel" : "gasoline";
                    return (a as any)[key] - (b as any)[key];
                  }).map((st) => {
                    const price = result.fuelType === "diesel" ? st.diesel : st.gasoline;
                    return (
                      <div key={st.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{st.name}</p>
                          <p className="text-xs text-gray-400">{st.brand} · {st.address}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-700">{price.toLocaleString()}원</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
