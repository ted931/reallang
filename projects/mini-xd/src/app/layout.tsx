import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mini XD — AI Design to Code",
    template: "%s | 제주패스",
  },
  description: "디자인 이미지를 업로드하면 AI가 React + Tailwind 코드로 변환합니다",
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
      <body className="font-[Inter] antialiased bg-gray-100 text-gray-900">
        <DevNav />
        <DevFeaturePanel />
        {children}
      </body>
    </html>
  );
}
