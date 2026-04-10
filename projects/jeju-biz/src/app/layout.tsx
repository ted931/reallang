import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "제주 비즈니스 — 홍보·대시보드·AI 챗봇 | 제주패스",
  description: "자영업자를 위한 올인원 비즈니스 도구. 무료 홍보 페이지, 매출 대시보드, AI 고객 응대.",
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
