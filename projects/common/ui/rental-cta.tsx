/**
 * 렌터카 예약 CTA 배너
 * AI 결과물(코스/플래너/드라이브) 하단에 공통 삽입
 * UTM 파라미터로 전환 추적 가능
 */

interface RentalCtaProps {
  source: string; // 출처 프로젝트 (course, planner, drive, etc.)
  driveKm?: number; // 총 이동거리
  days?: number; // 여행 일수
  gradient?: string; // 커스텀 그라디언트
}

export function RentalCtaBanner({ source, driveKm, days, gradient }: RentalCtaProps) {
  const utm = `?utm_source=realang&utm_medium=${source}&utm_campaign=ai_result`;
  const subtitle = driveKm
    ? `총 ${driveKm}km 이동 · 제주패스 렌터카 최저가 보장`
    : days
      ? `${days}일간 렌터카 · 제주패스 최저가 보장 · 공항 픽업`
      : "제주패스 렌터카 최저가 보장 · 공항 픽업";

  return (
    <div className={`rounded-xl p-5 text-white bg-gradient-to-r ${gradient || "from-violet-500 to-indigo-500"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">
            {driveKm ? `🚗 이 코스, 렌터카가 필요해요` : `🚗 렌터카 예약`}
          </p>
          <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
        </div>
        <a
          href={`/car/${utm}`}
          className="px-5 py-2.5 bg-white text-violet-600 rounded-lg font-bold text-sm hover:bg-violet-50 transition-colors flex-shrink-0"
        >
          렌터카 보기
        </a>
      </div>
    </div>
  );
}

export function RentalCtaCompact({ source }: { source: string }) {
  const utm = `?utm_source=realang&utm_medium=${source}&utm_campaign=ai_result`;
  return (
    <a
      href={`/car/${utm}`}
      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-medium text-sm hover:from-violet-600 hover:to-indigo-600 transition-all"
    >
      🚗 제주패스 렌터카 예약 →
    </a>
  );
}
