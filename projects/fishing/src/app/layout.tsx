import type { Metadata } from "next";
import DevNav from "@/components/dev-nav";
import Header from "@/components/header";
import SideNav from "@/components/side-nav";
import BottomNav from "@/components/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "퐁당 — 제주 낚시 커뮤니티", template: "%s | 퐁당" },
  description: "퐁당 — 제주 낚시에 퐁당 빠져보세요. 조황 피드, 좌대·배편 예약, 어신 AI 예측, 합동출조 매칭, 채비 주문까지.",
  keywords: ["낚시", "조황", "좌대낚시", "갯바위", "방파제낚시", "제주낚시", "포인트", "루어낚시", "감성돔", "참돔", "방어"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('fl-theme');document.documentElement.setAttribute('data-theme',t||'coastal');})();` }} />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="fl-page">
        <DevNav />
        <SideNav />
        <main className="fl-main">
          <Header />
          {children}
          <div className="fl-bottom-pad" />
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
