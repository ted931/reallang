"use client";

import { useState } from "react";
import { HOBBY_CATEGORIES, REGIONS } from "@/lib/types";

export default function CreatePartyPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
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
  const [submitted, setSubmitted] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiCourse, setAiCourse] = useState("");

  const handleAiCourse = async () => {
    if (!category || !region) return;
    setAiSuggesting(true);
    try {
      const catLabel = HOBBY_CATEGORIES.find((c) => c.id === category)?.label || category;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/parties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest_course",
          category: catLabel,
          region,
        }),
      });
      const data = await res.json();
      setAiCourse(data.suggestion || "");
      if (data.suggestion && !description) setDescription(data.suggestion);
    } catch { /* ignore */ }
    setAiSuggesting(false);
  };

  const handleSubmit = () => {
    if (!title || !category || !date || !region || !hostName) return;
    // TODO: Supabase INSERT
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-sm w-full">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">파티가 만들어졌어요!</h2>
          <p className="text-sm text-gray-500 mb-6">파티원들이 참여 신청을 보낼 거예요</p>
          <a
            href={process.env.NEXT_PUBLIC_BASE_PATH || "/"}
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm"
          >
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
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="예: 라이더김"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
          />
          <input
            type="text"
            value={hostBio}
            onChange={(e) => setHostBio(e.target.value)}
            placeholder="한줄 소개 (선택)"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
          />
        </div>

        {/* 취미 카테고리 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <label className="block text-sm font-bold text-gray-700 mb-2">어떤 취미?</label>
          <div className="flex flex-wrap gap-2">
            {HOBBY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat.id
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 + 설명 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">파티 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 애월 해안도로 자전거 라이딩"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">설명</label>
              {category && region && (
                <button
                  onClick={handleAiCourse}
                  disabled={aiSuggesting}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                >
                  {aiSuggesting ? "AI 추천 중..." : "✨ AI 코스 추천"}
                </button>
              )}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="어떤 코스로 가는지, 뭘 준비해야 하는지, 끝나고 뭘 할 건지 등등 자유롭게!"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
            />
          </div>
        </div>

        {/* 날짜/시간/지역/장소 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">지역</label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    region === r ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">집합 장소</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 애월항 주차장"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none"
            />
          </div>
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
                <button
                  key={val}
                  onClick={() => setCostType(val)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    costType === val ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {costType !== "free" && (
              <input
                type="number"
                value={costAmount}
                onChange={(e) => setCostAmount(e.target.value)}
                placeholder={costType === "split" ? "인당 예상 금액 (원)" : "참가비 (원)"}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none"
              />
            )}
          </div>
        </div>

        {/* 렌터카 + 장비 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">🚗 렌터카 있음 (동승 가능)</span>
            <button
              onClick={() => setHasRentalCar(!hasRentalCar)}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                hasRentalCar ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: hasRentalCar ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          </div>
          {hasRentalCar && (
            <input
              type="text"
              value={carInfo}
              onChange={(e) => setCarInfo(e.target.value)}
              placeholder="차종 (예: 카니발 9인승)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none"
            />
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">필요한 장비/준비물 (선택)</label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="예: 자전거, 등산화, 수영복 등"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none"
            />
          </div>
        </div>

        {/* 제출 */}
        <button
          onClick={handleSubmit}
          disabled={!title || !category || !date || !region || !hostName}
          className="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-2xl hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-200"
        >
          🎉 파티 만들기
        </button>
      </main>
    </div>
  );
}
