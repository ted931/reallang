"use client";

import { useState } from "react";
import { DevNav } from "@/components/dev-nav";

// ── 더미 데이터 ─────────────────────────────────────────────────────────────

const DUMMY_BIZ = {
  regNo: "123-45-67890",
  bizName: "협재 서핑 스쿨",
  ceo: "김민준",
  openDate: "2021.04.15",
  type: "일반과세자",
  category: "관광 안내업",
};

const BANK_LIST = [
  "국민은행", "신한은행", "우리은행", "하나은행", "농협은행",
  "기업은행", "카카오뱅크", "토스뱅크", "SC제일은행",
];

const SERVICE_LIST = [
  { id: "surfing",  label: "서핑 레슨",  emoji: "🏄" },
  { id: "fishing",  label: "낚시 투어",  emoji: "🎣" },
  { id: "bicycle",  label: "자전거",     emoji: "🚴" },
  { id: "cafe",     label: "카페",       emoji: "☕" },
  { id: "stay",     label: "숙박",       emoji: "🏠" },
  { id: "hiking",   label: "등산",       emoji: "⛰️" },
  { id: "diving",   label: "스쿠버다이빙", emoji: "🤿" },
  { id: "photo",    label: "사진 투어",  emoji: "📷" },
];

const TAX_TYPES = ["일반과세자", "간이과세자", "면세사업자"] as const;

// ── 단계 정의 ─────────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, l: "사업자 인증",  sub: "사업자등록번호" },
  { n: 2, l: "기본 정보",   sub: "대표자/주소"    },
  { n: 3, l: "정산 계좌",   sub: "은행/예금주"    },
  { n: 4, l: "세금 정보",   sub: "과세/면세"      },
  { n: 5, l: "심사 대기",   sub: "1-2 영업일"     },
] as const;

// ── 공통 필드 ─────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  badge?: string;
  wide?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

function Field({ label, value, onChange, hint, badge, wide, readOnly, placeholder }: FieldProps) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
        {label}
        {badge && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 normal-case tracking-normal text-[10px]">
            {badge}
          </span>
        )}
      </label>
      <input
        className={`w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-colors ${readOnly ? "bg-slate-50 text-slate-500" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
      />
      {hint && <p className="text-[10px] font-mono text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// ── Step 1: 사업자 인증 ──────────────────────────────────────────────────────

interface Step1Props {
  regNo: string;
  setRegNo: (v: string) => void;
  bizName: string;
  setBizName: (v: string) => void;
  ceo: string;
  setCeo: (v: string) => void;
  verified: boolean;
  onVerify: () => void;
}

function Step1({ regNo, setRegNo, bizName, setBizName, ceo, setCeo, verified, onVerify }: Step1Props) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 mb-1">사업자 인증</h2>
      <p className="text-sm text-slate-500 mb-6">사업자등록번호를 입력하면 국세청에서 자동 조회합니다.</p>

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            사업자등록번호
            {verified && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 normal-case tracking-normal">
                ✓ 정상
              </span>
            )}
          </label>
          <input
            className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-colors font-mono"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            placeholder="000-00-00000"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onVerify}
            className="px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            국세청 조회
          </button>
        </div>
      </div>

      {verified && (
        <>
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
            <p className="font-extrabold text-emerald-700">✓ 정상 사업자로 확인되었습니다</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              개업일 {DUMMY_BIZ.openDate} · {DUMMY_BIZ.type} · {DUMMY_BIZ.category}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="상호" value={bizName} onChange={setBizName} readOnly />
            <Field label="대표자" value={ceo} onChange={setCeo} readOnly />
          </div>
        </>
      )}

      {!verified && (
        <p className="text-xs text-slate-400 font-mono mt-2">조회 버튼을 눌러 사업자 정보를 자동으로 가져오세요.</p>
      )}
    </div>
  );
}

// ── Step 2: 기본 정보 ────────────────────────────────────────────────────────

interface Step2Props {
  phone: string; setPhone: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  services: Set<string>; toggleService: (id: string) => void;
}

function Step2({ phone, setPhone, email, setEmail, address, setAddress, services, toggleService }: Step2Props) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 mb-1">기본 정보</h2>
      <p className="text-sm text-slate-500 mb-6">파티 운영에 필요한 기본 정보를 입력해 주세요.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="휴대전화" value={phone} onChange={setPhone} hint="고객 문의 응답용" placeholder="010-0000-0000" />
        <Field label="이메일" value={email} onChange={setEmail} hint="정산 명세서 수신" placeholder="example@email.com" />
        <Field label="사업장 주소" value={address} onChange={setAddress} wide placeholder="제주특별자치도 ..." />
      </div>

      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">제공 서비스 선택</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SERVICE_LIST.map((s) => {
          const on = services.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleService(s.id)}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-bold transition-colors ${
                on
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-6 block">
        사업자등록증 사본
      </label>
      <div className="mt-1 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors group">
        <div className="w-12 h-12 mx-auto rounded-lg bg-blue-50 mb-2 flex items-center justify-center text-2xl">
          📄
        </div>
        <p className="text-sm font-bold text-slate-700">파일을 드래그하거나 클릭하여 업로드</p>
        <p className="text-[11px] font-mono text-slate-500 mt-1">PDF · JPG · PNG · 최대 10MB</p>
      </div>
    </div>
  );
}

// ── Step 3: 정산 계좌 ────────────────────────────────────────────────────────

interface Step3Props {
  bank: string; setBank: (v: string) => void;
  accountNo: string; setAccountNo: (v: string) => void;
  accountName: string; setAccountName: (v: string) => void;
}

function Step3({ bank, setBank, accountNo, setAccountNo, accountName, setAccountName }: Step3Props) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 mb-1">정산 계좌</h2>
      <p className="text-sm text-slate-500 mb-6">매주 화요일 자동 정산되는 계좌를 등록해 주세요.</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">은행</label>
          <select
            className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-colors bg-white"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          >
            <option value="">은행 선택</option>
            {BANK_LIST.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <Field label="계좌번호" value={accountNo} onChange={setAccountNo} placeholder="000-00-000000-00" />
        <Field
          label="예금주"
          value={accountName}
          onChange={setAccountName}
          hint="사업자명과 일치해야 합니다"
          wide
        />
      </div>

      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-2 block">
        통장사본
      </label>
      <div className="mt-1 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
        <div className="w-12 h-12 mx-auto rounded-lg bg-blue-50 mb-2 flex items-center justify-center text-2xl">
          🏦
        </div>
        <p className="text-sm font-bold text-slate-700">파일 업로드</p>
        <p className="text-[11px] font-mono text-slate-500 mt-1">PDF · JPG · 최대 10MB</p>
      </div>
    </div>
  );
}

// ── Step 4: 세금 정보 ────────────────────────────────────────────────────────

interface Step4Props {
  taxType: string; setTaxType: (v: string) => void;
  taxEmail: string; setTaxEmail: (v: string) => void;
}

function Step4({ taxType, setTaxType, taxEmail, setTaxEmail }: Step4Props) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 mb-1">세금 정보</h2>
      <p className="text-sm text-slate-500 mb-6">과세 유형에 따라 세금계산서가 자동 발행됩니다.</p>

      <div className="space-y-2 mb-5">
        {TAX_TYPES.map((type) => {
          const on = taxType === type;
          return (
            <label
              key={type}
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                on ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="tax"
                checked={on}
                onChange={() => setTaxType(type)}
                className="accent-blue-600"
              />
              <div className="flex-1">
                <span className="font-extrabold text-slate-900">{type}</span>
                {type === "일반과세자" && (
                  <p className="text-xs text-slate-500 mt-0.5">연 매출 8,000만원 이상 · 세금계산서 발행 가능</p>
                )}
                {type === "간이과세자" && (
                  <p className="text-xs text-slate-500 mt-0.5">연 매출 8,000만원 미만 · 세금계산서 발행 불가</p>
                )}
                {type === "면세사업자" && (
                  <p className="text-xs text-slate-500 mt-0.5">부가세 면제 업종 · 계산서만 발행</p>
                )}
              </div>
              {on && <span className="text-blue-600 font-bold text-sm">✓</span>}
            </label>
          );
        })}
      </div>

      <Field
        label="세금계산서 수신 이메일"
        value={taxEmail}
        onChange={setTaxEmail}
        wide
        placeholder="tax@example.com"
        hint="과세 신고 자료가 이 주소로 발송됩니다"
      />
    </div>
  );
}

// ── Step 5: 심사 대기 ────────────────────────────────────────────────────────

interface TimelineItemProps {
  done: boolean;
  active?: boolean;
  label: string;
  sub: string;
}

function TimelineItem({ done, active, label, sub }: TimelineItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 w-5 h-5 rounded-full grid place-items-center text-[10px] font-extrabold shrink-0 ${
          done
            ? active
              ? "bg-blue-600 text-white animate-pulse"
              : "bg-emerald-500 text-white"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {done && !active ? "✓" : ""}
      </div>
      <div>
        <p className={`text-sm font-bold ${done ? "text-slate-900" : "text-slate-400"}`}>{label}</p>
        <p className="text-[11px] font-mono text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

function Step5() {
  return (
    <div className="text-center py-6">
      <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-3xl mb-4">
        ⏳
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-1">심사 중입니다</h2>
      <p className="text-sm text-slate-500 mb-6">
        제출하신 정보를 검토 중입니다.
        <br />
        1–2 영업일 내에 결과를 알려드릴게요.
      </p>

      <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5">
        <TimelineItem done label="서류 제출 완료" sub="2026.05.06 14:32" />
        <TimelineItem done active label="서류 검토 중" sub="예상 1-2 영업일" />
        <TimelineItem done={false} label="승인 / 반려 통보" sub="이메일 + SMS" />
        <TimelineItem done={false} label="파티 등록 가능" sub="대시보드 접근" />
      </div>

      <p className="font-mono text-[11px] text-slate-400 mt-6">
        결과는 kim@example.com 으로 안내드립니다
      </p>
    </div>
  );
}

// ── 사이드바 도움말 ───────────────────────────────────────────────────────────

function Sidebar({ step }: { step: number }) {
  const helpText =
    step === 2
      ? "대표자명은 사업자등록증과 일치해야 해요"
      : step === 3
      ? "예금주가 사업자명과 다르면 반려될 수 있어요"
      : step === 4
      ? "과세 유형은 국세청 사업자 정보 기준으로 선택하세요"
      : "입력하신 내용은 자동 저장됩니다";

  return (
    <aside className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-blue-700 mb-1">도움말</p>
        <p className="text-sm font-extrabold text-blue-900">{helpText}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
        <p className="font-extrabold text-slate-900 mb-1.5">도움이 필요하세요?</p>
        <p>온보딩 관련 문의는 평일 09–18시</p>
        <p className="font-mono mt-1">help@jeju-biz.kr · 1588-0000</p>
      </div>
      <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs leading-relaxed">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1">절차 요약</p>
        <p className="text-white/80">서류 제출 → 1–2 영업일 심사 → 승인 후 즉시 파티 등록 가능</p>
      </div>
    </aside>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [regNo, setRegNo] = useState("");
  const [bizName, setBizName] = useState("");
  const [ceo, setCeo] = useState("");
  const [verified, setVerified] = useState(false);

  // Step 2
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [services, setServices] = useState<Set<string>>(new Set());

  // Step 3
  const [bank, setBank] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");

  // Step 4
  const [taxType, setTaxType] = useState<string>("일반과세자");
  const [taxEmail, setTaxEmail] = useState("");

  const toggleService = (id: string) => {
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleVerify = () => {
    setVerified(true);
    setBizName(DUMMY_BIZ.bizName);
    setCeo(DUMMY_BIZ.ceo);
    setRegNo(DUMMY_BIZ.regNo);
  };

  const nextLabel =
    step === 4 ? "심사 요청 →" : step === 5 ? "확인" : "다음 →";

  return (
    <div className="min-h-screen bg-slate-50">
      <DevNav />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-slate-900">사업자 온보딩</h1>
          <p className="text-sm text-slate-500 mt-0.5">서비스 이용을 위한 사업자 인증 절차입니다</p>
        </div>

        {/* 진행 스텝 바 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {STEPS.map((s, i) => {
              const done = s.n < step;
              const active = s.n === step;
              return (
                <div key={s.n} className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`flex items-center gap-2 shrink-0 ${active ? "" : "opacity-60"}`}>
                    <div
                      className={`w-8 h-8 rounded-full grid place-items-center font-extrabold text-xs shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {done ? "✓" : s.n}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-xs font-extrabold whitespace-nowrap ${active ? "text-blue-600" : "text-slate-700"}`}>
                        {s.l}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">{s.sub}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px min-w-[8px] ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 본문 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* 메인 카드 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            {step === 1 && (
              <Step1
                regNo={regNo} setRegNo={setRegNo}
                bizName={bizName} setBizName={setBizName}
                ceo={ceo} setCeo={setCeo}
                verified={verified}
                onVerify={handleVerify}
              />
            )}
            {step === 2 && (
              <Step2
                phone={phone} setPhone={setPhone}
                email={email} setEmail={setEmail}
                address={address} setAddress={setAddress}
                services={services} toggleService={toggleService}
              />
            )}
            {step === 3 && (
              <Step3
                bank={bank} setBank={setBank}
                accountNo={accountNo} setAccountNo={setAccountNo}
                accountName={accountName} setAccountName={setAccountName}
              />
            )}
            {step === 4 && (
              <Step4
                taxType={taxType} setTaxType={setTaxType}
                taxEmail={taxEmail} setTaxEmail={setTaxEmail}
              />
            )}
            {step === 5 && <Step5 />}

            {/* 이전 / 다음 버튼 */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors"
              >
                ← 이전
              </button>
              <button
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-extrabold rounded-xl hover:bg-blue-700 transition-colors"
              >
                {nextLabel}
              </button>
            </div>
          </div>

          {/* 사이드바 */}
          <Sidebar step={step} />
        </div>
      </main>
    </div>
  );
}
