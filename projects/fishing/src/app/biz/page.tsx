import Link from "next/link";

export const metadata = { title: "사장님 전용 — 피싱로그 업체 등록" };

const BENEFITS = [
  {
    icon: "📣",
    title: "8,420명에게 무료 노출",
    desc: "피싱로그 회원들이 좌대·포인트 검색할 때 우리 업체가 바로 나와요. 별도 광고비 없이 기본 노출.",
  },
  {
    icon: "📋",
    title: "조황 자동 연결",
    desc: "회원이 우리 좌대에서 올린 조황 리포트가 업체 페이지에 자동 연결돼요. 실제 후기가 신뢰도를 높여줍니다.",
  },
  {
    icon: "📅",
    title: "예약 관리 한눈에",
    desc: "전화 예약을 일일이 받을 필요 없이 대시보드에서 예약 현황, 잔여석, 일정을 한눈에 관리.",
  },
  {
    icon: "⭐",
    title: "리뷰 & 별점 관리",
    desc: "실제 방문 낚시꾼의 후기가 쌓여요. 별점 높은 업체는 검색 상위에 자동 노출.",
  },
  {
    icon: "📊",
    title: "조황 통계 제공",
    desc: "우리 좌대에서 어떤 어종이 얼마나 잡혔는지 월별 통계로 확인. 마케팅 소재로 바로 활용.",
  },
  {
    icon: "🎯",
    title: "프리미엄 노출 (선택)",
    desc: "홈 메인·검색 상단에 업체를 강조 노출. 월 39,000원으로 경쟁 업체보다 먼저 보입니다.",
  },
];

const PLANS = [
  {
    name: "무료",
    price: "0원",
    period: "영구 무료",
    color: "border-ocean-700",
    badge: "",
    features: [
      "업체 프로필 페이지",
      "좌대·선상 정보 등록",
      "조황 리포트 자동 연결",
      "기본 검색 노출",
      "예약 문의 연결",
    ],
    cta: "무료로 시작하기",
    ctaStyle: "bg-ocean-700 hover:bg-ocean-600 text-white",
  },
  {
    name: "프리미엄",
    price: "39,000원",
    period: "/ 월",
    color: "border-hook",
    badge: "인기",
    features: [
      "무료 플랜 전체 포함",
      "홈 메인 추천 업체 노출",
      "검색 상단 고정 노출",
      "프리미엄 뱃지 표시",
      "월별 조황·예약 통계",
      "리뷰 우선 노출",
    ],
    cta: "프리미엄 시작하기",
    ctaStyle: "bg-hook hover:bg-hook-light text-ocean-950",
  },
];

const STEPS = [
  { step: 1, title: "업체 등록", desc: "업체명, 위치, 연락처, 운영 정보 입력. 5분이면 완료." },
  { step: 2, title: "검토 & 승인", desc: "피싱로그 팀이 1~2일 내 확인 후 승인 알림." },
  { step: 3, title: "노출 시작", desc: "좌대·포인트 검색에 바로 노출. 예약 문의가 들어오기 시작!" },
];

const REVIEWS = [
  { name: "황금수산 대표", region: "서귀포", text: "등록하고 한 달 만에 예약 문의가 3배 늘었어요. 전화로 일일이 받던 게 대시보드로 한눈에 보이니 너무 편해요." },
  { name: "대정수산 선장", region: "모슬포", text: "방어 시즌에 조황 올라오면 우리 업체 이름이 같이 뜨니까 홍보가 저절로 돼요. 카카오 채널보다 효과적입니다." },
  { name: "성산체험수산", region: "성산", text: "초보 낚시꾼 체험 상품인데 피싱로그에서 '초보환영' 필터로 검색하면 바로 나와요. 관광객 유입이 많아졌어요." },
];

export default function BizLandingPage() {
  return (
    <div className="bg-ocean-950">
      {/* 히어로 */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0a1628 0%, #0f2a45 50%, #1a4d70 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-hook/10 border border-hook/30 text-hook text-sm px-4 py-1.5 rounded-full mb-6">
            <span>🎣</span> 피싱로그 사장님 전용
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            낚시꾼 8,420명이<br />
            <span className="text-hook">우리 업체를 찾고 있어요</span>
          </h1>
          <p className="text-slate-300 text-lg mb-4 max-w-xl mx-auto leading-relaxed">
            좌대·선상·낚시용품점 사장님, 등록 무료입니다.<br />
            조황 리포트에 업체 이름이 자동으로 연결돼요.
          </p>
          <p className="text-slate-500 text-sm mb-10">광고비 없음 · 계약 없음 · 5분 등록</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/biz/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-hook hover:bg-hook-light text-ocean-950 font-black text-lg rounded-2xl transition-colors shadow-lg shadow-hook/20">
                무료로 업체 등록하기 →
              </button>
            </Link>
            <Link href="/biz/dashboard">
              <button className="w-full sm:w-auto px-8 py-4 bg-ocean-800 hover:bg-ocean-700 text-white font-bold text-lg rounded-2xl transition-colors border border-ocean-600">
                대시보드 미리보기
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 현황 수치 */}
      <section className="border-y border-ocean-800 bg-ocean-900">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "8,420명", label: "등록 낚시꾼" },
            { value: "38건/일", label: "평균 조황 리포트" },
            { value: "127개", label: "활성 포인트" },
            { value: "15개", label: "등록 좌대 업체" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-black text-hook">{value}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 혜택 */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">등록하면 이런 게 좋아요</h2>
          <p className="text-slate-400">낚시꾼이 자연스럽게 우리 업체를 발견하고 예약합니다</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 hover:border-ocean-600 transition-colors">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-slate-100 mb-2">{b.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 등록 업체 보이는 방식 (미리보기) */}
      <section className="bg-ocean-900 border-y border-ocean-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white mb-2">낚시꾼 눈에 이렇게 보여요</h2>
            <p className="text-slate-400 text-sm">좌대 검색 결과에서 업체 카드가 이렇게 노출됩니다</p>
          </div>
          <div className="max-w-sm mx-auto rounded-2xl border-2 border-hook bg-ocean-950 overflow-hidden shadow-xl shadow-hook/10">
            <div className="h-36 relative" style={{ background: "linear-gradient(135deg, #0d2137 0%, #0f3460 50%, #1a4d70 100%)" }}>
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">🛖</div>
              <div className="absolute top-3 left-3">
                <span className="text-xs bg-teal-900/80 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">잔여 8석</span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="text-xs bg-hook/20 text-hook border border-hook/30 px-2 py-0.5 rounded-full font-bold">⭐ 프리미엄</span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="text-xs bg-ocean-950/80 text-ocean-300 px-2 py-0.5 rounded-full">서귀포</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-100">서귀포 황금좌대</span>
                <span className="text-hook font-bold text-sm">55,000원</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {["참돔", "감성돔", "벵에돔"].map(f => (
                  <span key={f} className="text-[10px] bg-rose-900/50 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-hook">★ 4.8 <span className="text-slate-500">(142)</span></span>
                <span className="text-teal-400 font-bold">조황 상</span>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">프리미엄 등록 시 ⭐ 뱃지 + 상단 노출</p>
        </div>
      </section>

      {/* 요금제 */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">요금제</h2>
          <p className="text-slate-400">부담 없이 시작하고, 필요할 때 업그레이드</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border-2 ${plan.color} bg-ocean-900 p-6 relative`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-hook text-ocean-950 text-xs font-black px-3 py-1 rounded-full">{plan.badge}</span>
                </div>
              )}
              <div className="mb-4">
                <div className="text-slate-400 text-sm mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-teal-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/biz/register">
                <button className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 진행 단계 */}
      <section className="bg-ocean-900 border-y border-ocean-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-10">등록 3단계면 끝</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-ocean-800 border-2 border-hook flex items-center justify-center text-hook font-black text-lg mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-100 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 업체 후기 */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-white text-center mb-10">이미 등록한 업체 사장님들</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
              <div className="text-hook text-sm mb-3">★★★★★</div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">"{r.text}"</p>
              <div className="text-xs text-slate-500">{r.name} · {r.region}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="bg-ocean-900 border-t border-ocean-800 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">지금 바로 등록하세요</h2>
          <p className="text-slate-400 mb-8">무료입니다. 계약서 없습니다. 5분이면 됩니다.</p>
          <Link href="/biz/register">
            <button className="px-10 py-4 bg-hook hover:bg-hook-light text-ocean-950 font-black text-xl rounded-2xl transition-colors shadow-lg shadow-hook/20">
              무료 업체 등록 →
            </button>
          </Link>
          <p className="text-xs text-slate-600 mt-4">문의: biz@fishinglog.kr · 카카오톡 채널: @피싱로그</p>
        </div>
      </section>
    </div>
  );
}
