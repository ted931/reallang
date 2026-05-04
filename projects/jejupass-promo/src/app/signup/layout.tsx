import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '사장님 회원가입 — 제주패스',
  description: '제주패스 사장님 계정을 만들고 가게를 무료로 홍보하세요. 사업자 인증 후 즉시 시작 가능.',
  alternates: { canonical: 'https://jejupass.com/web/signup' },
  robots: { index: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
