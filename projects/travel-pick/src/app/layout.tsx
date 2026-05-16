import type { Metadata } from "next";
import DevNav from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "제주 여행 성향 추천 — Travel Pick", template: "%s | Travel Pick" },
  description: "나에게 맞는 제주를 찾아드립니다. 대기, 인파, 경치/맛 성향에 따라 맞춤 여행지를 추천해드려요.",
  keywords: ["제주여행", "맛집추천", "카페추천", "여행코스", "성향테스트"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <DevNav />
        {children}
      </body>
    </html>
  );
}
