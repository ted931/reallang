import type { Metadata } from "next";
import DevNav from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Travel Pick — 나에게 맞는 제주", template: "%s | Travel Pick" },
  description: "대기, 인파, 경치 vs 맛 성향에 따라 딱 맞는 제주 여행지를 추천해드려요.",
  keywords: ["제주여행", "맛집추천", "카페추천", "여행코스", "성향테스트"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&family=Noto+Serif+KR:wght@600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <DevNav />
        {children}
      </body>
    </html>
  );
}
