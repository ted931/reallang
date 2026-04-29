import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI 제주 여행 플래너 — 나만의 맞춤 일정",
    template: "%s | 제주패스",
  },
  description: "자연어로 입력하면 AI가 제주 여행 일정을 자동으로 구성합니다. 숙소, 맛집, 관광지, 액티비티까지. 제주패스 AI 플래너로 맞춤 일정을 만들어보세요.",
  keywords: ["제주패스", "제주 여행", "제주 여행 플래너", "제주 일정 짜기", "제주 AI 추천", "제주 여행 일정 자동 생성", "제주 맞춤 여행"],
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
      <body className="font-[Noto_Sans_KR] antialiased">
        <DevNav />
        <DevFeaturePanel />
        {children}
      </body>
    </html>
  );
}
