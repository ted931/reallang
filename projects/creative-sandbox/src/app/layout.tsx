import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Sandbox — 사내 AI 아이디어 놀이터",
  description: "무한 캔버스 위에서 AI와 함께 아이디어를 프로토타이핑하세요",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Inter] antialiased">
        <DevNav />
        {children}
      </body>
    </html>
  );
}
