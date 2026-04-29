import type { Metadata } from "next";
import "./globals.css";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";

export const metadata: Metadata = {
  title: {
    default: "날씨 드라이브 코스 — 제주 AI 추천",
    template: "%s | 제주패스",
  },
  description:
    "제주 날씨에 맞는 최적의 드라이브 코스를 AI가 실시간 추천하는 서비스. 지금 날씨에 딱 맞는 제주 드라이브 코스를 확인하세요.",
  keywords: [
    "제주패스", "제주 여행",
    "제주 드라이브 코스", "제주 날씨 드라이브", "제주 드라이브 추천",
    "제주 해안 드라이브", "제주 자동차 여행",
    "제주 AI 추천", "제주 드라이브",
  ],
  metadataBase: new URL("https://jejupass.com"),
  openGraph: {
    type: "website",
    siteName: "제주패스",
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image" },
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
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50">
        <DevNav />
        <DevFeaturePanel />
        {children}
      </body>
    </html>
  );
}
