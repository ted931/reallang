import { promises as fs } from 'fs';
import path from 'path';
import type { Shop } from './types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SHOPS_FILE = path.join(DATA_DIR, 'shops.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function getShops(): Promise<Shop[]> {
  try {
    const data = await fs.readFile(SHOPS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const shops = await getShops();
  return shops.find((s) => s.slug === slug) || null;
}

export async function getShopById(id: string): Promise<Shop | null> {
  const shops = await getShops();
  return shops.find((s) => s.id === id) || null;
}

export async function createShop(shop: Shop): Promise<Shop> {
  await ensureDataDir();
  const shops = await getShops();
  shops.push(shop);
  await fs.writeFile(SHOPS_FILE, JSON.stringify(shops, null, 2), 'utf-8');
  return shop;
}

export async function updateShop(id: string, updates: Partial<Shop>): Promise<Shop | null> {
  const shops = await getShops();
  const idx = shops.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  shops[idx] = { ...shops[idx], ...updates, updatedAt: new Date().toISOString() };
  await fs.writeFile(SHOPS_FILE, JSON.stringify(shops, null, 2), 'utf-8');
  return shops[idx];
}

export async function filterShops(opts: {
  category?: string;
  region?: string;
  q?: string;
}): Promise<Shop[]> {
  let shops = await getShops();
  shops = shops.filter((s) => s.isPublished);

  if (opts.category) {
    shops = shops.filter((s) => s.category === opts.category);
  }
  if (opts.region) {
    shops = shops.filter((s) => s.region === opts.region);
  }
  if (opts.q) {
    const q = opts.q.toLowerCase();
    shops = shops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }
  return shops;
}
