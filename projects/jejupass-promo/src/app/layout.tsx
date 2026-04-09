import type { Metadata } from "next";
import { Geist } from "next/font/google";
import DevNav from "@/components/DevNav";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "제주패스 — 제주 가게 무료 홍보",
    template: "%s | 제주패스",
  },
  description: "제주 사장님, 무료로 가게를 홍보하세요. 사진만 올리면 SNS 콘텐츠를 자동으로 만들어드립니다.",
  openGraph: {
    siteName: "제주패스",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <DevNav />
        {children}
      </body>
    </html>
  );
}
