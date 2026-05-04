export interface CarType {
  id: string;
  name: string;
  category: '소형' | '준중형' | '중형' | 'SUV' | '승합' | '전기';
  seats: number;
  trunkCapacity: string;
  fuelType: '가솔린' | '디젤' | '하이브리드' | '전기';
  pricePerDay: number;
  emoji: string;
  features: string[];
  bestFor: string[];
  kmPerLiter?: number;
}

export const CARS: CarType[] = [
  {
    id: 'morning',
    name: '기아 모닝',
    category: '소형',
    seats: 4,
    trunkCapacity: '캐리어 1개',
    fuelType: '가솔린',
    pricePerDay: 30000,
    emoji: '🚗',
    features: ['주차 편리', '연비 좋음', '시내 이동 최적'],
    bestFor: ['1~2인', '짐 적음', '시내 위주'],
    kmPerLiter: 14,
  },
  {
    id: 'ray',
    name: '기아 레이',
    category: '소형',
    seats: 4,
    trunkCapacity: '캐리어 1~2개',
    fuelType: '가솔린',
    pricePerDay: 33000,
    emoji: '🚙',
    features: ['높은 천장', '넓은 실내', '짐 의외로 많이'],
    bestFor: ['1~2인', '캠핑 느낌', '가성비'],
    kmPerLiter: 13,
  },
  {
    id: 'avante',
    name: '현대 아반떼',
    category: '준중형',
    seats: 5,
    trunkCapacity: '캐리어 2개',
    fuelType: '가솔린',
    pricePerDay: 39000,
    emoji: '🚘',
    features: ['가성비', '편안한 승차감', '고속도로 안정'],
    bestFor: ['2~3인', '일반 여행', '가성비'],
    kmPerLiter: 13,
  },
  {
    id: 'sonata',
    name: '현대 쏘나타',
    category: '중형',
    seats: 5,
    trunkCapacity: '캐리어 3개',
    fuelType: '하이브리드',
    pricePerDay: 55000,
    emoji: '🚘',
    features: ['넓은 실내', '하이브리드 연비', '장거리 편안'],
    bestFor: ['3~4인', '장거리', '편안함 중시'],
    kmPerLiter: 20,
  },
  {
    id: 'tucson',
    name: '현대 투싼',
    category: 'SUV',
    seats: 5,
    trunkCapacity: '캐리어 3개 + 배낭',
    fuelType: '디젤',
    pricePerDay: 59000,
    emoji: '🚐',
    features: ['넓은 트렁크', '비포장 가능', '높은 시야'],
    bestFor: ['3~4인', '올레길/등산', '짐 많음'],
    kmPerLiter: 15,
  },
  {
    id: 'sportage',
    name: '기아 스포티지',
    category: 'SUV',
    seats: 5,
    trunkCapacity: '캐리어 3개',
    fuelType: '하이브리드',
    pricePerDay: 62000,
    emoji: '🚙',
    features: ['하이브리드 SUV', '세련된 디자인', '연비+공간 밸런스'],
    bestFor: ['2~4인', '드라이브', '연비 중시'],
    kmPerLiter: 17,
  },
  {
    id: 'carnival',
    name: '기아 카니발',
    category: '승합',
    seats: 9,
    trunkCapacity: '캐리어 5개+',
    fuelType: '디젤',
    pricePerDay: 89000,
    emoji: '🚌',
    features: ['9인승', '대가족', '짐 무제한'],
    bestFor: ['5인 이상', '가족여행', '짐 매우 많음'],
    kmPerLiter: 12,
  },
  {
    id: 'staria',
    name: '현대 스타리아',
    category: '승합',
    seats: 9,
    trunkCapacity: '캐리어 5개+',
    fuelType: '디젤',
    pricePerDay: 95000,
    emoji: '🚐',
    features: ['프리미엄 승합', '넓은 공간', '미래적 디자인'],
    bestFor: ['5인 이상', '프리미엄 단체', '짐 많은 가족'],
    kmPerLiter: 11,
  },
];
