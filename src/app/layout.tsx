import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaflix 아이디어 놀이터 — realang.store",
  description: "작은 아이디어가 모이는 곳. 사내 프로젝트를 빠르게 프로토타이핑하고 테스트합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-gray-50">{children}</body>
    </html>
  );
}
