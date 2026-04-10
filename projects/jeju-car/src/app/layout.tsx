import { DevNav } from "@/components/dev-nav";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "제주 렌터카 — AI 차종 추천 · 스마트 주유 | 제주패스",
  description: "인원·짐에 맞는 AI 차종 추천부터 최저가 주유소 안내까지. 제주 렌터카 여행의 비용을 줄여드립니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50"><DevNav />{children}</body>
    </html>
  );
}
