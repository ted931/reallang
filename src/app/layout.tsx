import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaflix 아이디어 놀이터 — realang.store",
  description: "제주 여행·렌터카·비즈니스 통합 서비스와 AI 프로토타입 실험실. 프로토타입에서 실제 서비스로.",
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
      <body className="font-[Noto_Sans_KR] antialiased bg-white">{children}</body>
    </html>
  );
}
