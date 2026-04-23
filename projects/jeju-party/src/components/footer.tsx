"use client";

export default function Footer() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-gray-400 space-y-3">
        <div className="flex gap-4">
          <a href={`${base}/terms`} className="hover:text-gray-600 underline">이용약관</a>
          <a href={`${base}/privacy`} className="hover:text-gray-600 underline">개인정보처리방침</a>
        </div>
        <div className="space-y-1 text-[11px] text-gray-300">
          <p>제주 취미 파티 | 대표: 홍길동 | 사업자등록번호: 000-00-00000</p>
          <p>제주특별자치도 제주시 중앙로 000 | 통신판매업: 제0000-제주-0000호</p>
          <p>고객센터: help@jejuparty.kr | 운영시간: 평일 10:00~18:00</p>
        </div>
        <p className="text-[10px] text-gray-300">&copy; 2026 제주 취미 파티. All rights reserved.</p>
      </div>
    </footer>
  );
}
