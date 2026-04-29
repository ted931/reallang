import type { Metadata } from "next";
import DevNav from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "제주 취미 파티 — 같이 놀 사람 모집",
    template: "%s | 제주패스",
  },
  description: "자전거, 등산, 서핑, 카페탐방... 제주에서 같이 즐길 파티원을 찾아보세요. 파티장이 코스 짜고 렌터카도 준비! 제주 여행자 취미/액티비티 파티 매칭 플랫폼.",
  keywords: ["제주패스", "제주 여행", "제주 파티", "제주 모임", "제주 서핑 파티", "제주 등산 모임", "제주 소셜 여행"],
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
        <link rel="canonical" href="https://jejupass.com/party" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50">
        <DevNav />
        <DevFeaturePanel />
        {children}
        <Footer />
      </body>
    </html>
  );
}
