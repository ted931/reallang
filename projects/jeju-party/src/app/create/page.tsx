"use client";

import { useState } from "react";
import { HOBBY_CATEGORIES, REGIONS, type ScheduleItem } from "@/lib/types";
import { CAFE_TOURS } from "@/lib/dummy-cafe-tours";
import { CARS, RENTAL_STATIONS, CATEGORY_CAR_MAP } from "@/lib/car-data";
import PhoneVerify, { usePhoneVerified } from "@/components/phone-verify";

function getInitParam(key: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

export default function CreatePartyPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [costType, setCostType] = useState<"split" | "free" | "fixed">("split");
  const [costAmount, setCostAmount] = useState("");
  const [rentalCarMode, setRentalCarMode] = useState<"none" | "own-car" | "rent-together">("none");
  const [carInfo, setCarInfo] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");
  const [rentalPickup, setRentalPickup] = useState("제주공항점");
  const [rentalReturn, setRentalReturn] = useState("제주공항점");
  const [equipment, setEquipment] = useState("");
  const [hostName, setHostName] = useState("");
  const [hostBio, setHostBio] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [submitted, setSubmitted] = useState(getInitParam("step") === "done");
  const [aiLoading, setAiLoading] = useState(false);
  const [cafePassEnabled, setCafePassEnabled] = useState(false);
  const [cafePassNote, setCafePassNote] = useState("");
  const [selectedTourId, setSelectedTourId] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [showSafetyGuide, setShowSafetyGuide] = useState(false);
  const phoneVerified = usePhoneVerified();

  const addScheduleItem = () => {
    const lastTime = schedule.length > 0 ? schedule[schedule.length - 1].time : time || "10:00";
    const [h, m] = lastTime.split(":").map(Number);
    const nextH = String(h + 1).padStart(2, "0");
    setSchedule([...schedule, { time: `${nextH}:${m === 0 ? "00" : String(m).padStart(2, "0")}`, place: "", memo: "" }]);
  };

  const updateScheduleItem = (idx: number, field: keyof ScheduleItem, value: string) => {
    const updated = [...schedule];
    updated[idx] = { ...updated[idx], [field]: value };
    setSchedule(updated);
  };

  const removeScheduleItem = (idx: number) => {
    setSchedule(schedule.filter((_, i) => i !== idx));
  };

  const handleAiSchedule = async () => {
    if (!region) return;
    setAiLoading(true);
    try {
      const catLabel = category === "other"
        ? customCategory || "기타"
        : HOBBY_CATEGORIES.find((c) => c.id === category)?.label || "여행";

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/parties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suggest_schedule", category: catLabel, region, date, time }),
      });
      const data = await res.json();
      if (data.schedule?.length) {
        setSchedule(data.schedule);
      }
      if (data.description && !description) {
        setDescription(data.description);
      }
    } catch { /* ignore */ }
    setAiLoading(false);
  };

  const handleSubmit = () => {
    if (!title || !category || !date || !region || !hostName || !consentChecked) return;
    if (!phoneVerified) {
      setShowPhoneVerify(true);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-sm w-full">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">파티가 만들어졌어요!</h2>
          <p className="text-sm text-gray-500 mb-6">파티원들이 참여 신청을 보낼 거예요</p>
          <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm">
            파티 목록 보기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="text-gray-400 hover:text-gray-600">← 목록</a>
          <h1 className="text-lg font-bold text-gray-900">파티 만들기</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* 닉네임 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <label className="block text-sm font-bold text-gray-700 mb-2">파티장 닉네임</label>
          <input type="text" value={hostName} onChange={(e) => setHostName(e.target.value)}
            placeholder="예: 라이더김" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none" />
          <input type="text" value={hostBio} onChange={(e) => setHostBio(e.target.value)}
            placeholder="한줄 소개 (선택)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none" />
        </div>

        {/* 취미 카테고리 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <label className="block text-sm font-bold text-gray-700 mb-2">어떤 취미?</label>
          <div className="flex flex-wrap gap-2">
            {HOBBY_CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat.id ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          {category === "other" && (
            <input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="취미를 직접 입력해주세요 (예: 보드게임, 요가, 독서모임)" className="w-full mt-3 px-4 py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-sm focus:border-orange-400 outline-none" />
          )}
        </div>

        {/* 제목 + 설명 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">파티 제목</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 애월 해안도로 자전거 라이딩" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">파티 소개</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="어떤 코스로 가는지, 뭘 준비해야 하는지, 끝나고 뭘 할 건지 등등 자유롭게!" rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none" />
          </div>
        </div>

        {/* 날짜/시간/지역/장소 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">날짜</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">시간</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">지역</label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${region === r ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">집합 장소</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 애월항 주차장" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
            {/집|숙소|에어비앤비|게스트하우스|모텔|호텔 방/.test(location) && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                <span className="text-sm mt-0.5">⚠️</span>
                <p className="text-xs text-amber-700">
                  공개된 장소(카페, 공원, 주차장 등)에서 만나는 것을 권장합니다
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 일정 타임라인 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-700">일정 (선택)</label>
            <div className="flex gap-2">
              {category && region && (
                <button onClick={handleAiSchedule} disabled={aiLoading}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium disabled:opacity-50">
                  {aiLoading ? "생성 중..." : "✨ AI가 일정 짜기"}
                </button>
              )}
              <button onClick={addScheduleItem} className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                + 직접 추가
              </button>
            </div>
          </div>

          {schedule.length === 0 ? (
            <div className="text-center py-6 text-gray-300">
              <p className="text-sm">일정을 추가하면 파티원들이 더 쉽게 이해할 수 있어요</p>
              <p className="text-xs mt-1">대충 적어도 OK, 상세하게 적어도 OK</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start group">
                  {/* 타임라인 도트 */}
                  <div className="flex flex-col items-center pt-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    {idx < schedule.length - 1 && <div className="w-px h-full bg-orange-200 min-h-[40px]" />}
                  </div>
                  {/* 시간 */}
                  <input type="time" value={item.time}
                    onChange={(e) => updateScheduleItem(idx, "time", e.target.value)}
                    className="w-20 px-2 py-2 rounded-lg border border-gray-200 text-xs font-mono focus:border-orange-400 outline-none flex-shrink-0" />
                  {/* 장소 + 메모 */}
                  <div className="flex-1 space-y-1">
                    <input type="text" value={item.place}
                      onChange={(e) => updateScheduleItem(idx, "place", e.target.value)}
                      placeholder="장소" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-400 outline-none" />
                    <input type="text" value={item.memo || ""}
                      onChange={(e) => updateScheduleItem(idx, "memo", e.target.value)}
                      placeholder="메모 (선택)" className="w-full px-3 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-500 focus:border-orange-300 outline-none" />
                  </div>
                  {/* 삭제 */}
                  <button onClick={() => removeScheduleItem(idx)}
                    className="text-gray-300 hover:text-red-400 text-sm pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addScheduleItem}
                className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors">
                + 일정 추가
              </button>
            </div>
          )}
        </div>

        {/* 인원 + 비용 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">모집 인원 (본인 포함)</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setMaxMembers(Math.max(2, maxMembers - 1))} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold">-</button>
              <span className="text-xl font-bold w-10 text-center">{maxMembers}명</span>
              <button onClick={() => setMaxMembers(Math.min(10, maxMembers + 1))} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">비용</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {([
                ["split", "엔빵"],
                ["free", "무료"],
                ["fixed", "정해진 금액"],
                ["split-cafe", "엔빵 + 카페패스"],
                ["free-cafe", "무료 + 카페패스"],
              ] as const).map(([val, label]) => {
                const isActive = val.includes("cafe")
                  ? costType === val.replace("-cafe", "") && cafePassEnabled
                  : costType === val && !cafePassEnabled;
                const isCafe = val.includes("cafe");
                return (
                  <button key={val} onClick={() => {
                    const base = val.replace("-cafe", "") as "split" | "free" | "fixed";
                    setCostType(base);
                    setCafePassEnabled(isCafe);
                  }}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? isCafe ? "bg-sky-500 text-white" : "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>
            {costType !== "free" && (
              <input type="number" value={costAmount} onChange={(e) => setCostAmount(e.target.value)}
                placeholder={costType === "split" ? "인당 예상 금액 (원)" : "참가비 (원)"}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
            )}
            {cafePassEnabled && costType !== "free" && costAmount && (
              <p className="text-[11px] text-sky-600 mt-1.5">
                파티비 {Number(costAmount).toLocaleString()}원 + 카페패스 14,900원~ (각자 선택 구매)
              </p>
            )}
            {cafePassEnabled && costType === "free" && (
              <p className="text-[11px] text-sky-600 mt-1.5">
                파티는 무료, 카페패스만 각자 구매 (14,900원~)
              </p>
            )}
            {rentalCarMode === "rent-together" && selectedCarId && (() => {
              const sc = CARS.find((c) => c.id === selectedCarId);
              if (!sc) return null;
              const rentalPP = Math.ceil(sc.pricePerDay / maxMembers);
              const partyAmount = costType !== "free" && costAmount ? Number(costAmount) : 0;
              return (
                <p className="text-[11px] text-blue-600 mt-1.5">
                  {partyAmount > 0
                    ? `파티비 ${partyAmount.toLocaleString()}원 + 렌터카 엔빵 ${rentalPP.toLocaleString()}원 = 총 ${(partyAmount + rentalPP).toLocaleString()}원/인`
                    : `파티 무료 + 렌터카 엔빵 ${rentalPP.toLocaleString()}원/인`}
                </p>
              );
            })()}
          </div>
        </div>

        {/* 이동 수단 + 장비 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <label className="block text-sm font-bold text-gray-700">🚗 이동 수단</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              ["none", "각자 이동", "🚶"],
              ["own-car", "내 차로", "🚘"],
              ["rent-together", "같이 빌려요", "🤝"],
            ] as const).map(([val, label, emoji]) => (
              <button key={val} onClick={() => { setRentalCarMode(val); if (val !== "rent-together") setSelectedCarId(""); }}
                className={`py-3 rounded-xl text-sm font-medium transition-all text-center ${
                  rentalCarMode === val ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                <span className="block text-lg mb-0.5">{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {/* 내 차로 */}
          {rentalCarMode === "own-car" && (
            <input type="text" value={carInfo} onChange={(e) => setCarInfo(e.target.value)}
              placeholder="차종 (예: 카니발 9인승)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
          )}

          {/* 같이 빌려요 */}
          {rentalCarMode === "rent-together" && (() => {
            const recommended = CATEGORY_CAR_MAP[category] || [];
            const selectedCar = CARS.find((c) => c.id === selectedCarId);
            const perPerson = selectedCar ? Math.ceil(selectedCar.pricePerDay / maxMembers) : 0;
            return (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">차량을 선택하세요 {recommended.length > 0 && "(추천 표시)"}</p>
                <div className="grid grid-cols-2 gap-2">
                  {CARS.map((car) => {
                    const isRecommended = recommended.includes(car.id);
                    const isDisabled = car.seats < maxMembers;
                    const isSelected = selectedCarId === car.id;
                    return (
                      <button key={car.id}
                        disabled={isDisabled}
                        onClick={() => setSelectedCarId(isSelected ? "" : car.id)}
                        className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                          isSelected ? "border-orange-500 bg-orange-50" :
                          isDisabled ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed" :
                          "border-gray-200 hover:border-gray-300"
                        }`}>
                        {isRecommended && !isDisabled && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full">추천</span>
                        )}
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">{car.image}</span>
                          <span className="text-xs font-bold text-gray-900 truncate">{car.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 space-y-0.5">
                          <p>{car.seats}인승 · {car.trunkCapacity}</p>
                          <p className="font-medium text-gray-700">{car.pricePerDay.toLocaleString()}원/일</p>
                          <p className="text-orange-600 font-bold">엔빵 {Math.ceil(car.pricePerDay / maxMembers).toLocaleString()}원/인</p>
                        </div>
                        {isDisabled && (
                          <p className="text-[9px] text-red-400 mt-1">좌석 부족 ({car.seats}석 &lt; {maxMembers}명)</p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedCar && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">픽업 장소</label>
                        <select value={rentalPickup} onChange={(e) => setRentalPickup(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none bg-white">
                          {RENTAL_STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">반납 장소</label>
                        <select value={rentalReturn} onChange={(e) => setRentalReturn(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none bg-white">
                          {RENTAL_STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-orange-700">{selectedCar.name} · 1일</span>
                        <span className="text-sm font-bold text-orange-700">{selectedCar.pricePerDay.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-orange-600">엔빵 ({maxMembers}명)</span>
                        <span className="text-sm font-bold text-orange-600">{perPerson.toLocaleString()}원/인</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">필요한 장비/준비물 (선택)</label>
            <input type="text" value={equipment} onChange={(e) => setEquipment(e.target.value)}
              placeholder="예: 자전거, 등산화, 수영복 등" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
          </div>
        </div>

        {/* 카페패스 추천 — 모든 카테고리에서 노출 */}
        <div className={`rounded-2xl border p-5 transition-all ${cafePassEnabled ? "bg-sky-50/50 border-sky-200" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">☕</span>
              <div>
                <span className="text-sm font-bold text-gray-700">카페패스 추천</span>
                {!cafePassEnabled && (
                  <p className="text-[11px] text-gray-400 mt-0.5">제휴 카페 50곳+ · 3일 14,900원~</p>
                )}
              </div>
            </div>
            <button onClick={() => setCafePassEnabled(!cafePassEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${cafePassEnabled ? "bg-sky-500" : "bg-gray-300"}`}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: cafePassEnabled ? "translateX(20px)" : "translateX(0)" }} />
            </button>
          </div>

          {cafePassEnabled && (
            <div className="mt-4 space-y-3">
              {/* 패스 요약 — 깔끔한 2행 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-xl p-3 border border-sky-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-sky-500">무제한</span>
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[8px] font-bold rounded">인기</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">3시간마다 1잔 무료</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-gray-900">14,900</span>
                    <span className="text-[10px] text-gray-400">원/3일</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">5일 19,900원</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-amber-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-500">잔 이용권</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">30일 내 자유 사용</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-gray-900">9,900</span>
                    <span className="text-[10px] text-gray-400">원/3잔</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">5잔 15,500원 (잔당 3,100원)</p>
                </div>
              </div>

              {/* 추천 멘트 — 프리셋 + 직접 입력 */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-gray-500">추천 멘트</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "카페패스 있으면 음료 거의 공짜!",
                    "중간에 카페 들를 때 패스 쓰면 좋아요",
                    "저도 패스 쓸 예정이에요 같이 써요!",
                    "카페 투어할 건데 패스 필수!",
                    "쉬는 시간에 커피 한잔 어때요?",
                  ].map((preset) => (
                    <button key={preset} type="button"
                      onClick={() => setCafePassNote(cafePassNote === preset ? "" : preset)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                        cafePassNote === preset
                          ? "bg-sky-500 text-white font-medium"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-sky-300"
                      }`}>
                      {preset}
                    </button>
                  ))}
                </div>
                <input type="text" value={cafePassNote} onChange={(e) => setCafePassNote(e.target.value)}
                  placeholder="직접 입력도 가능해요"
                  className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white text-sm focus:border-sky-400 outline-none placeholder:text-gray-400" />
              </div>

              {/* 카페투어 코스 선택 — 카페 카테고리일 때만 */}
              {category === "cafe" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">카페투어 코스 (선택)</label>
                  <div className="space-y-2">
                    {CAFE_TOURS.filter((t) => !region || t.region === region).length > 0 ? (
                      CAFE_TOURS.filter((t) => !region || t.region === region).map((tour) => (
                        <button key={tour.id} onClick={() => {
                          if (selectedTourId === tour.id) {
                            setSelectedTourId("");
                          } else {
                            setSelectedTourId(tour.id);
                            const startH = parseInt(time?.split(":")[0] || "10");
                            const newSchedule: ScheduleItem[] = tour.cafes.map((cafe, idx) => {
                              const h = startH + Math.floor(idx * 0.7);
                              const m = Math.round((idx * 0.7 % 1) * 60);
                              return {
                                time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
                                place: cafe.name,
                                memo: `${cafe.specialty} · 약 ${cafe.stayMin}분${cafe.note ? ` · ${cafe.note}` : ""}`,
                              };
                            });
                            setSchedule(newSchedule);
                          }
                        }}
                          className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                            selectedTourId === tour.id ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{tour.image}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{tour.title}</p>
                                <p className="text-[10px] text-gray-400">
                                  ⭐ {tour.rating} · {tour.cafes.length}곳 · {tour.totalTime}
                                </p>
                              </div>
                            </div>
                            {selectedTourId === tour.id && (
                              <span className="text-sky-500 text-sm font-bold">✓</span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-3">
                        {region ? `${region} 지역에 등록된 코스가 아직 없어요` : "지역을 먼저 선택해주세요"}
                      </p>
                    )}
                    {CAFE_TOURS.filter((t) => region && t.region !== region).length > 0 && (
                      <details className="text-xs text-gray-400">
                        <summary className="cursor-pointer hover:text-gray-500">다른 지역 코스 보기</summary>
                        <div className="space-y-2 mt-2">
                          {CAFE_TOURS.filter((t) => region && t.region !== region).map((tour) => (
                            <button key={tour.id} onClick={() => {
                              setSelectedTourId(tour.id);
                              const startH = parseInt(time?.split(":")[0] || "10");
                              const newSchedule: ScheduleItem[] = tour.cafes.map((cafe, idx) => {
                                const h = startH + Math.floor(idx * 0.7);
                                const m = Math.round((idx * 0.7 % 1) * 60);
                                return {
                                  time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
                                  place: cafe.name,
                                  memo: `${cafe.specialty} · 약 ${cafe.stayMin}분${cafe.note ? ` · ${cafe.note}` : ""}`,
                                };
                              });
                              setSchedule(newSchedule);
                            }}
                              className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                                selectedTourId === tour.id ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-gray-300"
                              }`}>
                              <div className="flex items-center gap-2">
                                <span>{tour.image}</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{tour.title}</p>
                                  <p className="text-[10px] text-gray-400">
                                    {tour.region} · ⭐ {tour.rating} · {tour.cafes.length}곳
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* 동의 + 안전 가이드 + 제출 */}
        <div className="space-y-4">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/terms`} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">이용약관</a> 및{" "}
              <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/privacy`} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">개인정보처리방침</a>에 동의합니다 (만 14세 이상)
            </span>
          </label>

          <div className="bg-white rounded-2xl border border-gray-100">
            <button
              type="button"
              onClick={() => setShowSafetyGuide(!showSafetyGuide)}
              className="w-full px-5 py-3 flex items-center justify-between text-left"
            >
              <span className="text-sm font-medium text-gray-700">🛡️ 파티장 안전 가이드</span>
              <span className="text-gray-400 text-xs">{showSafetyGuide ? "접기" : "펼치기"}</span>
            </button>
            {showSafetyGuide && (
              <div className="px-5 pb-4 space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <p className="text-xs text-gray-600">집합 장소는 <strong>공개된 장소</strong>(카페, 공원, 주차장)로 설정하세요</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <p className="text-xs text-gray-600">참여자 <strong>연락처를 사전에 확인</strong>하고 비상 연락망을 공유하세요</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <p className="text-xs text-gray-600">렌터카 동승 시 <strong>보험 가입 여부</strong>를 미리 확인하세요</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <p className="text-xs text-gray-600">파티 정보를 주변에 공유하고, <strong>긴급 상황 대비 계획</strong>을 세워두세요</p>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleSubmit}
            disabled={!title || !category || !date || !region || !hostName || !consentChecked}
            className="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-2xl hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-200">
            🎉 파티 만들기
          </button>
        </div>
      </main>

      {/* 본인인증 모달 */}
      {showPhoneVerify && (
        <PhoneVerify
          onVerified={() => {
            setShowPhoneVerify(false);
            setSubmitted(true);
          }}
          onClose={() => setShowPhoneVerify(false)}
        />
      )}
    </div>
  );
}
