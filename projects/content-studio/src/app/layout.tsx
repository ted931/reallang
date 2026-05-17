import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "콘텐츠 스튜디오 — 블로그·인스타 자동 작성",
  description: "제주 여행 관련 블로그 초안과 인스타그램 캡션을 AI가 자동으로 작성해드립니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
