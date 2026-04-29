import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "제주 지도 — 카페, 맛집, 관광지, 올레길, 서핑",
    template: "%s | 제주패스",
  },
  description: "제주도 13개 카테고리 관광 지도. 카페, 맛집, 해변, 올레길, 서핑 스팟, 자전거 코스까지. 제주패스에서 한눈에 확인하세요.",
  keywords: ["제주패스", "제주 여행", "제주 지도", "제주 카페 지도", "제주 맛집 지도", "제주 올레길", "제주 관광 지도", "제주 서핑 포인트"],
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
