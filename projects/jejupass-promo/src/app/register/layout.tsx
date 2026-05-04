import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '가게 등록 — 제주패스 무료 홍보 시작',
  description:
    '제주 카페·맛집·액티비티 사장님, 지금 바로 무료로 등록하세요. 3분이면 충분합니다. 가입비·수수료 없음.',
  keywords: ['제주 카페 등록', '제주 가게 무료 등록', '제주패스 등록', '제주 소상공인 홍보'],
  alternates: {
    canonical: 'https://jejupass.com/web/register',
  },
  openGraph: {
    title: '제주패스에 가게 무료 등록하기',
    description: '3분이면 충분. 가입비·수수료 없이 제주 여행객에게 노출됩니다.',
    url: 'https://jejupass.com/web/register',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
