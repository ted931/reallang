import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "제주 비즈니스 — 홍보·대시보드·AI 챗봇 | 제주패스",
    template: "%s | 제주패스",
  },
  description: "제주 소상공인을 위한 홍보·대시보드·AI 챗봇 통합 비즈니스 플랫폼. 무료 홍보 페이지, 매출 대시보드, AI 고객 응대까지 한 곳에서.",
  keywords: ["제주패스", "제주 여행", "제주 소상공인", "제주 사장님", "제주 가게 홍보", "제주 비즈니스", "제주패스 파트너", "제주 광고"],
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
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50"><DevNav /><DevFeaturePanel />{children}</body>
    </html>
  );
}
