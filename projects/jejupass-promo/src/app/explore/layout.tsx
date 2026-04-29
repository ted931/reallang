import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "제주 카페·맛집·액티비티 탐색",
  description:
    "제주도 카페, 맛집, 액티비티를 지역별·카테고리별로 탐색하세요. 제주패스에 등록된 검증된 가게들을 한눈에.",
  keywords: [
    "제주 카페 추천",
    "제주 맛집",
    "제주 카페투어",
    "서귀포 카페",
    "제주시 맛집",
    "제주 카페패스",
  ],
  alternates: {
    canonical: "https://jejupass.com/web/explore",
  },
  openGraph: {
    title: "제주 카페·맛집 탐색 | 제주패스",
    description: "제주도 검증된 카페와 맛집을 탐색하세요",
    url: "https://jejupass.com/web/explore",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
