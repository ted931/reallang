import type { Metadata } from "next";
import "./globals.css";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";

export const metadata: Metadata = {
  title: {
    default: "스마트 주유 — 제주 렌터카 반납 전 주유 가이드 | 제주패스",
    template: "%s | 제주패스",
  },
  description: "반납 전 가장 가까운 저렴한 주유소를 안내하고 필요한 주유량을 정확히 계산합니다. 제주 렌터카 반납 전 최적 주유소 안내 및 주유량 계산 서비스.",
  keywords: ["제주패스", "제주 여행", "제주 주유소", "렌터카 반납 주유", "제주 주유 가이드", "제주 주유소 추천"],
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
