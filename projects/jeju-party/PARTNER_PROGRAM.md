# 제주 파티 파트너 프로그램 기획서

> 버전: 0.1 (MVP 초안) | 작성일: 2026-04-28

---

## 개요

게스트하우스·카페·관광지·로컬 업체가 jeju-party(3010)의 파티 플로우 안에서
자연스럽게 광고·할인 오퍼를 노출할 수 있는 파트너 프로그램.
기존 jejupass-promo(3001)의 업체 등록/관리 인프라를 그대로 재활용하여
개발 비용을 최소화한다.

---

## 1. 비즈니스 모델 옵션 3가지

### 모델 A — 정액 노출 구독 (Flat-rate Listing)

| 항목 | 내용 |
|------|------|
| 개요 | 업체가 월 고정 요금을 내고 특정 카테고리/지역 파티에 배너·카드 형태로 노출 |
| 업체 장점 | 예측 가능한 광고비, 클릭/전환 여부와 무관하게 브랜드 노출 보장 |
| 수익 구조 | 월 29,000 ~ 99,000원 구독료 (노출 범위·우선순위에 따라 플랜 차등) |
| 적합 업종 | 게스트하우스, 숙박, 액티비티 업체 (지역·카테고리 고정 타겟팅 필요한 곳) |

**플랜 예시**
- 베이직 29,000원/월: 피드 카드 하단 배너 (지역 1개, 카테고리 1개)
- 스탠다드 59,000원/월: 파티 상세 인라인 카드 (지역 3개, 카테고리 3개)
- 프리미엄 99,000원/월: 파티 생성 추천 + 결제 완료 후 오퍼 + 당일 알림

---

### 모델 B — 할인 쿠폰 CPA (Cost Per Redemption)

| 항목 | 내용 |
|------|------|
| 개요 | 업체가 파티 참가자에게 쿠폰/할인 코드를 제공하고, 실제 사용 건당 수수료 지불 |
| 업체 장점 | 사용되지 않은 쿠폰엔 비용 발생 없음. ROI 측정이 명확함 |
| 수익 구조 | 쿠폰 1회 사용당 정산금의 15~20% 플랫폼 수수료 |
| 적합 업종 | 카페, 식당, 렌탈샵, 스파 (쿠폰 기반 유입이 자연스러운 업종) |

---

### 모델 C — 파티 경로 스폰서십 (Route Sponsorship)

| 항목 | 내용 |
|------|------|
| 개요 | 업체가 파티 코스에 자신의 장소를 포함시키는 대가로 고정 or 성과 기반 요금 지불 |
| 업체 장점 | AI 코스 추천에 자연스럽게 삽입. 광고 거부감 최소화 |
| 수익 구조 | 코스 포함 1회당 3,000원 or 월 고정 49,000원 |
| 적합 업종 | 관광지, 체험 업체, 랜드마크 카페, 뷰포인트 주변 업체 |

---

## 2. 파티 플로우별 광고 노출 지점

### 피드 → 상세 → 생성 → 결제 → 당일 알림

각 단계별 파트너 오퍼 노출 방식 (상세 내용은 기획 문서 참조)

---

## 3. 데이터 모델

```typescript
export interface PartnerOffer {
  id: string;
  shopId: string;
  businessName: string;
  businessType: "accommodation" | "cafe" | "activity" | "restaurant" | "attraction" | "rental" | "transport";
  model: "flat_listing" | "cpa_coupon" | "route_sponsor";
  targetCategories: string[];
  targetRegions: string[];
  minMembers?: number;
  headline: string;
  description?: string;
  discountRate?: number;
  couponCode?: string;
  ctaLabel: string;
  ctaUrl: string;
  displaySlots: string[];
  priority: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}
```

---

## 4. MVP 우선순위

### Phase 0 (즉시)
- 더미 파트너 데이터 + UI 컴포넌트
- 파티 상세 파트너 혜택 섹션
- 피드 4번째마다 파트너 배너

### Phase 1 (3~5일)
- `/api/partner-offers` 라우트
- jejupass-promo 대시보드에 파트너 오퍼 등록 메뉴
- Supabase partner_offers 테이블

### Phase 2 (1주)
- AI 코스 추천에 스폰서 장소 포함
- 쿠폰 고유 생성 + 사용 추적

### Phase 3 (2주)
- 월말 자동 정산
- 카카오 알림에 파트너 메시지
- 성과 리포트 대시보드

---

## 5. jejupass-promo 연동

기존 등록 완료 화면에 "파티 파트너 오퍼 설정" 진입점 추가
→ `/dashboard/partner-offer` 신규 라우트 (4단계 폼)

---

## 6. 기존 패턴 재활용

| 기존 구현 | 파트너 프로그램 활용 |
|-----------|---------------------|
| 카페패스 업셀 | 결제완료 후 파트너 쿠폰 표시 동일 패턴 |
| AI 렌터카 CTA | 파트너 숙소/액티비티 카드 동일 디자인 |
| suggest_schedule AI API | 스폰서 장소 우선 포함 |
| jejupass-promo 등록 플로우 | 파트너 오퍼 등록 동일 패턴 확장 |
