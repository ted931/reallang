import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "제주패스 AI 상담 — 무엇이든 물어보세요",
    template: "%s | 제주패스",
  },
  description:
    "제주패스 AI 고객 상담 챗봇 — 제주 여행 관련 무엇이든 물어보세요. 예약, 취소, 환불 등 궁금한 점을 AI가 즉시 답변합니다.",
  keywords: [
    "제주패스", "제주 여행",
    "제주패스 상담", "제주 여행 문의", "제주 AI 챗봇", "제주패스 고객센터",
    "제주패스 예약", "제주패스 환불",
  ],
  metadataBase: new URL("https://jejupass.com"),
  openGraph: {
    type: "website",
    siteName: "제주패스",
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: false,
    follow: false,
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
