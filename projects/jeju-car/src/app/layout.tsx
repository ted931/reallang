import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "제주 렌터카 — AI 차종 추천 · 스마트 주유 | 제주패스",
    template: "%s | 제주패스",
  },
  description: "인원·짐에 맞는 AI 차종 추천부터 최저가 주유소 안내까지. 제주 렌터카 여행의 비용을 줄여드립니다. 제주 렌터카 AI 차종 추천 서비스.",
  keywords: ["제주패스", "제주 여행", "제주 렌터카", "제주 차종 추천", "제주 렌터카 비교", "제주 여행 렌터카"],
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
