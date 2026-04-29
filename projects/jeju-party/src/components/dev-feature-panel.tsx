"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface Feature {
  name: string;
  desc: string;
  status?: "완료" | "개발중" | "기획중";
}
interface PageDoc {
  title: string;
  summary: string;
  userFlow?: string[];
  features: Feature[];
  notes?: string;
}

const DOCS: Record<string, PageDoc> = {
  "/": {
    title: "🎉 제주 취미 파티 피드",
    summary: "제주에서 열리는 취미 기반 소모임(파티) 목록. 서핑, 감귤따기, 요리 클래스 등 다양한 파티 탐색.",
    userFlow: [
      "피드 진입 — 최신 파티 카드 그리드 로드 (더미 데이터 기반)",
      "카테고리 탭(전체/서핑/감귤/요리 등) 터치 → useMemo 필터 즉시 반영",
      "지역 탭(전체 지역/제주시/서귀포 등) 추가 필터 적용 가능",
      "파티 카드 클릭 → /party/[id] 상세 페이지로 이동",
      "잔여 자리 1석 이하 시 카드에 빨간 '1자리 남음' 뱃지 표시",
      "필터 결과 0건 → 빈 상태 화면 + '파티 만들기' CTA 표시",
      "상단 '+ 파티 만들기' 버튼 클릭 → /create 파티 개설 폼으로 이동",
    ],
    features: [
      {
        name: "파티 카드 피드",
        desc: "썸네일(카테고리 이모지+라벨), 제목, 날짜/시간, 지역, 현재/최대 인원(잔여석 강조), 비용(무료·엔빵·정액), 호스트 닉네임+인증뱃지+평점, 카페패스/렌터카 태그 표시. 빈 상태 시 '이 조건에 맞는 파티가 없어요' 화면 + 파티 만들기 버튼",
        status: "완료",
      },
      {
        name: "카테고리 + 지역 필터",
        desc: "HOBBY_CATEGORIES 기반 카테고리 칩 + REGIONS 기반 지역 칩 이중 필터. useMemo로 category AND region 조건 교차 필터링. 선택 항목 재클릭 시 해제",
        status: "완료",
      },
      {
        name: "렌터카 연계 태그",
        desc: "파티에 렌터카 모드 설정 시 카드에 태그 표시. rent-together → '🚗 엔빵 N원', own-car → '🚗 동승가능', hasRentalCar → '🚗 렌터카'",
        status: "완료",
      },
      {
        name: "카페패스 태그",
        desc: "파티에 cafePassEnabled=true 시 카드에 '☕ 카페패스' 뱃지 표시",
        status: "완료",
      },
      {
        name: "파티 만들기 CTA",
        desc: "헤더 오른쪽 '+ 파티 만들기' 버튼. basePath 포함 /create 이동. 빈 상태 화면에도 동일 버튼 노출",
        status: "완료",
      },
      {
        name: "무한 스크롤",
        desc: "현재 더미 데이터 전량 표시. 페이징 처리 미구현 — Intersection Observer 기반 추가 로드 예정",
        status: "개발중",
      },
    ],
  },
  "/create": {
    title: "✏️ 파티 만들기",
    summary: "새 취미 파티를 개설하는 멀티 섹션 폼. 닉네임·카테고리·제목·날짜·지역·인원·비용·이동수단·카페패스·약관동의·본인인증 순서로 진행.",
    userFlow: [
      "피드에서 '+ 파티 만들기' 클릭 → /create 진입",
      "파티장 닉네임 + 한줄 소개 입력",
      "취미 카테고리 선택 (서핑/감귤/요리 등, 기타 직접 입력 가능)",
      "파티 제목·소개 입력 → AI 일정 자동 생성 버튼으로 일정 타임라인 채우기",
      "날짜·시간·지역·집합 장소 설정 (사유 장소 입력 시 경고 표시)",
      "인원(2~10명) + 비용(무료/엔빵/정액 ± 카페패스) + 이동수단(각자/내차/같이렌트) 선택",
      "이용약관 동의 체크 → '파티 만들기' 버튼 활성화",
      "본인인증(휴대폰 번호 입력 + 더미 인증) 완료 → 완료 화면 + 목록 이동 버튼",
    ],
    features: [
      {
        name: "기본 정보 입력",
        desc: "파티 제목(text), 카테고리(chip, HOBBY_CATEGORIES 기반, 기타 직접입력), 날짜(date picker), 시간(time picker), 지역(chip, REGIONS), 집합 장소(text). 집합 장소에 '집·숙소·에어비앤비' 키워드 감지 시 공개 장소 권장 경고 표시",
        status: "완료",
      },
      {
        name: "AI 일정 자동 생성",
        desc: "카테고리+지역 선택 후 '✨ AI가 일정 짜기' 클릭 → /api/parties POST(action: suggest_schedule) 호출 → 반환된 schedule[] + description 자동 채움. 로딩 중 버튼 비활성화",
        status: "완료",
      },
      {
        name: "일정 타임라인",
        desc: "시간+장소+메모 3필드 아이템. 직접 추가/삭제 가능. 카페 카테고리 선택 시 CAFE_TOURS 코스 선택으로 자동 채움. 타임라인 도트 UI로 시각화",
        status: "완료",
      },
      {
        name: "인원 + 비용",
        desc: "인원: 스텝퍼(2~10명). 비용: 무료/엔빵/정액 × 카페패스 ON/OFF 5가지 조합. 비용 금액 입력 시 카페패스·렌터카 엔빵 합산 금액 즉시 표시",
        status: "완료",
      },
      {
        name: "렌터카 패키지 연계",
        desc: "각자이동/내차(차종 입력)/같이빌려요(CARS 목록 선택+인원별 엔빵 계산+픽업·반납지 선택) 3모드. 인원보다 좌석 부족한 차량은 선택 불가(disabled). 카테고리별 추천 차량 표시",
        status: "완료",
      },
      {
        name: "카페패스 추천",
        desc: "전 카테고리 노출. 무제한(3일 14,900원/5일 19,900원) + 잔이용권(3잔 9,900원/5잔 15,500원) 플랜 선택. 추천 멘트 프리셋 5종 + 직접 입력",
        status: "완료",
      },
      {
        name: "약관동의 + 안전가이드 + 본인인증",
        desc: "이용약관+개인정보처리방침 링크 포함 체크박스 필수. 파티장 안전 가이드 접기/펼치기. 제출 시 phoneVerified 미인증이면 PhoneVerify 모달 호출. 인증 완료 후 완료 화면 표시",
        status: "완료",
      },
    ],
  },
  "/party/[id]": {
    title: "🎪 파티 상세",
    summary: "개별 파티 상세 정보 및 참가 신청 흐름. 파티 정보 확인 → 신청 → 결제 → 완료. 카카오패스/렌터카 업셀, 신고 기능 포함.",
    userFlow: [
      "피드에서 파티 카드 클릭 → /party/[id] 진입, DUMMY_PARTIES에서 id 매칭",
      "파티 정보(제목·호스트·날짜·장소·인원·소개·일정 타임라인) 확인",
      "렌터카 연계 정보 또는 카페패스 안내 배너 확인",
      "'참가 신청' 버튼 클릭 → 신청 모달 오픈 (step: info)",
      "참가자 이름 입력 + 약관 동의 체크 → '결제하기' 클릭 (step: paying, 2초 딜레이)",
      "결제 완료 (step: done) → 카카오패스 업셀 오퍼 화면 표시 (step: pass-offer)",
      "패스 구매 선택 → 패스 모달(select→paying→done) 또는 '다음에' 클릭해 상세로 복귀",
      "호스트 더보기 메뉴 → 신고 모달(카테고리 선택+제출) 또는 안전 정보 확인",
    ],
    features: [
      {
        name: "파티 정보 표시",
        desc: "제목, 카테고리 뱃지, 호스트(닉네임+인증뱃지+평점+파티횟수+한줄소개), 날짜/시간, 지역, 집합 장소, 최대/현재 인원(잔여석), 참가비, 상세 소개, 일정 타임라인(시간+장소+메모). 파티 없을 시 404 화면",
        status: "완료",
      },
      {
        name: "참가 신청 모달",
        desc: "4단계 스텝: info(이름입력+약관동의) → paying(2초 처리 스피너) → done(완료) → pass-offer(카카오패스 업셀). 렌터카 연계 파티는 동승 여부 선택 옵션 추가. 본인인증 미완 시 PhoneVerify 모달 선행",
        status: "완료",
      },
      {
        name: "카카오패스 업셀",
        desc: "결제 완료 후 pass-offer 단계에서 CAFE_PASSES 목록(3일/5일/3잔/5잔) 표시. 카페투어 코스 있을 시 절약 금액(개별구매 ~5,000원/잔 기준) 계산·표시. '패스 구매' 클릭 시 패스 전용 모달 진입",
        status: "완료",
      },
      {
        name: "렌터카 연계 오퍼",
        desc: "파티에 rentalCarId 설정 시 렌터카 정보(차종·좌석·일일요금·엔빵금액) + 잔여 동승 자리 표시. 신청 모달 내 '렌터카 같이 타기' 체크박스 제공",
        status: "완료",
      },
      {
        name: "안전 시스템",
        desc: "호스트 더보기 메뉴: 신고 모달(허위정보/불쾌한언행/사기/기타 카테고리 선택 후 제출). 파티 취소 보험·호스트 평점 표시 UI 구현. 실제 신고 API 미연동",
        status: "개발중",
      },
    ],
    notes: "결제는 현재 목업 상태. 실제 PG 연동 필요. DevNav ?modal=join&step=info 파라미터로 모달 초기 상태 제어 가능",
  },
  "/privacy": {
    title: "📋 개인정보처리방침",
    summary: "서비스 개인정보 수집/이용 방침 안내 페이지.",
    userFlow: [
      "파티 만들기 폼 약관 링크 클릭 → 새 탭에서 /privacy 진입",
      "수집 항목(이름·연락처·기기정보), 이용 목적, 보유 기간 확인",
      "탭 닫기 → 파티 만들기 폼으로 복귀",
    ],
    features: [
      {
        name: "법적 고지 문서",
        desc: "개인정보 수집 항목(이름·연락처·기기정보), 이용 목적(서비스 제공·본인확인), 보유 기간(회원 탈퇴 후 즉시 파기) 명시. 정적 렌더링",
        status: "완료",
      },
    ],
  },
  "/terms": {
    title: "📋 이용약관",
    summary: "서비스 이용약관 안내 페이지.",
    userFlow: [
      "파티 만들기 폼 약관 링크 클릭 → 새 탭에서 /terms 진입",
      "서비스 이용 규정, 금지 행위, 면책 조항 확인",
      "탭 닫기 → 파티 만들기 폼으로 복귀",
    ],
    features: [
      {
        name: "법적 고지 문서",
        desc: "서비스 이용 규정(파티 개설·참가 조건), 금지 행위(허위 정보·사기·불법 모임), 책임 한계(플랫폼은 중개자, 파티 내 사고 책임 제한) 명시. 정적 렌더링",
        status: "완료",
      },
    ],
  },
};

export function DevFeaturePanel() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const key = Object.keys(DOCS).find(k => {
    if (k === pathname) return true;
    const pattern = k.replace(/\[.*?\]/g, "[^/]+");
    return new RegExp(`^${pattern}$`).test(pathname);
  }) ?? "/";
  const doc = DOCS[key];
  if (!doc) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{ writingMode: "vertical-rl" }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[9996] bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-4 px-2 rounded-l-xl shadow-lg transition-colors cursor-pointer"
        >
          기획서
        </button>
      )}
      {open && (
        <div className="fixed right-0 top-9 bottom-0 w-[500px] bg-white z-[9995] overflow-y-auto shadow-2xl border-l border-gray-200">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="font-bold text-base text-gray-900">{doc.title}</h2>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 text-xl transition-colors"
            >×</button>
          </div>
          <div className="px-6 py-5 space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">{doc.summary}</p>
            {doc.userFlow && doc.userFlow.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">유저 플로우</h3>
                <div className="space-y-2.5">
                  {doc.userFlow.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">기능 명세</h3>
              <div className="space-y-3">
                {doc.features.map((f, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{f.name}</span>
                      {f.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          f.status === "완료" ? "bg-emerald-100 text-emerald-700" :
                          f.status === "개발중" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{f.status}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {doc.notes && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800 leading-relaxed">📌 {doc.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
