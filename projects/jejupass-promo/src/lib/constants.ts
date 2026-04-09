import type { ShopCategory, ShopRegion } from './types';

export const CATEGORIES: { value: ShopCategory; label: string; emoji: string }[] = [
  { value: 'cafe', label: '카페', emoji: '☕' },
  { value: 'restaurant', label: '맛집', emoji: '🍽️' },
  { value: 'dessert', label: '디저트', emoji: '🧁' },
  { value: 'bakery', label: '베이커리', emoji: '🍞' },
  { value: 'brunch', label: '브런치', emoji: '🥂' },
  { value: 'bar', label: '바', emoji: '🍸' },
  { value: 'etc', label: '기타', emoji: '📦' },
];

export const REGIONS: { value: ShopRegion; label: string }[] = [
  { value: 'jeju-si', label: '제주시' },
  { value: 'seogwipo', label: '서귀포' },
  { value: 'aewol', label: '애월' },
  { value: 'hallim', label: '한림' },
  { value: 'hamdeok', label: '함덕' },
  { value: 'seongsan', label: '성산' },
  { value: 'jungmun', label: '중문' },
];

export const CATEGORY_MAP: Record<ShopCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
) as Record<ShopCategory, string>;

export const REGION_MAP: Record<ShopRegion, string> = Object.fromEntries(
  REGIONS.map((r) => [r.value, r.label])
) as Record<ShopRegion, string>;

export const BRAND = {
  name: '제주패스',
  color: '#FF6B35',
  colorDark: '#E55A2B',
  colorLight: '#FFF3ED',
  blue: '#2563EB',
  gray: '#6B7280',
  url: 'jejupass.com',
} as const;

export const DAYS_KR: Record<string, string> = {
  mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일',
};
