"use client";

export default function TermsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3">
          <a href={base || "/"} className="text-gray-400 hover:text-gray-600">← 홈</a>
          <h1 className="text-sm font-bold text-gray-900">이용약관</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 &quot;제주 취미 파티&quot;(이하 &quot;서비스&quot;)가 제공하는 취미 모임 매칭, 결제 대행, 카페패스 등
              관련 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무, 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (서비스의 내용)</h2>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>취미 활동 파티(모임) 개설 및 참여 매칭</li>
              <li>에스크로(안전결제) 방식의 참여비 결제 대행</li>
              <li>카페패스 판매 및 제휴 카페 이용권 제공</li>
              <li>파티장(호스트)과 파티원(참여자) 간 커뮤니케이션 지원</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (이용자의 의무)</h2>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>정확한 본인 정보를 제공해야 합니다.</li>
              <li>휴대폰 본인인증을 완료해야 파티 개설 및 참여가 가능합니다.</li>
              <li>타인의 권리를 침해하거나 불쾌감을 주는 행위를 해서는 안 됩니다.</li>
              <li>파티 참여 시 파티장의 안내에 협조해야 합니다.</li>
              <li>만 14세 이상만 서비스를 이용할 수 있습니다.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (금지행위)</h2>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>허위 정보를 이용한 파티 개설 또는 참여</li>
              <li>상업적 목적(영업, 홍보, 종교, 정치 등)으로의 서비스 이용</li>
              <li>타 이용자에 대한 성희롱, 폭언, 협박, 스토킹 등 부적절한 행위</li>
              <li>노쇼(사전 연락 없는 불참)</li>
              <li>서비스 운영을 방해하는 일체의 행위</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (에스크로 결제 및 환불 규정)</h2>
            <div className="space-y-3">
              <p>
                서비스는 안전한 거래를 위해 <strong>에스크로(안전결제) 방식</strong>을 사용합니다.
                결제 금액은 파티가 정상적으로 완료될 때까지 플랫폼에 안전하게 보관되며,
                파티 완료 후 파티장에게 정산됩니다.
              </p>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="font-bold text-gray-900 mb-2">환불 규정</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                    <span><strong>파티 48시간 전</strong> 취소: 전액 환불</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                    <span><strong>파티 24시간 전</strong> 취소: 50% 환불</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold mt-0.5">&#x2022;</span>
                    <span><strong>당일</strong> 취소: 환불 불가</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold mt-0.5">&#x2022;</span>
                    <span><strong>파티장이 취소</strong>한 경우: 전액 환불</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (렌터카 동승 면책)</h2>
            <div className="space-y-2">
              <p>
                파티장이 제공하는 렌터카 동승은 서비스의 부수적 편의사항이며,
                서비스는 렌터카 운행 중 발생하는 교통사고, 차량 손해, 신체 상해 등에 대해
                직접적인 책임을 지지 않습니다.
              </p>
              <p>
                동승자는 자발적 의사에 따라 탑승하는 것이며, 운전자(파티장)의 보험 범위 내에서
                처리됩니다. 동승 전 보험 가입 여부를 확인하시기를 권장합니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (면책조항)</h2>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>서비스는 파티장과 파티원 간 매칭 플랫폼을 제공하며, 파티 진행 중 발생하는 사고·분쟁에 대해 직접적 책임을 지지 않습니다.</li>
              <li>천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
              <li>이용자 간 분쟁은 당사자 간 해결을 원칙으로 하며, 서비스는 분쟁 해결을 위한 중재 노력을 합니다.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (분쟁해결)</h2>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>서비스 이용과 관련된 분쟁은 서비스 내 신고·접수 시스템을 통해 우선 처리합니다.</li>
              <li>당사자 간 합의가 이루어지지 않는 경우, 한국소비자원 또는 관할 법원을 통해 해결합니다.</li>
              <li>본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
            </ol>
          </div>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
            시행일: 2026년 4월 1일
          </p>
        </div>
      </main>
    </div>
  );
}
