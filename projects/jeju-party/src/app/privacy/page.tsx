"use client";

export default function PrivacyPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3">
          <a href={base || "/"} className="text-gray-400 hover:text-gray-600">← 홈</a>
          <h1 className="text-sm font-bold text-gray-900">개인정보처리방침</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. 수집하는 개인정보 항목</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex gap-3">
                <span className="text-xs font-bold text-gray-500 w-20 flex-shrink-0">필수 항목</span>
                <span>이름(닉네임), 휴대폰 번호, 결제 정보(카드번호 일부)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs font-bold text-gray-500 w-20 flex-shrink-0">자동 수집</span>
                <span>서비스 이용 기록, 접속 로그, IP 주소, 기기 정보</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. 개인정보의 이용 목적</h2>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>파티 개설·참여 매칭 및 본인 확인</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>에스크로 결제 처리 및 환불</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>파티 관련 알림(카카오톡 등) 발송</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>고객 문의 응대 및 분쟁 해결</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>서비스 개선 및 통계 분석 (비식별화 처리)</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. 개인정보 보유 및 이용 기간</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex gap-3">
                <span className="text-xs font-bold text-gray-500 w-28 flex-shrink-0">회원 정보</span>
                <span>회원 탈퇴 시까지 (탈퇴 후 30일 내 파기)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs font-bold text-gray-500 w-28 flex-shrink-0">결제 기록</span>
                <span>전자상거래법에 따라 5년 보관</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs font-bold text-gray-500 w-28 flex-shrink-0">서비스 이용 로그</span>
                <span>통신비밀보호법에 따라 3개월 보관</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="mb-3">
              서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 아래의 경우에 한해 제공될 수 있습니다.
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>이용자가 사전에 동의한 경우</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>파티 매칭을 위해 파티장/파티원에게 닉네임 및 연락처 일부 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>결제 처리를 위해 PG사(결제대행사)에 최소한의 정보 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span>법령에 의해 요구되는 경우</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. 개인정보 파기 절차 및 방법</h2>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span><strong>파기 절차:</strong> 보유 기간 만료 또는 처리 목적 달성 시 지체 없이 파기</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                <span><strong>파기 방법:</strong> 전자 파일은 복구 불가능한 방법으로 영구 삭제, 종이 문서는 분쇄 또는 소각</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. 이용자의 권리</h2>
            <p>
              이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
              고객센터(help@jejuparty.kr)로 문의해주시면 즉시 처리하겠습니다.
            </p>
          </div>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
            시행일: 2026년 4월 1일
          </p>
        </div>
      </main>
    </div>
  );
}
