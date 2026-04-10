import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "날씨 드라이브 코스 — 제주 AI 추천 | 제주패스",
  description: "지금 제주 날씨에 맞는 최적의 드라이브 코스를 AI가 실시간 추천합니다.",
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
