const PROJECTS = [
  {
    name: "제주패스 프로모션",
    href: "/jejupass/",
    description: "소상공인을 위한 무료 홍보 플랫폼. SNS 콘텐츠 자동 생성, 사업자 OCR 인증.",
    tech: ["Next.js", "OpenAI"],
    status: "LIVE" as const,
    emoji: "🏪",
    color: "from-orange-500 to-rose-500",
  },
  {
    name: "Mini XD",
    href: "/mini-xd/",
    description: "디자인 스크린샷을 HTML+Tailwind 코드로 변환하는 AI 도구. 채팅으로 수정 가능.",
    tech: ["GPT-4o", "Tailwind"],
    status: "LIVE" as const,
    emoji: "🎨",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "제주 날씨 지도",
    href: "/weather/",
    description: "제주도 10개 지역 실시간 기상 정보. 기온, 강수, 풍속을 한눈에.",
    tech: ["기상청 API", "VWorld"],
    status: "LIVE" as const,
    emoji: "🌤️",
    color: "from-sky-400 to-cyan-500",
  },
  {
    name: "Creative Sandbox",
    href: "/sandbox/",
    description: "무한 캔버스에서 AI와 대화하며 위젯을 만드는 아이디어 놀이터.",
    tech: ["tldraw", "Supabase"],
    status: "BETA" as const,
    emoji: "🧪",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "제주 지도 플랫폼",
    href: "/map/",
    description: "13개 카테고리로 제주 맛집, 카페, 관광지, 올레길 등을 지도에서 탐색.",
    tech: ["VWorld", "공공데이터"],
    status: "LIVE" as const,
    emoji: "🗺️",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "AI 여행 플래너",
    href: "/travel/",
    description: "자연어로 입력하면 AI가 제주 맞춤 일정을 자동 생성. 숙소, 맛집, 액티비티까지.",
    tech: ["GPT-4o", "공공데이터"],
    status: "NEW" as const,
    emoji: "✈️",
    color: "from-emerald-500 to-green-600",
  },
  {
    name: "AI 코스 메이커",
    href: "/course/",
    description: "취향 기반 3가지 최적 코스 자동 설계. 동선, 이동시간, 비용 비교.",
    tech: ["GPT-4o", "VWorld"],
    status: "NEW" as const,
    emoji: "🧭",
    color: "from-violet-500 to-indigo-600",
  },
  {
    name: "통합 대시보드",
    href: "/dashboard/",
    description: "매출, 예약, CS 현황을 실시간 모니터링. KPI 카드, 차트, 티켓 관리.",
    tech: ["Supabase", "실시간"],
    status: "NEW" as const,
    emoji: "📊",
    color: "from-indigo-500 to-blue-600",
  },
  {
    name: "AI CS 챗봇",
    href: "/chatbot/",
    description: "제주패스 예약/취소/환불 FAQ를 AI가 즉시 답변. GPT-4o 기반 자동 상담.",
    tech: ["GPT-4o", "FAQ RAG"],
    status: "NEW" as const,
    emoji: "💬",
    color: "from-sky-500 to-blue-600",
  },
];

const STATUS_STYLE = {
  LIVE: "bg-emerald-100 text-emerald-700",
  BETA: "bg-amber-100 text-amber-700",
  NEW: "bg-violet-100 text-violet-700",
};

export default function PortalPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Kaflix 아이디어 놀이터</h1>
          <p className="text-gray-500 mt-2">작은 아이디어가 모이는 곳</p>
          <p className="text-sm text-gray-400 mt-1">
            사내 프로젝트를 빠르게 프로토타이핑하고 테스트합니다
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <span>{PROJECTS.length}개 프로젝트</span>
            <span>-</span>
            <span>{PROJECTS.filter((p) => p.status === "LIVE").length} Live</span>
            <span>-</span>
            <span>{PROJECTS.filter((p) => p.status === "NEW").length} New</span>
          </div>
        </div>
      </header>

      {/* Project Grid */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((project) => (
            <a
              key={project.href}
              href={project.href}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Color Bar */}
              <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{project.emoji}</span>
                    <h2 className="font-bold text-gray-900 group-hover:text-gray-700">
                      {project.name}
                    </h2>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[project.status]}`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center">
          <p className="text-xs text-gray-400">Kaflix 아이디어 놀이터 - realang.store</p>
        </div>
      </footer>
    </div>
  );
}
