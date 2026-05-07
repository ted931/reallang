import type { ShopCategory, ShopRegion } from './types';

export const CATEGORIES: { value: ShopCategory; label: string; emoji: string; group: string }[] = [
  // 카페·음료
  { value: 'cafe', label: '카페', emoji: '☕', group: '카페·음료' },
  { value: 'dessert', label: '디저트', emoji: '🧁', group: '카페·음료' },
  { value: 'bakery', label: '베이커리', emoji: '🍞', group: '카페·음료' },
  { value: 'brunch', label: '브런치', emoji: '🥂', group: '카페·음료' },
  { value: 'bar', label: '바·술집', emoji: '🍸', group: '카페·음료' },
  // 음식
  { value: 'restaurant', label: '맛집', emoji: '🍽️', group: '음식' },
  { value: 'seafood', label: '해산물', emoji: '🦐', group: '음식' },
  { value: 'blackpork', label: '흑돼지', emoji: '🥩', group: '음식' },
  { value: 'korean', label: '한식', emoji: '🍚', group: '음식' },
  { value: 'japanese', label: '일식', emoji: '🍱', group: '음식' },
  { value: 'western', label: '양식', emoji: '🍝', group: '음식' },
  { value: 'chinese', label: '중식', emoji: '🥢', group: '음식' },
  { value: 'snack', label: '분식', emoji: '🍢', group: '음식' },
  { value: 'noodle', label: '국수·라멘', emoji: '🍜', group: '음식' },
  // 숙박
  { value: 'pension', label: '펜션', emoji: '🏡', group: '숙박' },
  { value: 'guesthouse', label: '게스트하우스', emoji: '🏠', group: '숙박' },
  // 액티비티
  { value: 'surfing', label: '서핑', emoji: '🏄', group: '액티비티' },
  { value: 'activity', label: '액티비티', emoji: '🎯', group: '액티비티' },
  { value: 'experience', label: '체험', emoji: '🌿', group: '액티비티' },
  { value: 'fishing', label: '낚시', emoji: '🎣', group: '액티비티' },
  { value: 'cycling', label: '자전거', emoji: '🚴', group: '액티비티' },
  // 기타
  { value: 'spa', label: '스파·마사지', emoji: '💆', group: '기타' },
  { value: 'shopping', label: '쇼핑', emoji: '🛍️', group: '기타' },
  { value: 'souvenir', label: '기념품', emoji: '🎁', group: '기타' },
  { value: 'market', label: '시장', emoji: '🏪', group: '기타' },
  { value: 'etc', label: '기타', emoji: '📦', group: '기타' },
];

export const REGIONS: { value: ShopRegion; label: string }[] = [
  { value: 'jeju-si', label: '제주시' },
  { value: 'seogwipo', label: '서귀포' },
  { value: 'aewol', label: '애월' },
  { value: 'hallim', label: '한림' },
  { value: 'hamdeok', label: '함덕' },
  { value: 'seongsan', label: '성산' },
  { value: 'jungmun', label: '중문' },
  { value: 'udo', label: '우도' },
  { value: 'moseulpo', label: '모슬포' },
  { value: 'namwon', label: '남원' },
  { value: 'pyoseon', label: '표선' },
  { value: 'jocheon', label: '조천' },
  { value: 'gujwa', label: '구좌' },
  { value: 'andeok', label: '안덕' },
  { value: 'daejeong', label: '대정' },
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
