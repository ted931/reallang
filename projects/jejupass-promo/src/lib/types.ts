export type ShopCategory = 'cafe' | 'restaurant' | 'dessert' | 'bakery' | 'brunch' | 'bar' | 'etc';
export type ShopRegion = 'jeju-si' | 'seogwipo' | 'aewol' | 'hallim' | 'hamdeok' | 'seongsan' | 'jungmun';

export interface ShopPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ShopMenu {
  id: string;
  name: string;
  price: number;
  description?: string;
  isPopular: boolean;
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
  menus: ShopMenu[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ShopCreateInput = Omit<Shop, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;

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
