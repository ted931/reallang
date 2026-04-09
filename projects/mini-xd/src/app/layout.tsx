import type { Metadata } from "next";
import { DevNav } from "@/components/dev-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini XD — AI Design to Code",
  description: "디자인 이미지를 업로드하면 AI가 React + Tailwind 코드로 변환합니다",
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
        {children}
      </body>
    </html>
  );
}
