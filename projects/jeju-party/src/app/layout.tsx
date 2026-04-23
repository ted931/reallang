import type { Metadata } from "next";
import DevNav from "@/components/dev-nav";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "제주 취미 파티 — 같이 놀 사람 모집",
  description: "자전거, 등산, 서핑, 카페탐방... 제주에서 같이 즐길 파티원을 찾아보세요. 파티장이 코스 짜고 렌터카도 준비!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50">
        <DevNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
