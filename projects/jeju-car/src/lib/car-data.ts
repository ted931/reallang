export interface CarType {
  id: string;
  name: string;
  category: "소형" | "준중형" | "중형" | "SUV" | "승합" | "수입";
  seats: number;
  trunkCapacity: string;
  fuelType: "가솔린" | "디젤" | "하이브리드" | "전기";
  pricePerDay: number;
  image: string;
  features: string[];
  bestFor: string[];
}

export const CARS: CarType[] = [
  {
    id: "morning", name: "기아 모닝", category: "소형", seats: 4,
    trunkCapacity: "캐리어 1개", fuelType: "가솔린", pricePerDay: 30000,
    image: "🚗", features: ["주차 편리", "연비 좋음", "시내 이동 최적"],
    bestFor: ["1~2인", "짐 적음", "시내 위주"],
  },
  {
    id: "avante", name: "현대 아반떼", category: "준중형", seats: 5,
    trunkCapacity: "캐리어 2개", fuelType: "가솔린", pricePerDay: 39000,
    image: "🚙", features: ["가성비", "편안한 승차감", "고속도로 안정"],
    bestFor: ["2~3인", "일반 여행", "가성비"],
  },
  {
    id: "sonata", name: "현대 쏘나타", category: "중형", seats: 5,
    trunkCapacity: "캐리어 3개", fuelType: "하이브리드", pricePerDay: 55000,
    image: "🚘", features: ["넓은 실내", "하이브리드 연비", "장거리 편안"],
    bestFor: ["3~4인", "장거리", "편안함 중시"],
  },
  {
    id: "tucson", name: "현대 투싼", category: "SUV", seats: 5,
    trunkCapacity: "캐리어 3개 + 배낭", fuelType: "디젤", pricePerDay: 59000,
    image: "🚐", features: ["넓은 트렁크", "비포장 가능", "높은 시야"],
    bestFor: ["3~4인", "올레길/등산", "짐 많음"],
  },
  {
    id: "carnival", name: "기아 카니발", category: "승합", seats: 9,
    trunkCapacity: "캐리어 5개+", fuelType: "디젤", pricePerDay: 89000,
    image: "🚌", features: ["9인승", "대가족", "짐 무제한"],
    bestFor: ["5인 이상", "가족여행", "짐 매우 많음"],
  },
  {
    id: "ray", name: "기아 레이", category: "소형", seats: 4,
    trunkCapacity: "캐리어 1~2개", fuelType: "가솔린", pricePerDay: 33000,
    image: "🚗", features: ["높은 천장", "넓은 실내", "짐 의외로 많이"],
    bestFor: ["1~2인", "캠핑 느낌", "가성비"],
  },
  {
    id: "ev6", name: "기아 EV6", category: "수입", seats: 5,
    trunkCapacity: "캐리어 2개 + 프렁크", fuelType: "전기", pricePerDay: 75000,
    image: "⚡", features: ["전기차", "조용함", "충전 인프라 양호"],
    bestFor: ["2~3인", "친환경", "제주 전기차 충전소 많음"],
  },
  {
    id: "palisade", name: "현대 팰리세이드", category: "SUV", seats: 7,
    trunkCapacity: "캐리어 4개+", fuelType: "디젤", pricePerDay: 99000,
    image: "🛻", features: ["7인승", "프리미엄", "최대 공간"],
    bestFor: ["4~6인", "프리미엄 여행", "가족+짐 많음"],
  },
];
