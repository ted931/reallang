import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kaflix — 제주 여행·렌터카·카페패스", template: "%s | Kaflix" },
  description: "제주 렌터카 가격 비교, 카페패스 추천, AI 여행 코스 설계까지. 데이터 기반 제주 여행 플랫폼.",
  keywords: ["제주여행", "제주렌터카", "카페패스", "제주여행코스", "제주관광"],
  metadataBase: new URL("https://realang.store"),
  openGraph: {
    siteName: "Kaflix",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    // 구글 서치콘솔: Search Console → 속성 추가 → HTML 태그 방식으로 발급받은 코드 입력
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
    // 네이버 서치어드바이저: searchadvisor.naver.com → 사이트 등록 → HTML 태그에서 content 값 입력
    other: { "naver-site-verification": "NAVER_SEARCH_ADVISOR_VERIFICATION_CODE" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Noto_Sans_KR] antialiased bg-white">{children}</body>
    </html>
  );
}
