const TRAVEL_FLOW = [
  {
    step: 1,
    label: "날씨 확인",
    emoji: "🌤️",
    title: "지금 제주 날씨는?",
    description: "10개 지역 실시간 기온·강수·풍속. 맑은 곳과 비 오는 곳을 한눈에.",
    href: "/weather/",
    cta: "날씨 보기",
    color: "from-sky-400 to-cyan-500",
  },
  {
    step: 2,
    label: "코스 만들기",
    emoji: "🧭",
    title: "AI가 3가지 코스를 추천",
    description: "취향·인원·예산에 맞는 최적 코스를 30초 만에. 동선·이동시간·비용 비교.",
    href: "/course/",
    cta: "코스 만들기",
    color: "from-violet-500 to-indigo-600",
  },
  {
    step: 3,
    label: "일정 짜기",
    emoji: "✈️",
    title: "AI 맞춤 여행 일정",
    description: "자연어로 입력하면 숙소·맛집·관광지·액티비티 일정을 자동 구성.",
    href: "/travel/",
    cta: "일정 만들기",
    color: "from-emerald-500 to-green-600",
  },
  {
    step: 4,
    label: "장소 탐색",
    emoji: "🗺️",
    title: "제주 지도에서 발견",
    description: "카페·맛집·해변·올레길 등 13개 카테고리. 카카오맵 연동 길찾기.",
    href: "/map/",
    cta: "지도 보기",
    color: "from-green-500 to-emerald-600",
  },
];

const TOOLS = [
  {
    name: "통합 대시보드",
    href: "/dashboard/",
    emoji: "📊",
    description: "매출·예약·CS 현황",
    badge: "운영",
  },
  {
    name: "AI CS 챗봇",
    href: "/chatbot/",
    emoji: "💬",
    description: "예약/취소/환불 즉시 답변",
    badge: "CS",
  },
  {
    name: "제주패스 프로모션",
    href: "/jejupass/",
    emoji: "🏪",
    description: "자영업자 무료 홍보",
    badge: "파트너",
  },
  {
    name: "Mini XD",
    href: "/mini-xd/",
    emoji: "🎨",
    description: "디자인→코드 변환",
    badge: "도구",
  },
  {
    name: "Creative Sandbox",
    href: "/sandbox/",
    emoji: "🧪",
    description: "AI 아이디어 놀이터",
    badge: "실험",
  },
];

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-gradient-to-b from-sky-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <p className="text-sm text-sky-600 font-medium mb-2">제주패스 x AI</p>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            제주 여행,<br />어디서부터 시작할까?
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            날씨 확인 → 코스 추천 → 일정 생성 → 예약까지 한번에
          </p>
        </div>
      </header>

      {/* Travel Flow */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-5">
          {TRAVEL_FLOW.map((item) => (
            <a
              key={item.step}
              href={item.href}
              className="group flex items-stretch bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Step Number + Color Bar */}
              <div className={`w-2 bg-gradient-to-b ${item.color} flex-shrink-0`} />

              <div className="flex items-center gap-5 p-6 flex-1">
                {/* Step Badge */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-gray-400">STEP {item.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 mt-0.5">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>

                {/* CTA */}
                <span className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white text-sm font-bold flex-shrink-0 group-hover:shadow-md transition-shadow`}>
                  {item.cta} →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-16 mb-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">운영 도구 & 실험실</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TOOLS.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="group bg-gray-50 hover:bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-2xl block mb-2">{tool.emoji}</span>
              <p className="text-sm font-bold text-gray-900">{tool.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{tool.description}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 text-gray-500 text-[10px] rounded-full">
                {tool.badge}
              </span>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-xs text-gray-400">제주패스 - realang.store</p>
        </div>
      </footer>
    </div>
  );
}
