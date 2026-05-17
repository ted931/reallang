import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "제주 렌터카 가성비 리포트", template: "%s | 렌터카 리포트" },
  description: "매주 업데이트되는 제주 렌터카 차종별 평균 가격·등락률·가성비 지수. 언제 예약하면 가장 저렴한지 한눈에.",
  keywords: ["제주 렌터카 가격", "렌터카 시세", "제주도 렌터카 가성비", "렌터카 가격 비교"],
  openGraph: {
    title: "제주 렌터카 가성비 리포트",
    description: "차종별 가격 등락률 분석 — AI가 매주 자동 작성합니다",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
