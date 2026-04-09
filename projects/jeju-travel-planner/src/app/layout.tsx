import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 제주 여행 플래너 — 나만의 맞춤 일정",
  description: "자연어로 입력하면 AI가 제주 여행 일정을 자동으로 구성합니다. 숙소, 맛집, 관광지, 액티비티까지.",
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
