import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "제주 날씨 — 실시간 기상 · 지역별 기온 · 3일 예보",
    template: "%s | 제주패스",
  },
  description:
    "제주도 10개 지역 실시간 날씨를 확인하세요. 제주시, 서귀포, 애월, 성산, 중문 기온·강수·풍속 정보와 3일 예보. 지금 맑은 곳과 비 오는 곳을 한눈에.",
  keywords: [
    "제주패스", "제주 여행",
    "제주 날씨", "제주도 날씨", "제주 오늘 날씨", "제주 실시간 날씨",
    "제주 주간 날씨", "제주 기상",
    "서귀포 날씨", "제주시 날씨", "애월 날씨", "성산 날씨", "중문 날씨", "한라산 날씨",
    "제주 비", "제주 기온", "제주 여행 날씨", "제주 날씨 예보",
  ],
  metadataBase: new URL("https://jejupass.com"),
  openGraph: {
    title: "제주 실시간 날씨 — 지역별 기온 · 강수 · 풍속",
    description: "제주도 10개 지역 실시간 날씨. 지금 맑은 곳과 비 오는 곳을 한눈에 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "제주패스",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://jejupass.com/weather" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "제주 실시간 날씨 지도",
    description: "제주도 10개 지역 실시간 기상 정보와 3일 예보",
    url: "https://realang.store/weather",
    applicationCategory: "WeatherApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    author: { "@type": "Organization", name: "제주패스", url: "https://realang.store" },
  };

  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased">
        <DevNav />
        <DevFeaturePanel />
        {children}
      </body>
    </html>
  );
}
