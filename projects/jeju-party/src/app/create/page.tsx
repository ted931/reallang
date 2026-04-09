"use client";

import { useState } from "react";
import { HOBBY_CATEGORIES, REGIONS, type ScheduleItem } from "@/lib/types";

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
  const [hasRentalCar, setHasRentalCar] = useState(false);
  const [carInfo, setCarInfo] = useState("");
  const [equipment, setEquipment] = useState("");
  const [hostName, setHostName] = useState("");
  const [hostBio, setHostBio] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

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
    if (!title || !category || !date || !region || !hostName) return;
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
            <div className="flex gap-2 mb-2">
              {([["split", "엔빵"], ["free", "무료"], ["fixed", "정해진 금액"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => setCostType(val)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${costType === val ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                  {label}
                </button>
              ))}
            </div>
            {costType !== "free" && (
              <input type="number" value={costAmount} onChange={(e) => setCostAmount(e.target.value)}
                placeholder={costType === "split" ? "인당 예상 금액 (원)" : "참가비 (원)"}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
            )}
          </div>
        </div>

        {/* 렌터카 + 장비 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">🚗 렌터카 있음 (동승 가능)</span>
            <button onClick={() => setHasRentalCar(!hasRentalCar)}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${hasRentalCar ? "bg-orange-500" : "bg-gray-300"}`}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: hasRentalCar ? "translateX(20px)" : "translateX(0)" }} />
            </button>
          </div>
          {hasRentalCar && (
            <input type="text" value={carInfo} onChange={(e) => setCarInfo(e.target.value)}
              placeholder="차종 (예: 카니발 9인승)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">필요한 장비/준비물 (선택)</label>
            <input type="text" value={equipment} onChange={(e) => setEquipment(e.target.value)}
              placeholder="예: 자전거, 등산화, 수영복 등" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
          </div>
        </div>

        {/* 제출 */}
        <button onClick={handleSubmit}
          disabled={!title || !category || !date || !region || !hostName}
          className="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-2xl hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-200">
          🎉 파티 만들기
        </button>
      </main>
    </div>
  );
}
