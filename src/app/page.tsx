/* ─────────────────────────────────────────────────────────
   realang.store — Kaflix 아이디어 놀이터 포털
   Two-tier structure: 실사용 서비스 (TOP) + 아이디어 놀이터 (BOTTOM)
   ───────────────────────────────────────────────────────── */

const TOP_SERVICES = [
  {
    id: "jeju-travel",
    icon: "✈️",
    name: "제주 여행",
    tagline: "날씨부터 코스까지, 한번에",
    description:
      "실시간 날씨 확인 → AI 코스 추천 → 맞춤 일정 생성 → 카카오맵 연동 장소 탐색. 제주 여행의 모든 단계를 하나의 서비스에서.",
    features: [
      { name: "실시간 날씨", origin: "jeju-weather" },
      { name: "카카오맵 장소탐색", origin: "jeju-map" },
      { name: "AI 여행 플래너", origin: "jeju-travel-planner" },
      { name: "AI 코스 메이커", origin: "jeju-course-maker" },
      { name: "날씨 기반 드라이브 코스", origin: "weather-drive" },
    ],
    href: "/travel/",
    cta: "여행 시작하기",
    status: "BETA" as const,
    gradient: "from-sky-500 to-indigo-600",
    bgGradient: "from-sky-50 to-indigo-50",
    iconBg: "bg-sky-100",
  },
  {
    id: "jeju-car",
    icon: "🚗",
    name: "제주 렌터카",
    tagline: "차 고르고, 싸게 넣자",
    description:
      "인원·짐·예산에 맞는 차종 AI 추천부터 제주 전역 주유소 실시간 가격 비교·경로 최적화까지. 렌터카 여행의 비용을 줄여드립니다.",
    features: [
      { name: "AI 차종 추천", origin: "car-pick" },
      { name: "실시간 주유 가격 비교", origin: "smart-fuel" },
    ],
    href: "/car/",
    cta: "차량 추천받기",
    status: "준비중" as const,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
  },
  {
    id: "jeju-biz",
    icon: "💼",
    name: "제주 비즈니스",
    tagline: "사장님을 위한 올인원 도구",
    description:
      "무료 가게 홍보 페이지 생성, 매출·예약·CS 통합 대시보드, AI 고객 응대 챗봇. 제주 자영업자를 위한 비즈니스 운영 플랫폼.",
    features: [
      { name: "무료 홍보 페이지", origin: "jejupass-promo" },
      { name: "통합 대시보드", origin: "dashboard" },
      { name: "AI CS 챗봇", origin: "cs-chatbot" },
    ],
    href: "/biz/",
    cta: "비즈니스 시작",
    status: "준비중" as const,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
  },
];

const PLAYGROUND_PROJECTS = [
  {
    emoji: "🌤️",
    name: "제주 날씨",
    desc: "10개 지역 실시간 기상",
    href: "/weather/",
    status: "LIVE",
    merged: "jeju-travel",
  },
  {
    emoji: "🗺️",
    name: "제주 지도",
    desc: "13개 카테고리 장소 탐색",
    href: "/map/",
    status: "LIVE",
    merged: "jeju-travel",
  },
  {
    emoji: "🧭",
    name: "AI 코스 메이커",
    desc: "취향 맞춤 코스 추천",
    href: "/course/",
    status: "LIVE",
    merged: "jeju-travel",
  },
  {
    emoji: "✈️",
    name: "AI 여행 플래너",
    desc: "자연어 일정 자동 생성",
    href: "/travel/",
    status: "LIVE",
    merged: "jeju-travel",
  },
  {
    emoji: "🛣️",
    name: "날씨 드라이브",
    desc: "날씨 기반 드라이브 코스",
    href: "/weather-drive/",
    status: "BETA",
    merged: "jeju-travel",
  },
  {
    emoji: "🚘",
    name: "차종 추천",
    desc: "인원·짐에 맞는 렌터카",
    href: "/car-pick/",
    status: "BETA",
    merged: "jeju-car",
  },
  {
    emoji: "⛽",
    name: "스마트 주유",
    desc: "주유소 가격 비교·최적 경로",
    href: "/smart-fuel/",
    status: "BETA",
    merged: "jeju-car",
  },
  {
    emoji: "🏪",
    name: "제주패스 홍보",
    desc: "자영업자 무료 홍보 페이지",
    href: "/jejupass/",
    status: "LIVE",
    merged: "jeju-biz",
  },
  {
    emoji: "📊",
    name: "통합 대시보드",
    desc: "매출·예약·CS 현황",
    href: "/dashboard/",
    status: "BETA",
    merged: "jeju-biz",
  },
  {
    emoji: "💬",
    name: "AI CS 챗봇",
    desc: "예약/취소/환불 즉시 답변",
    href: "/chatbot/",
    status: "BETA",
    merged: "jeju-biz",
  },
  {
    emoji: "🎉",
    name: "취미 파티",
    desc: "제주 소셜 모임 매칭",
    href: "/party/",
    status: "BETA",
    merged: null,
  },
  {
    emoji: "🎨",
    name: "Mini XD",
    desc: "디자인 → 코드 변환",
    href: "/mini-xd/",
    status: "BETA",
    merged: null,
  },
  {
    emoji: "🧪",
    name: "Creative Sandbox",
    desc: "AI 아이디어 캔버스",
    href: "/sandbox/",
    status: "BETA",
    merged: null,
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    LIVE: "bg-green-100 text-green-700 border-green-200",
    BETA: "bg-blue-100 text-blue-700 border-blue-200",
    준비중: "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status] || styles["준비중"]}`}
    >
      {status === "LIVE" && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />}
      {status}
    </span>
  );
}

function MergedBadge({ target }: { target: string | null }) {
  if (!target) return null;
  const labels: Record<string, string> = {
    "jeju-travel": "→ 제주 여행",
    "jeju-car": "→ 제주 렌터카",
    "jeju-biz": "→ 제주 비즈니스",
  };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-500 border border-violet-100">
      {labels[target] || target}
    </span>
  );
}

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">
              K
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Kaflix 아이디어 놀이터
              </h1>
              <p className="text-[11px] text-gray-400">realang.store</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#services" className="hover:text-gray-900 transition-colors">
              서비스
            </a>
            <a href="#playground" className="hover:text-gray-900 transition-colors">
              실험실
            </a>
          </nav>
        </div>
      </header>

      {/* ═══════════════════ TOP: 제주 서비스 ═══════════════════ */}
      <section id="services" className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-violet-600 mb-1.5">실사용 서비스</p>
          <h2 className="text-3xl font-bold text-gray-900">제주 서비스</h2>
          <p className="text-gray-500 mt-2 text-base">
            프로토타입에서 검증된 기능들을 하나로 통합한 실제 서비스
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TOP_SERVICES.map((svc) => (
            <div
              key={svc.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card top gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${svc.gradient}`} />

              <div className="p-6">
                {/* Icon + Status */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 ${svc.iconBg} rounded-2xl flex items-center justify-center text-3xl`}
                  >
                    {svc.icon}
                  </div>
                  <StatusBadge status={svc.status} />
                </div>

                {/* Name + Tagline */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{svc.name}</h3>
                <p className="text-sm text-gray-400 font-medium mb-3">{svc.tagline}</p>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {svc.description}
                </p>

                {/* Sub-features */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    포함 기능
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.features.map((f) => (
                      <span
                        key={f.origin}
                        className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={svc.href}
                  className={`block w-full text-center py-3 rounded-xl bg-gradient-to-r ${svc.gradient} text-white font-semibold text-sm shadow-sm hover:shadow-lg transition-shadow`}
                >
                  {svc.cta} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ DIVIDER ═══════════════════ */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-100">
            <span className="text-base">🧪</span>
            <span className="text-xs font-semibold text-gray-500">
              아이디어 실험실 — 위 서비스의 기반이 된 프로토타입들
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      </div>

      {/* ═══════════════════ BOTTOM: 아이디어 놀이터 ═══════════════════ */}
      <section id="playground" className="max-w-6xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-600">아이디어 놀이터</h2>
          <p className="text-sm text-gray-400 mt-1">
            개별 프로토타입 — 직접 사용해보고 피드백을 남겨주세요
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PLAYGROUND_PROJECTS.map((proj) => (
            <a
              key={proj.href}
              href={proj.href}
              className="group bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-4 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{proj.emoji}</span>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={proj.status} />
                  <MergedBadge target={proj.merged} />
                </div>
              </div>
              <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                {proj.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{proj.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                K
              </div>
              <span className="text-sm font-semibold text-gray-600">Kaflix</span>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-gray-400">
                realang.store | 제주특별자치도
              </p>
              <p className="text-[11px] text-gray-300 mt-1">
                프로토타입에서 실제 서비스로. AI와 함께 만드는 제주 생활 플랫폼.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
