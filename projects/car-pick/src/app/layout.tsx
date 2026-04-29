import type { Metadata } from "next";
import "./globals.css";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";

export const metadata: Metadata = {
  title: {
    default: "AI 차종 추천 — 제주 렌터카 | 제주패스",
    template: "%s | 제주패스",
  },
  description: "여행 인원, 짐, 코스를 입력하면 AI가 최적의 제주 렌터카 차종을 추천합니다. 여행 인원과 목적에 맞는 제주 렌터카 차종 AI 추천 서비스.",
  keywords: ["제주패스", "제주 여행", "제주 렌터카 추천", "제주 차량 선택", "제주 SUV 렌터카", "렌터카 비교"],
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
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50">
        <DevNav />
        <DevFeaturePanel />
        {children}
      </body>
    </html>
  );
}
