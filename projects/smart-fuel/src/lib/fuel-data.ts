// 제주 주요 주유소 더미 데이터 (실제는 공공데이터 API 연동)
export interface GasStation {
  id: string;
  name: string;
  brand: "SK" | "GS" | "현대오일뱅크" | "S-OIL" | "알뜰";
  address: string;
  lat: number;
  lng: number;
  gasoline: number;  // 휘발유 가격 (원/L)
  diesel: number;    // 경유 가격
  selfService: boolean;
  open24h: boolean;
}

export const STATIONS: GasStation[] = [
  { id: "s1", name: "GS칼텍스 제주공항점", brand: "GS", address: "제주시 공항로 12", lat: 33.5060, lng: 126.4938, gasoline: 1685, diesel: 1495, selfService: true, open24h: true },
  { id: "s2", name: "SK에너지 노형점", brand: "SK", address: "제주시 노형동 456", lat: 33.4850, lng: 126.4820, gasoline: 1695, diesel: 1505, selfService: true, open24h: false },
  { id: "s3", name: "현대오일뱅크 서귀포점", brand: "현대오일뱅크", address: "서귀포시 중앙로 789", lat: 33.2530, lng: 126.5610, gasoline: 1710, diesel: 1520, selfService: false, open24h: false },
  { id: "s4", name: "알뜰주유소 애월점", brand: "알뜰", address: "제주시 애월읍 123", lat: 33.4620, lng: 126.3280, gasoline: 1650, diesel: 1460, selfService: true, open24h: false },
  { id: "s5", name: "GS칼텍스 중문점", brand: "GS", address: "서귀포시 중문동 567", lat: 33.2480, lng: 126.4100, gasoline: 1690, diesel: 1500, selfService: true, open24h: true },
  { id: "s6", name: "S-OIL 성산점", brand: "S-OIL", address: "서귀포시 성산읍 890", lat: 33.4580, lng: 126.9260, gasoline: 1705, diesel: 1515, selfService: true, open24h: false },
  { id: "s7", name: "SK에너지 한림점", brand: "SK", address: "제주시 한림읍 234", lat: 33.4100, lng: 126.2650, gasoline: 1700, diesel: 1510, selfService: false, open24h: false },
  { id: "s8", name: "알뜰주유소 함덕점", brand: "알뜰", address: "제주시 조천읍 함덕리", lat: 33.5420, lng: 126.6690, gasoline: 1645, diesel: 1455, selfService: true, open24h: false },
];

// 차종별 연비 데이터
export const CAR_FUEL_EFFICIENCY: Record<string, { kmPerLiter: number; tankCapacity: number; fuelType: "gasoline" | "diesel" }> = {
  "모닝": { kmPerLiter: 15.2, tankCapacity: 35, fuelType: "gasoline" },
  "레이": { kmPerLiter: 13.8, tankCapacity: 35, fuelType: "gasoline" },
  "아반떼": { kmPerLiter: 14.1, tankCapacity: 47, fuelType: "gasoline" },
  "쏘나타": { kmPerLiter: 16.5, tankCapacity: 60, fuelType: "gasoline" },
  "투싼": { kmPerLiter: 13.5, tankCapacity: 54, fuelType: "diesel" },
  "카니발": { kmPerLiter: 10.8, tankCapacity: 72, fuelType: "diesel" },
  "팰리세이드": { kmPerLiter: 11.2, tankCapacity: 71, fuelType: "diesel" },
  "EV6": { kmPerLiter: 0, tankCapacity: 0, fuelType: "gasoline" }, // 전기차
};

// 주유 필요량 계산
export function calculateFuel(carName: string, currentFuelPercent: number, distanceToReturn: number) {
  const car = CAR_FUEL_EFFICIENCY[carName];
  if (!car || car.fuelType === "gasoline" && carName === "EV6") {
    return { needed: 0, cost: 0, message: "전기차는 주유가 필요 없습니다." };
  }

  const currentFuelLiters = car.tankCapacity * (currentFuelPercent / 100);
  const fuelForTrip = distanceToReturn / car.kmPerLiter;
  const targetFuel = car.tankCapacity; // 만충전
  const neededLiters = Math.max(0, targetFuel - currentFuelLiters + fuelForTrip);

  return {
    needed: Math.ceil(neededLiters),
    tankCapacity: car.tankCapacity,
    fuelType: car.fuelType,
    currentLiters: Math.round(currentFuelLiters),
  };
}
