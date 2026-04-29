import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI 제주 코스 메이커 — 최적 동선 자동 생성",
    template: "%s | 제주패스",
  },
  description: "취향을 입력하면 AI가 3가지 제주 코스를 추천합니다. 동선, 이동시간, 비용까지 최적화. 제주패스 AI 코스 메이커로 나만의 최적 루트를 완성하세요.",
  keywords: ["제주패스", "제주 여행", "제주 코스", "제주 드라이브 코스", "제주 여행 코스 추천", "제주 최적 동선", "제주 1박2일 코스"],
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
