/**
 * sessionStorage 기반 탭 간 데이터 공유
 * 차종추천 → 주유가이드/비용계산으로 선택 차종 전달
 */

const KEY = "jcar_selected";

export interface SelectedCar {
  carId: string;
  carName: string;
  pricePerDay: number;
  fuelType: string;
  days: number;
}

export function saveSelectedCar(data: SelectedCar) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function loadSelectedCar(): SelectedCar | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
