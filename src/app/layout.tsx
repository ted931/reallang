import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "제주패스 — AI 여행 플래너 · 날씨 · 코스 · 지도",
  description: "날씨 확인 → AI 코스 추천 → 맞춤 일정 생성 → 렌터카 예약까지. 제주 여행의 모든 것을 한곳에서.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-white">{children}</body>
    </html>
  );
}
