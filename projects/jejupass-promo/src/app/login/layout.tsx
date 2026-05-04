import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 — 제주패스',
  description: '제주패스 사장님 계정으로 로그인하여 내 가게를 관리하세요.',
  alternates: { canonical: 'https://jejupass.com/web/login' },
  robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
