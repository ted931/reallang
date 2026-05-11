import type { Metadata } from "next";
import DevNav from "@/components/dev-nav";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "피싱로그 — 제주 낚시 커뮤니티", template: "%s | 피싱로그" },
  description: "제주 낚시 조황, 좌대 예약, 포인트 지도, 낚시 모임 매칭. 방파제·갯바위·선상·좌대낚시 정보를 한 곳에서.",
  keywords: ["낚시", "조황", "좌대낚시", "갯바위", "방파제낚시", "제주낚시", "포인트", "루어낚시", "감성돔", "참돔", "방어"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-ocean-950 text-slate-100">
        <DevNav />
        <Header />
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
