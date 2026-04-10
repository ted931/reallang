import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 차종 추천 — 제주 렌터카 | 제주패스",
  description: "여행 인원, 짐, 코스를 입력하면 AI가 최적의 제주 렌터카 차종을 추천합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50">{children}</body>
    </html>
  );
}
