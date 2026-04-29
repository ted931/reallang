import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "제주 여행 — 날씨·지도·AI 플래너·코스 | 제주패스",
    template: "%s | 제주패스",
  },
  description: "제주 여행의 모든 단계를 한곳에서. 실시간 날씨, 카카오맵 장소탐색, AI 맞춤 일정, 코스 추천. 제주패스와 함께 완벽한 제주 여행을 계획하세요.",
  keywords: ["제주패스", "제주 여행", "제주 여행 계획", "제주 날씨", "제주 여행 코스", "제주 AI 여행"],
  metadataBase: new URL("https://jejupass.com"),
  openGraph: {
    type: "website",
    siteName: "제주패스",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50"><DevNav /><DevFeaturePanel />{children}</body>
    </html>
  );
}
