export function generateId(): string {
  return crypto.randomUUID();
}

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣-]/g, '')
    .slice(0, 30);
  const suffix = generateId().slice(0, 6);
  return `${base}-${suffix}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

export function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    cafe: '☕', restaurant: '🍽️', dessert: '🧁',
    bakery: '🍞', brunch: '🥂', bar: '🍸', etc: '📦',
  };
  return map[category] || '📦';
}
