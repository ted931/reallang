import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 제주 코스 메이커 — 최적 동선 자동 생성",
  description: "취향을 입력하면 AI가 3가지 제주 코스를 추천합니다. 동선, 이동시간, 비용까지 최적화.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased">
        <DevNav />
        {children}
      </body>
    </html>
  );
}
