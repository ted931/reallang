import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "제주패스 AI 상담 — 무엇이든 물어보세요",
  description: "제주패스 예약, 취소, 환불 등 궁금한 점을 AI가 즉시 답변합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased">
        <DevNav />
        {children}
      </body>
    </html>
  );
}
