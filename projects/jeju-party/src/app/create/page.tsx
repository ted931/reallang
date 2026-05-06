"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { HOBBY_CATEGORIES, REGIONS, type ScheduleItem } from "@/lib/types";
import { CAFE_TOURS } from "@/lib/dummy-cafe-tours";
const RouteMap = lazy(() => import("@/components/route-map"));
import { CARS, RENTAL_STATIONS, CATEGORY_CAR_MAP } from "@/lib/car-data";
import PhoneVerify, { usePhoneVerified } from "@/components/phone-verify";

function getInitParam(key: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

// ── 디자인 토큰 ─────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white";

const inputOrangeCls =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white";

const inputTealCls =
  "w-full px-3.5 py-2.5 border border-teal-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all bg-white";

// ── 공통 섹션 래퍼 ───────────────────────────────────────────
function FormSection({
  num,
  title,
  hint,
  accent = "blue",
  children,
}: {
  num: string;
  title: string;
  hint?: string;
  accent?: "orange" | "blue" | "teal";
  children: React.ReactNode;
}) {
  const accentMap = {
    orange: { badge: "bg-orange-50 text-orange-600", dot: "" },
    blue: { badge: "bg-blue-50 text-blue-600", dot: "" },
    teal: { badge: "bg-teal-50 text-teal-600", dot: "" },
  };
  const a = accentMap[accent];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div
          className={`w-8 h-8 rounded-lg ${a.badge} grid place-items-center font-extrabold text-sm shrink-0`}
        >
          {num}
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-sm">{title}</p>
          {hint && <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── 필드 래퍼 ────────────────────────────────────────────────
function Field({
  label,
  required,
  hint,
  accent = "blue",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  accent?: "orange" | "blue" | "teal";
  children: React.ReactNode;
}) {
  const starColor =
    accent === "orange"
      ? "text-orange-500"
      : accent === "teal"
      ? "text-teal-500"
      : "text-blue-500";
  return (
    <div>
      <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
        {label}
        {required && <span className={starColor}>*</span>}
      </label>
      {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

// ── 스테퍼 버튼 ──────────────────────────────────────────────
function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50 text-slate-600 font-bold transition-colors"
      >
        −
      </button>
      <span className="flex-1 text-center font-extrabold text-lg tabular-nums text-slate-900">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50 text-slate-600 font-bold transition-colors"
      >
        +
      </button>
    </div>
  );
}

export default function CreatePartyPage() {
  // ── 모든 기존 state 100% 유지 ───────────────────────────────
  const [partyType, setPartyType] = useState<"individual" | "commercial" | "stay">(
    () => {
      const t = getInitParam("type");
      if (t === "commercial") return "commercial";
      if (t === "stay") return "stay";
      return "individual";
    }
  );
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [minMembers, setMinMembers] = useState(2);
  const [costType, setCostType] = useState<"split" | "free" | "fixed">("split");
  const [costAmount, setCostAmount] = useState("");
  const [pricePerSeat, setPricePerSeat] = useState("");
  const [depositRate, setDepositRate] = useState(100);
  const [operatorName, setOperatorName] = useState("");
  const [operatorContact, setOperatorContact] = useState("");
  const [operatorVerified, setOperatorVerified] = useState(false);
  const [includedItems, setIncludedItems] = useState<string[]>([""]);
  const [excludedItems, setExcludedItems] = useState<string[]>([""]);
  const [refundPolicy, setRefundPolicy] = useState("");
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
  // 장기체류 동행 전용 state
  const [hostStayDays, setHostStayDays] = useState<number>(30);
  const [hostStayRegion, setHostStayRegion] = useState("");
  const [guestCanStayOver, setGuestCanStayOver] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [petTypes, setPetTypes] = useState<string[]>([]);
  const [petRules, setPetRules] = useState("");
  const [hostLocalTips, setHostLocalTips] = useState<string[]>([""]);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [showSafetyGuide, setShowSafetyGuide] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [selectedStopSlugs, setSelectedStopSlugs] = useState<string[]>([]);
  const [allShops, setAllShops] = useState<{ id: string; name: string; slug: string; category: string; address: string }[]>([]);
  const [shopSearch, setShopSearch] = useState("");
  const phoneVerified = usePhoneVerified();

  useEffect(() => {
    fetch("http://localhost:3001/api/shops")
      .then((r) => r.json())
      .then((data) => {
        setAllShops((data.shops || []).filter((s: { isPublished: boolean }) => s.isPublished));
      })
      .catch(() => {});
  }, []);

  // ── 스케줄 로직 100% 유지 ──────────────────────────────────
  const addScheduleItem = () => {
    const lastTime = schedule.length > 0 ? schedule[schedule.length - 1].time : time || "10:00";
    const [h, m] = lastTime.split(":").map(Number);
    const nextH = String(h + 1).padStart(2, "0");
    setSchedule([...schedule, { time: `${nextH}:${m === 0 ? "00" : String(m).padStart(2, "0")}`, place: "", memo: "" }]);
  };

  const updateScheduleItem = (idx: number, field: keyof ScheduleItem, value: string) => {
    const updated = [...schedule];
    if (field === "time") {
      const toMin = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };
      const toStr = (min: number) => {
        const total = ((min % 1440) + 1440) % 1440;
        return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
      };
      const delta = toMin(value) - toMin(updated[idx].time);
      updated[idx] = { ...updated[idx], time: value };
      for (let i = idx + 1; i < updated.length; i++) {
        updated[i] = { ...updated[i], time: toStr(toMin(updated[i].time) + delta) };
      }
    } else {
      updated[idx] = { ...updated[idx], [field]: value };
    }
    setSchedule(updated);
  };

  const removeScheduleItem = (idx: number) => {
    setSchedule(schedule.filter((_, i) => i !== idx));
  };

  const handleAiSchedule = async () => {
    if (!region) return;
    setAiLoading(true);
    try {
      const catLabel =
        category === "other"
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
    } catch {
      /* ignore */
    }
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

  // ── 제출 완료 화면 ──────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-sm w-full">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">파티가 만들어졌어요!</h2>
          <p className="text-sm text-slate-500 mb-6">파티원들이 참여 신청을 보낼 거예요</p>
          <a
            href={process.env.NEXT_PUBLIC_BASE_PATH || "/"}
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
          >
            파티 목록 보기
          </a>
        </div>
      </div>
    );
  }

  // ── 색상 토큰 (partyType 기반) ───────────────────────────────
  const accent =
    partyType === "commercial" ? "blue" : partyType === "stay" ? "teal" : "orange";
  const accentInputCls =
    partyType === "commercial"
      ? inputCls
      : partyType === "stay"
      ? inputTealCls
      : inputOrangeCls;

  const submitBtnCls =
    partyType === "commercial"
      ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200/60"
      : partyType === "stay"
      ? "bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-200/60"
      : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200/60";

  const regionActiveCls =
    partyType === "commercial"
      ? "bg-blue-600 text-white"
      : partyType === "stay"
      ? "bg-teal-600 text-white"
      : "bg-slate-800 text-white";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── 헤더 ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href={process.env.NEXT_PUBLIC_BASE_PATH || "/"}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              ← 목록
            </a>
            <span className="text-slate-300">/</span>
            <h1 className="text-base font-extrabold text-slate-900">새 파티 만들기</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
              임시저장
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-6 pb-32 space-y-5">
        {/* ── 파티 타입 세그먼트 컨트롤 ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex gap-1.5">
          <button
            onClick={() => setPartyType("individual")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              partyType === "individual"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            👤 개인 파티
          </button>
          <button
            onClick={() => setPartyType("commercial")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              partyType === "commercial"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            🏢 사업자 파티
          </button>
          <button
            onClick={() => setPartyType("stay")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              partyType === "stay"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            🏠 장기체류 동행
          </button>
        </div>

        {/* ── 사업자 정보 (commercial 전용) ─────────────────────── */}
        {partyType === "commercial" && (
          <FormSection num="★" title="사업자 정보" hint="사업자 파티 등록 필수 항목" accent="blue">
            <Field label="업체명" required accent="blue">
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="예: 제주 서핑 스쿨"
                className={inputCls}
              />
            </Field>
            <Field label="연락처" required accent="blue">
              <input
                type="tel"
                value={operatorContact}
                onChange={(e) => setOperatorContact(e.target.value)}
                placeholder="예: 064-000-0000"
                className={inputCls}
              />
            </Field>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={operatorVerified}
                onChange={(e) => setOperatorVerified(e.target.checked)}
                className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-400"
              />
              <span className="text-sm text-blue-700 font-medium">사업자 등록 인증 완료</span>
              {operatorVerified && (
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                  인증됨
                </span>
              )}
            </label>
          </FormSection>
        )}

        {/* ── 장기체류 동행 전용 섹션 ───────────────────────────── */}
        {partyType === "stay" && (
          <>
            <FormSection num="★" title="체류 정보" accent="teal">
              <Field label="체류 기간" accent="teal">
                <div className="flex gap-2 flex-wrap">
                  {([7, 14, 30] as const).map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setHostStayDays(days)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        hostStayDays === days
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-white border border-teal-200 text-teal-700 hover:bg-teal-50"
                      }`}
                    >
                      {days === 7 ? "7일" : days === 14 ? "14일" : "1개월"}
                    </button>
                  ))}
                  <input
                    type="number"
                    value={hostStayDays}
                    onChange={(e) => setHostStayDays(Number(e.target.value))}
                    min={1}
                    placeholder="직접입력"
                    className="w-24 px-3 py-2 rounded-xl border border-teal-200 bg-white text-sm focus:border-teal-400 outline-none"
                  />
                </div>
              </Field>
              <Field label="체류 지역" accent="teal">
                <input
                  type="text"
                  value={hostStayRegion}
                  onChange={(e) => setHostStayRegion(e.target.value)}
                  placeholder="예: 제주시 애월읍"
                  className={inputTealCls}
                />
              </Field>
              <Field label="숙박 가능" accent="teal">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="guestStayOver"
                      checked={guestCanStayOver}
                      onChange={() => setGuestCanStayOver(true)}
                      className="w-4 h-4 text-teal-600 border-teal-300 focus:ring-teal-400"
                    />
                    <span className="text-sm text-slate-700">가능 (소파/게스트룸)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="guestStayOver"
                      checked={!guestCanStayOver}
                      onChange={() => setGuestCanStayOver(false)}
                      className="w-4 h-4 text-teal-600 border-teal-300 focus:ring-teal-400"
                    />
                    <span className="text-sm text-slate-700">당일 동행만</span>
                  </label>
                </div>
              </Field>
            </FormSection>

            <FormSection num="🐶" title="반려동물" accent="teal">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={petFriendly}
                  onChange={(e) => setPetFriendly(e.target.checked)}
                  className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-400"
                />
                <span className="text-sm text-slate-700 font-medium">반려동물 동반 가능</span>
              </label>
              {petFriendly && (
                <>
                  <Field label="종류" accent="teal">
                    <div className="flex gap-2">
                      {["강아지", "고양이", "기타"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            if (petTypes.includes(type)) {
                              setPetTypes(petTypes.filter((t) => t !== type));
                            } else {
                              setPetTypes([...petTypes, type]);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            petTypes.includes(type)
                              ? "bg-teal-600 text-white shadow-sm"
                              : "bg-white border border-teal-200 text-teal-700 hover:bg-teal-50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="안내사항" accent="teal">
                    <input
                      type="text"
                      value={petRules}
                      onChange={(e) => setPetRules(e.target.value)}
                      placeholder="예: 소형견만 가능, 백신 필수"
                      className={inputTealCls}
                    />
                  </Field>
                </>
              )}
            </FormSection>

            <FormSection num="💡" title="현지 꿀팁" hint="내가 알고 있는 로컬 정보를 공유하세요 (선택)" accent="teal">
              {hostLocalTips.map((tip, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => {
                      const updated = [...hostLocalTips];
                      updated[idx] = e.target.value;
                      setHostLocalTips(updated);
                    }}
                    placeholder="예: 애월 숨겨진 해변 주차 꿀팁"
                    className={inputTealCls + " flex-1"}
                  />
                  {hostLocalTips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setHostLocalTips(hostLocalTips.filter((_, i) => i !== idx))}
                      className="text-slate-300 hover:text-red-400 text-sm px-1 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setHostLocalTips([...hostLocalTips, ""])}
                className="text-xs text-teal-500 hover:text-teal-600 font-medium"
              >
                + 추가
              </button>
            </FormSection>
          </>
        )}

        {/* ── 섹션 1: 파티장 정보 ────────────────────────────────── */}
        <FormSection num="1" title="파티장 정보" hint="파티를 대표하는 닉네임과 소개" accent={accent}>
          <Field label="파티장 닉네임" required accent={accent}>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="예: 라이더김"
              className={accentInputCls}
            />
          </Field>
          <Field label="한줄 소개" accent={accent}>
            <input
              type="text"
              value={hostBio}
              onChange={(e) => setHostBio(e.target.value)}
              placeholder="예: 제주 3년차 로컬, 서핑 강사 자격증 보유"
              className={accentInputCls}
            />
          </Field>
        </FormSection>

        {/* ── 섹션 2: 기본 정보 ──────────────────────────────────── */}
        <FormSection num="2" title="기본 정보" hint="파티 카드에 노출되는 핵심 정보" accent={accent}>
          <Field label="어떤 취미?" required accent={accent}>
            <div className="flex flex-wrap gap-2">
              {HOBBY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    category === cat.id
                      ? partyType === "commercial"
                        ? "bg-blue-600 text-white shadow-sm"
                        : partyType === "stay"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            {category === "other" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="취미를 직접 입력해주세요 (예: 보드게임, 요가, 독서모임)"
                className={accentInputCls + " mt-2"}
              />
            )}
          </Field>
          <Field label="파티 제목" required hint="50자 이내, 이모지 사용 가능" accent={accent}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 애월 해안도로 자전거 라이딩"
              className={accentInputCls}
            />
          </Field>
          <Field label="파티 소개" required hint="500자 이내" accent={accent}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="어떤 코스로 가는지, 뭘 준비해야 하는지, 끝나고 뭘 할 건지 등등 자유롭게!"
              rows={4}
              className={accentInputCls + " resize-none"}
            />
            <p className="text-[10px] text-slate-400 font-mono mt-1 text-right">
              {description.length}/500
            </p>
          </Field>
        </FormSection>

        {/* ── 섹션 3: 일정 & 장소 ────────────────────────────────── */}
        <FormSection num="3" title="일정 & 장소" accent={accent}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="날짜" required accent={accent}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={accentInputCls}
              />
            </Field>
            <Field label="시간" required accent={accent}>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={accentInputCls}
              />
            </Field>
          </div>

          <Field label="지역" required accent={accent}>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    region === r ? regionActiveCls : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </Field>

          <Field label="집합 장소" required accent={accent}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 애월항 주차장"
              className={accentInputCls}
            />
            {/집|숙소|에어비앤비|게스트하우스|모텔|호텔 방/.test(location) && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                <span className="text-sm mt-0.5">⚠️</span>
                <p className="text-xs text-amber-700">
                  공개된 장소(카페, 공원, 주차장 등)에서 만나는 것을 권장합니다
                </p>
              </div>
            )}
          </Field>
        </FormSection>

        {/* ── 섹션 4: 일정 타임라인 ────────────────────────────── */}
        <FormSection num="4" title="일정 타임라인" hint="선택 사항 — 파티원이 더 쉽게 이해할 수 있어요" accent={accent}>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              {category && region && (
                <button
                  type="button"
                  onClick={handleAiSchedule}
                  disabled={aiLoading}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 disabled:opacity-50 transition-colors"
                >
                  {aiLoading ? "생성 중..." : "✨ AI 자동"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowRouteMap((v) => !v)}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all ${
                  showRouteMap
                    ? "bg-indigo-500 text-white"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                🗺️ 지도로 짜기
              </button>
              <button
                type="button"
                onClick={addScheduleItem}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                + 직접 추가
              </button>
            </div>
          </div>

          {showRouteMap && (
            <div className="border border-indigo-100 rounded-2xl p-4 bg-indigo-50/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-slate-800">🗺️ 코스 지도 플래너</span>
                <span className="text-[10px] text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">
                  지도 클릭 or 검색으로 경유지 추가
                </span>
              </div>
              <Suspense
                fallback={
                  <div className="h-[300px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-sm text-slate-400">
                    지도 불러오는 중...
                  </div>
                }
              >
                <RouteMap
                  startTime={time || "10:00"}
                  defaultMode={
                    rentalCarMode !== "none"
                      ? "driving"
                      : category === "cycling"
                      ? "cycling"
                      : "walking"
                  }
                  onApply={(items) => {
                    setSchedule(items);
                    setShowRouteMap(false);
                  }}
                />
              </Suspense>
            </div>
          )}

          {schedule.length === 0 ? (
            <div className="text-center py-8 text-slate-300">
              <p className="text-sm">일정을 추가하면 파티원들이 더 쉽게 이해할 수 있어요</p>
              <p className="text-xs mt-1">대충 적어도 OK, 상세하게 적어도 OK</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start group">
                  <div className="flex flex-col items-center pt-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        partyType === "commercial"
                          ? "bg-blue-400"
                          : partyType === "stay"
                          ? "bg-teal-400"
                          : "bg-orange-400"
                      }`}
                    />
                    {idx < schedule.length - 1 && (
                      <div
                        className={`w-px min-h-[40px] h-full ${
                          partyType === "commercial"
                            ? "bg-blue-100"
                            : partyType === "stay"
                            ? "bg-teal-100"
                            : "bg-orange-100"
                        }`}
                      />
                    )}
                  </div>
                  <input
                    type="time"
                    value={item.time}
                    onChange={(e) => updateScheduleItem(idx, "time", e.target.value)}
                    className="w-[110px] px-2 py-2 rounded-lg border border-slate-200 text-xs font-mono focus:border-orange-400 outline-none flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={item.place}
                      onChange={(e) => updateScheduleItem(idx, "place", e.target.value)}
                      placeholder="장소"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-orange-400 outline-none"
                    />
                    <input
                      type="text"
                      value={item.memo || ""}
                      onChange={(e) => updateScheduleItem(idx, "memo", e.target.value)}
                      placeholder="메모 (선택)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-100 text-xs text-slate-500 focus:border-orange-300 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeScheduleItem(idx)}
                    className="text-slate-300 hover:text-red-400 text-sm pt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addScheduleItem}
                className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 hover:text-orange-500 hover:border-orange-300 transition-colors"
              >
                + 일정 추가
              </button>
            </div>
          )}
        </FormSection>

        {/* ── 섹션 5: 인원 & 비용 ────────────────────────────────── */}
        <FormSection num="5" title="인원 & 비용" accent={accent}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="최소 인원" required hint="미달 시 자동 취소" accent={accent}>
              <Stepper
                value={minMembers}
                min={2}
                max={maxMembers}
                onChange={(v) => setMinMembers(v)}
              />
            </Field>
            <Field label="최대 인원" required accent={accent}>
              <Stepper
                value={maxMembers}
                min={minMembers}
                max={20}
                onChange={(v) => setMaxMembers(v)}
              />
            </Field>
          </div>

          <Field label="비용 유형" accent={accent}>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["split", "엔빵"],
                  ["free", "무료"],
                  ["fixed", "정해진 금액"],
                  ["split-cafe", "엔빵 + 카페패스"],
                  ["free-cafe", "무료 + 카페패스"],
                ] as const
              ).map(([val, label]) => {
                const isActive = val.includes("cafe")
                  ? costType === val.replace("-cafe", "") && cafePassEnabled
                  : costType === val && !cafePassEnabled;
                const isCafe = val.includes("cafe");
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      const base = val.replace("-cafe", "") as "split" | "free" | "fixed";
                      setCostType(base);
                      setCafePassEnabled(isCafe);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? isCafe
                          ? "bg-sky-500 text-white shadow-sm"
                          : "bg-orange-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {costType !== "free" && (
              <input
                type="number"
                value={costAmount}
                onChange={(e) => setCostAmount(e.target.value)}
                placeholder={costType === "split" ? "인당 예상 금액 (원)" : "참가비 (원)"}
                className={accentInputCls + " mt-2"}
              />
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
            {rentalCarMode === "rent-together" &&
              selectedCarId &&
              (() => {
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
          </Field>
        </FormSection>

        {/* ── 사업자 파티 가격 & 예약 설정 ─────────────────────── */}
        {partyType === "commercial" && (
          <FormSection num="6" title="가격 & 예약 설정" hint="플랫폼 수수료 12% 자동 적용" accent="blue">
            <div className="grid grid-cols-2 gap-3">
              <Field label="1인 참가비 (원)" required accent="blue">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    ₩
                  </span>
                  <input
                    type="number"
                    value={pricePerSeat}
                    onChange={(e) => setPricePerSeat(e.target.value)}
                    placeholder="65000"
                    className={inputCls + " pl-8 tabular-nums font-bold"}
                  />
                </div>
              </Field>
              <Field label="최소 인원 (명)" hint="미달 시 자동 취소" accent="blue">
                <input
                  type="number"
                  value={minMembers}
                  onChange={(e) => setMinMembers(Number(e.target.value))}
                  min={1}
                  max={maxMembers}
                  className={inputCls}
                />
              </Field>
            </div>

            {pricePerSeat && Number(pricePerSeat) > 0 && (
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">예상 매출 (만석)</span>
                  <span className="font-bold tabular-nums">
                    ₩{(Number(pricePerSeat) * maxMembers).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">수수료 (12%)</span>
                  <span className="text-rose-500 tabular-nums">
                    −₩{Math.floor(Number(pricePerSeat) * maxMembers * 0.12).toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2 flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">정산 예정</span>
                  <span className="font-extrabold text-emerald-600 tabular-nums">
                    ₩{Math.floor(Number(pricePerSeat) * maxMembers * 0.88).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <Field label="선입금 비율" accent="blue">
              <div className="flex gap-2">
                {[30, 50, 100].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setDepositRate(rate)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      depositRate === rate
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </Field>

            <div className="space-y-3">
              <Field label="포함 사항" accent="blue">
                {includedItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-1.5">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...includedItems];
                        updated[idx] = e.target.value;
                        setIncludedItems(updated);
                      }}
                      placeholder="예: 장비 대여, 강습비, 보험"
                      className={inputCls + " flex-1"}
                    />
                    {includedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setIncludedItems(includedItems.filter((_, i) => i !== idx))}
                        className="text-slate-300 hover:text-red-400 text-sm px-1 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setIncludedItems([...includedItems, ""])}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                >
                  + 항목 추가
                </button>
              </Field>

              <Field label="불포함 사항" accent="blue">
                {excludedItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-1.5">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...excludedItems];
                        updated[idx] = e.target.value;
                        setExcludedItems(updated);
                      }}
                      placeholder="예: 개인 음료, 교통비"
                      className={inputCls + " flex-1"}
                    />
                    {excludedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setExcludedItems(excludedItems.filter((_, i) => i !== idx))}
                        className="text-slate-300 hover:text-red-400 text-sm px-1 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setExcludedItems([...excludedItems, ""])}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                >
                  + 항목 추가
                </button>
              </Field>

              <Field label="환불 정책" accent="blue">
                <div className="space-y-2">
                  {[
                    { label: "표준 정책 (7일전 100% / 3일전 50% / 당일 0%)", val: "standard" },
                    { label: "엄격한 정책 (7일전 100% / 그 이후 0%)", val: "strict" },
                    { label: "유연한 정책 (24시간전 100%)", val: "flexible" },
                  ].map((p) => (
                    <label
                      key={p.val}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        refundPolicy === p.val
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${
                          refundPolicy === p.val
                            ? "bg-blue-500 border-blue-500"
                            : "border-slate-300"
                        }`}
                      >
                        {refundPolicy === p.val && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <input
                        type="radio"
                        name="refundPolicy"
                        value={p.val}
                        checked={refundPolicy === p.val}
                        onChange={() => setRefundPolicy(p.val)}
                        className="sr-only"
                      />
                      <span className="text-sm text-slate-700">{p.label}</span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          </FormSection>
        )}

        {/* ── 섹션 7: 이동 수단 & 장비 ────────────────────────────── */}
        <FormSection num={partyType === "commercial" ? "7" : "6"} title="이동 수단 & 장비" accent={accent}>
          <Field label="이동 수단" accent={accent}>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["none", "각자 이동", "🚶"],
                  ["own-car", "내 차로", "🚘"],
                  ["rent-together", "같이 빌려요", "🤝"],
                ] as const
              ).map(([val, label, emoji]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setRentalCarMode(val);
                    if (val !== "rent-together") setSelectedCarId("");
                  }}
                  className={`py-3 rounded-xl text-sm font-bold transition-all text-center ${
                    rentalCarMode === val
                      ? partyType === "commercial"
                        ? "bg-blue-600 text-white shadow-sm"
                        : partyType === "stay"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="block text-lg mb-0.5">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>

            {rentalCarMode === "own-car" && (
              <input
                type="text"
                value={carInfo}
                onChange={(e) => setCarInfo(e.target.value)}
                placeholder="차종 (예: 카니발 9인승)"
                className={accentInputCls + " mt-2"}
              />
            )}

            {rentalCarMode === "rent-together" && (
              <a
                href="http://localhost:3001/rentcar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors mt-2"
              >
                <div>
                  <p className="text-sm font-bold text-blue-700">🚗 제주패스 렌터카에서 예약 가능</p>
                  <p className="text-[11px] text-blue-500 mt-0.5">최저가 보장 · 풀커버 보험 · 제주 전 지점</p>
                </div>
                <span className="text-blue-400 text-sm font-bold">예약 →</span>
              </a>
            )}

            {rentalCarMode === "rent-together" &&
              (() => {
                const recommended = CATEGORY_CAR_MAP[category] || [];
                const selectedCar = CARS.find((c) => c.id === selectedCarId);
                const perPerson = selectedCar
                  ? Math.ceil(selectedCar.pricePerDay / maxMembers)
                  : 0;
                return (
                  <div className="space-y-3 mt-2">
                    <p className="text-xs text-slate-500">
                      차량을 선택하세요{" "}
                      {recommended.length > 0 && (
                        <span className="text-orange-500">(추천 표시)</span>
                      )}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {CARS.map((car) => {
                        const isRecommended = recommended.includes(car.id);
                        const isDisabled = car.seats < maxMembers;
                        const isSelected = selectedCarId === car.id;
                        return (
                          <button
                            key={car.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setSelectedCarId(isSelected ? "" : car.id)}
                            className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? "border-orange-500 bg-orange-50"
                                : isDisabled
                                ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {isRecommended && !isDisabled && (
                              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full">
                                추천
                              </span>
                            )}
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-base">{car.image}</span>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {car.name}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 space-y-0.5">
                              <p>
                                {car.seats}인승 · {car.trunkCapacity}
                              </p>
                              <p className="font-medium text-slate-700">
                                {car.pricePerDay.toLocaleString()}원/일
                              </p>
                              <p className="text-orange-600 font-bold">
                                엔빵 {Math.ceil(car.pricePerDay / maxMembers).toLocaleString()}원/인
                              </p>
                            </div>
                            {isDisabled && (
                              <p className="text-[9px] text-red-400 mt-1">
                                좌석 부족 ({car.seats}석 &lt; {maxMembers}명)
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedCar && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">
                              픽업 장소
                            </label>
                            <select
                              value={rentalPickup}
                              onChange={(e) => setRentalPickup(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-400 outline-none bg-white"
                            >
                              {RENTAL_STATIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">
                              반납 장소
                            </label>
                            <select
                              value={rentalReturn}
                              onChange={(e) => setRentalReturn(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-400 outline-none bg-white"
                            >
                              {RENTAL_STATIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-orange-700">
                              {selectedCar.name} · 1일
                            </span>
                            <span className="text-sm font-bold text-orange-700">
                              {selectedCar.pricePerDay.toLocaleString()}원
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-orange-600">엔빵 ({maxMembers}명)</span>
                            <span className="text-sm font-bold text-orange-600">
                              {perPerson.toLocaleString()}원/인
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
          </Field>

          <Field label="필요한 장비/준비물" hint="선택 사항" accent={accent}>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="예: 자전거, 등산화, 수영복 등"
              className={accentInputCls}
            />
          </Field>
        </FormSection>

        {/* ── 경유 가게 선택 ─────────────────────────────────────── */}
        <FormSection
          num={partyType === "commercial" ? "8" : "7"}
          title="경유 가게"
          hint="제주패스 등록 가게를 경유지로 추가해보세요 (선택)"
          accent={accent}
        >
          {selectedStopSlugs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedStopSlugs.map((slug) => {
                const shop = allShops.find((s) => s.slug === slug);
                return (
                  <span
                    key={slug}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-full text-orange-700 font-medium"
                  >
                    ⭐ {shop?.name || slug}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedStopSlugs(selectedStopSlugs.filter((s) => s !== slug))
                      }
                      className="text-orange-400 hover:text-orange-600 ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder="가게 이름으로 검색..."
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-orange-400 outline-none bg-slate-50"
            />
            <span className="absolute left-2.5 top-3 text-slate-400 text-xs">🔍</span>
          </div>

          {allShops.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-3">
              제주패스 서버에 연결 중...
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {allShops
                .filter(
                  (s) =>
                    !shopSearch ||
                    s.name.includes(shopSearch) ||
                    s.address.includes(shopSearch)
                )
                .slice(0, 8)
                .map((shop) => {
                  const isSelected = selectedStopSlugs.includes(shop.slug);
                  return (
                    <button
                      key={shop.slug}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedStopSlugs(
                            selectedStopSlugs.filter((s) => s !== shop.slug)
                          );
                        } else {
                          setSelectedStopSlugs([...selectedStopSlugs, shop.slug]);
                        }
                      }}
                      className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-orange-300 bg-orange-50"
                          : "border-slate-100 hover:border-orange-200 bg-white"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[10px] shrink-0 ${
                          isSelected
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && "✓"}
                      </span>
                      <span className="text-sm font-medium text-slate-900 flex-1 truncate">
                        {shop.name}
                      </span>
                      <span className="text-[10px] text-orange-500 shrink-0">⭐ 제주패스</span>
                    </button>
                  );
                })}
            </div>
          )}
        </FormSection>

        {/* ── 카페패스 추천 ─────────────────────────────────────── */}
        <div
          className={`rounded-2xl border p-5 shadow-sm transition-all ${
            cafePassEnabled ? "bg-sky-50/50 border-sky-200" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">☕</span>
              <div>
                <span className="text-sm font-bold text-slate-700">카페패스 추천</span>
                {!cafePassEnabled && (
                  <p className="text-[11px] text-slate-400 mt-0.5">제휴 카페 50곳+ · 3일 14,900원~</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCafePassEnabled(!cafePassEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                cafePassEnabled ? "bg-sky-500" : "bg-slate-300"
              }`}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: cafePassEnabled ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          </div>

          {cafePassEnabled && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-xl p-3 border border-sky-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-sky-500">무제한</span>
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[8px] font-bold rounded">
                      인기
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">3시간마다 1잔 무료</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-slate-900">14,900</span>
                    <span className="text-[10px] text-slate-400">원/3일</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">5일 19,900원</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-amber-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-500">잔 이용권</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">30일 내 자유 사용</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-slate-900">9,900</span>
                    <span className="text-[10px] text-slate-400">원/3잔</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">5잔 15,500원 (잔당 3,100원)</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-500">추천 멘트</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "카페패스 있으면 음료 거의 공짜!",
                    "중간에 카페 들를 때 패스 쓰면 좋아요",
                    "저도 패스 쓸 예정이에요 같이 써요!",
                    "카페 투어할 건데 패스 필수!",
                    "쉬는 시간에 커피 한잔 어때요?",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCafePassNote(cafePassNote === preset ? "" : preset)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                        cafePassNote === preset
                          ? "bg-sky-500 text-white font-medium"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-sky-300"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={cafePassNote}
                  onChange={(e) => setCafePassNote(e.target.value)}
                  placeholder="직접 입력도 가능해요"
                  className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white text-sm focus:border-sky-400 outline-none placeholder:text-slate-400"
                />
              </div>

              {category === "cafe" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">
                    카페투어 코스 (선택)
                  </label>
                  <div className="space-y-2">
                    {CAFE_TOURS.filter((t) => !region || t.region === region).length > 0 ? (
                      CAFE_TOURS.filter((t) => !region || t.region === region).map((tour) => (
                        <button
                          key={tour.id}
                          type="button"
                          onClick={() => {
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
                            selectedTourId === tour.id
                              ? "border-sky-500 bg-sky-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{tour.image}</span>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{tour.title}</p>
                                <p className="text-[10px] text-slate-400">
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
                      <p className="text-xs text-slate-400 text-center py-3">
                        {region
                          ? `${region} 지역에 등록된 코스가 아직 없어요`
                          : "지역을 먼저 선택해주세요"}
                      </p>
                    )}
                    {CAFE_TOURS.filter((t) => region && t.region !== region).length > 0 && (
                      <details className="text-xs text-slate-400">
                        <summary className="cursor-pointer hover:text-slate-500">
                          다른 지역 코스 보기
                        </summary>
                        <div className="space-y-2 mt-2">
                          {CAFE_TOURS.filter((t) => region && t.region !== region).map((tour) => (
                            <button
                              key={tour.id}
                              type="button"
                              onClick={() => {
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
                                selectedTourId === tour.id
                                  ? "border-sky-500 bg-sky-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{tour.image}</span>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{tour.title}</p>
                                  <p className="text-[10px] text-slate-400">
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

        {/* ── 동의 + 안전 가이드 ────────────────────────────────── */}
        <div className="space-y-4">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
            />
            <span className="text-xs text-slate-500 leading-relaxed">
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/terms`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline"
              >
                이용약관
              </a>{" "}
              및{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline"
              >
                개인정보처리방침
              </a>
              에 동의합니다 (만 14세 이상)
            </span>
          </label>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSafetyGuide(!showSafetyGuide)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left"
            >
              <span className="text-sm font-bold text-slate-700">🛡️ 파티장 안전 가이드</span>
              <span className="text-slate-400 text-xs font-medium">
                {showSafetyGuide ? "접기" : "펼치기"}
              </span>
            </button>
            {showSafetyGuide && (
              <div className="px-5 pb-4 space-y-2.5 border-t border-slate-100 pt-3">
                {[
                  <>집합 장소는 <strong>공개된 장소</strong>(카페, 공원, 주차장)로 설정하세요</>,
                  <>참여자 <strong>연락처를 사전에 확인</strong>하고 비상 연락망을 공유하세요</>,
                  <>렌터카 동승 시 <strong>보험 가입 여부</strong>를 미리 확인하세요</>,
                  <>파티 정보를 주변에 공유하고, <strong>긴급 상황 대비 계획</strong>을 세워두세요</>,
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <p className="text-xs text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 법적 고지 */}
          <div className="text-[10px] text-slate-400 bg-slate-50 rounded-xl border border-slate-100 p-4 leading-relaxed">
            <p className="font-bold text-slate-500 mb-1.5">⚠️ 이용 전 확인해주세요</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>본 서비스는 개인 간 자유로운 동행·모임 연결 플랫폼입니다.</li>
              <li>
                숙소의 <strong>전대차(재임대)</strong>는 임대차보호법 위반 및 계약 위반이 될 수
                있습니다. 확인하지 않은 공간 공유는 금지합니다.
              </li>
              <li>
                사업자 파티의 경우 관광사업자 등록 여부를 직접 확인하시기 바랍니다.
              </li>
              <li>
                결제 분쟁, 개인 간 약속 불이행 등은 당사자 간 해결 사항입니다. jeju-party는
                중개 플랫폼으로서 책임을 지지 않습니다.
              </li>
              <li>불법 콘텐츠, 사기, 허위 게시물은 즉시 신고해주세요.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title || !category || !date || !region || !hostName || !consentChecked}
            className={`w-full py-4 font-extrabold text-base rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white ${submitBtnCls}`}
          >
            {partyType === "commercial"
              ? "🏢 사업자 파티 등록 →"
              : partyType === "stay"
              ? "🏠 장기체류 동행 등록 →"
              : "🎉 파티 만들기 →"}
          </button>
        </div>
      </main>

      {/* ── 사업자 파티 예상 수익 고정 바 ─────────────────────── */}
      {partyType === "commercial" && pricePerSeat && Number(pricePerSeat) > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-900 text-white px-6 py-3.5 flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-[10px] text-blue-300 mb-0.5 font-medium">예상 수익 (88% 정산)</p>
            <p className="text-sm font-bold tabular-nums">
              {maxMembers}명 × ₩{Number(pricePerSeat).toLocaleString()} × 88% ={" "}
              <span className="text-blue-200 text-base">
                ₩{Math.floor(maxMembers * Number(pricePerSeat) * 0.88).toLocaleString()}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-300 font-medium">수수료 12%</p>
            <p className="text-xs text-blue-400 tabular-nums">
              ₩{Math.floor(maxMembers * Number(pricePerSeat) * 0.12).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* ── 본인인증 모달 ───────────────────────────────────────── */}
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
