import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "스마트 주유 — 제주 렌터카 반납 전 주유 가이드 | 제주패스",
  description: "반납 전 가장 가까운 저렴한 주유소를 안내하고 필요한 주유량을 정확히 계산합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50">{children}</body>
    </html>
  );
}
