import type { Metadata } from "next";
import { Geist } from "next/font/google";
import DevNav from "@/components/DevNav";
import { DevFeaturePanel } from "@/components/dev-feature-panel";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "제주패스 — 제주 카페·맛집·액티비티 무료 홍보",
    template: "%s | 제주패스",
  },
  description:
    "제주 사장님, 제주패스에 무료로 가게를 등록하세요. AI가 SNS 콘텐츠를 자동 생성하고, 카페패스 입점으로 안정적인 여행객 유입을 만들어드립니다.",
  keywords: [
    "제주패스",
    "제주 카페",
    "제주 맛집",
    "제주 카페패스",
    "제주 여행",
    "제주 SNS 마케팅",
    "제주 가게 홍보",
    "제주 소상공인",
  ],
  authors: [{ name: "제주패스", url: "https://jejupass.com" }],
  metadataBase: new URL("https://jejupass.com"),
  alternates: {
    canonical: "https://jejupass.com/web",
  },
  openGraph: {
    type: "website",
    siteName: "제주패스",
    locale: "ko_KR",
    url: "https://jejupass.com/web",
    title: "제주패스 — 제주 카페·맛집 무료 홍보 플랫폼",
    description: "제주 사장님을 위한 무료 마케팅 플랫폼. SNS 자동 생성 + 카페패스 입점 기회",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "제주패스 — 제주 가게 홍보 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "제주패스 — 제주 카페·맛집 무료 홍보",
    description: "제주 사장님을 위한 AI 마케팅 플랫폼",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  verification: {
    google: "jejupass-google-verification",
    other: {
      "naver-site-verification": ["jejupass-naver-verification"],
    },
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
        <DevFeaturePanel />
        {children}
      </body>
    </html>
  );
}
