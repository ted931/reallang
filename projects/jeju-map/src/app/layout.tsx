import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "제주 지도 — 카페, 맛집, 관광지, 올레길, 서핑",
  description: "제주도 13개 카테고리 관광 지도. 카페, 맛집, 해변, 올레길, 서핑 스팟, 자전거 코스까지.",
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
      </body>
    </html>
  );
}
