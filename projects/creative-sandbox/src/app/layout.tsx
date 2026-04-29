import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Creative Sandbox — 사내 AI 아이디어 놀이터",
    template: "%s | 제주패스",
  },
  description: "무한 캔버스 위에서 AI와 함께 아이디어를 프로토타이핑하세요",
  metadataBase: new URL("https://jejupass.com"),
  openGraph: {
    type: "website",
    siteName: "제주패스",
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: false,
    follow: false,
  },
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
        <DevFeaturePanel />
        {children}
      </body>
    </html>
  );
}
