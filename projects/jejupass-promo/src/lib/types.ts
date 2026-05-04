export type ShopCategory = 'cafe' | 'restaurant' | 'dessert' | 'bakery' | 'brunch' | 'bar' | 'etc';
export type ShopRegion = 'jeju-si' | 'seogwipo' | 'aewol' | 'hallim' | 'hamdeok' | 'seongsan' | 'jungmun';

export interface ShopPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface VisitorPhoto {
  id: string;
  url: string;
  nickname?: string;
  uploadedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  nickname: string;
  photoUrl?: string;
  createdAt: string;
}

export interface ShopMenu {
  id: string;
  name: string;
  price: number;
  description?: string;
  isPopular: boolean;
  photoUrl?: string;
}

export interface InstagramConfig {
  token: string;
  userId: string;   // Instagram Business Account ID
  username: string; // 표시용
  connectedAt: string;
}

export interface ShopStats {
  views: number;
  viewsByMonth: Record<string, number>; // "2026-05" → count
}

export interface Shop {
  id: string;
  slug: string;
  name: string;
  category: ShopCategory;
  region: ShopRegion;
  description: string;
  address: string;
  phone: string;
  businessHours: Record<string, string>;
  photos: ShopPhoto[];
  visitorPhotos?: VisitorPhoto[];
  reviews?: Review[];
  menus: ShopMenu[];
  isPublished: boolean;
  notices?: Notice[];
  instagram?: InstagramConfig;
  stats?: ShopStats;
  createdAt: string;
  updatedAt: string;
}

export type ShopCreateInput = Omit<Shop, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // 프로토타입 — plain text
  phone: string;
  businessNumber: string;
  shopIds: string[];
  createdAt: string;
}

export interface Notice {
  id: string;
  content: string;
  createdAt: string;
}

export interface SNSCardRequest {
  shopId: string;
  photoUrl: string;
  template: 'instagram-square' | 'instagram-story' | 'kakao' | 'cafepass-card';
  caption?: string;
  shopName?: string;
  category?: string;
  region?: string;
}

export interface CaptionRequest {
  shopName: string;
  category: string;
  region: string;
  description?: string;
  menuHighlights?: string[];
}

export interface CaptionResponse {
  caption: string;
  hashtags: string[];
}
