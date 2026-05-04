'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BRAND, CATEGORIES, REGIONS, DAYS_KR } from '@/lib/constants';
import type { Shop, ShopMenu, Notice } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

type Tab = 'info' | 'hours' | 'menu' | 'photos' | 'notice';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'info', label: '기본 정보', icon: '📋' },
  { key: 'hours', label: '영업시간', icon: '🕐' },
  { key: 'menu', label: '메뉴', icon: '🍽️' },
  { key: 'photos', label: '사진', icon: '📷' },
  { key: 'notice', label: '공지', icon: '📢' },
];

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── 탭 1: 기본 정보 ─────────────────────────────────────────────────────────
function TabInfo({ shop, onSaved }: { shop: Shop; onSaved: (s: Shop) => void }) {
  const [form, setForm] = useState({
    name: shop.name,
    category: shop.category,
    region: shop.region,
    address: shop.address,
    phone: shop.phone,
    description: shop.description,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        onSaved(data.shop);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">가게명</label>
        <input
          name="name" type="text" value={form.name} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
          <select
            name="region" value={form.region} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
        <input
          name="address" type="text" value={form.address} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
        <input
          name="phone" type="tel" value={form.phone} onChange={handleChange}
          placeholder="064-000-0000"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">가게 소개</label>
        <textarea
          name="description" value={form.description} onChange={handleChange}
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND.color }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✅ 저장되었습니다</span>}
      </div>
    </div>
  );
}

// ─── 탭 2: 영업시간 ────────────────────────────────────────────────────────────
function TabHours({ shop, onSaved }: { shop: Shop; onSaved: (s: Shop) => void }) {
  const [hours, setHours] = useState<Record<string, string>>(() => {
    const h: Record<string, string> = {};
    for (const day of DAYS) {
      h[day] = shop.businessHours[day] || '09:00-18:00';
    }
    return h;
  });
  const [closed, setClosed] = useState<Record<string, boolean>>(() => {
    const c: Record<string, boolean> = {};
    for (const day of DAYS) {
      c[day] = shop.businessHours[day] === '휴무';
    }
    return c;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function parseTime(val: string, part: 'start' | 'end') {
    const parts = val.split('-');
    return part === 'start' ? (parts[0] || '09:00') : (parts[1] || '18:00');
  }

  function setTime(day: string, part: 'start' | 'end', value: string) {
    setHours((prev) => {
      const current = prev[day] || '09:00-18:00';
      const parts = current.split('-');
      const start = parts[0] || '09:00';
      const end = parts[1] || '18:00';
      return {
        ...prev,
        [day]: part === 'start' ? `${value}-${end}` : `${start}-${value}`,
      };
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const businessHours: Record<string, string> = {};
    for (const day of DAYS) {
      businessHours[day] = closed[day] ? '휴무' : hours[day];
    }
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessHours }),
      });
      if (res.ok) {
        const data = await res.json();
        onSaved(data.shop);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">요일별 영업 시간을 설정하세요. 휴무일은 체크하세요.</p>

      <div className="space-y-3">
        {DAYS.map((day) => (
          <div key={day} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
            <span className="w-8 text-sm font-semibold text-gray-700">{DAYS_KR[day]}</span>
            {closed[day] ? (
              <span className="flex-1 text-sm text-gray-400 italic">휴무</span>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={parseTime(hours[day], 'start')}
                  onChange={(e) => setTime(day, 'start', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-28"
                />
                <span className="text-gray-400 text-sm">~</span>
                <input
                  type="time"
                  value={parseTime(hours[day], 'end')}
                  onChange={(e) => setTime(day, 'end', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-28"
                />
              </div>
            )}
            <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={closed[day]}
                onChange={(e) => { setClosed((prev) => ({ ...prev, [day]: e.target.checked })); setSaved(false); }}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
              />
              <span className="text-xs text-gray-500">휴무</span>
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND.color }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✅ 저장되었습니다</span>}
      </div>
    </div>
  );
}

// ─── 탭 3: 메뉴 ───────────────────────────────────────────────────────────────
function TabMenu({ shop, onSaved }: { shop: Shop; onSaved: (s: Shop) => void }) {
  const [menus, setMenus] = useState<ShopMenu[]>(shop.menus || []);
  const [newMenu, setNewMenu] = useState({ name: '', price: '', isPopular: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; price: string; isPopular: boolean }>({ name: '', price: '', isPopular: false });
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const photoRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function startEdit(menu: ShopMenu) {
    setEditingId(menu.id);
    setEditForm({ name: menu.name, price: String(menu.price), isPopular: menu.isPopular });
  }

  function saveEdit(id: string) {
    setMenus((prev) => prev.map((m) => m.id === id
      ? { ...m, name: editForm.name, price: Number(editForm.price) || 0, isPopular: editForm.isPopular }
      : m));
    setEditingId(null);
    setSaved(false);
  }

  function deleteMenu(id: string) {
    setMenus((prev) => prev.filter((m) => m.id !== id));
    setSaved(false);
  }

  function addMenu() {
    if (!newMenu.name.trim()) return;
    setMenus((prev) => [...prev, {
      id: genId(),
      name: newMenu.name.trim(),
      price: Number(newMenu.price) || 0,
      isPopular: newMenu.isPopular,
    }]);
    setNewMenu({ name: '', price: '', isPopular: false });
    setSaved(false);
  }

  async function handleMenuPhotoUpload(menuId: string, file: File) {
    setUploadingId(menuId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('shopId', shop.id);
      const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setMenus((prev) => prev.map((m) => m.id === menuId ? { ...m, photoUrl: data.url } : m));
        setSaved(false);
      }
    } finally {
      setUploadingId(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menus }),
      });
      if (res.ok) {
        const data = await res.json();
        onSaved(data.shop);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {menus.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">등록된 메뉴가 없습니다.</p>
        )}
        {menus.map((menu) => (
          <div key={menu.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex gap-3 p-3">
              {/* 메뉴 사진 */}
              <div
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer group"
                onClick={() => photoRefs.current[menu.id]?.click()}
              >
                {menu.photoUrl ? (
                  <>
                    <img src={menu.photoUrl} alt={menu.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-semibold">변경</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 group-hover:bg-gray-300 transition-colors">
                    {uploadingId === menu.id ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-lg text-gray-400">📷</span>
                        <span className="text-[9px] text-gray-400">사진 추가</span>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={(el) => { photoRefs.current[menu.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleMenuPhotoUpload(menu.id, f);
                    e.target.value = '';
                  }}
                />
              </div>

              {/* 메뉴 정보 */}
              <div className="flex-1 min-w-0">
                {editingId === menu.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text" value={editForm.name}
                        onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="메뉴명"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <input
                        type="number" value={editForm.price}
                        onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                        placeholder="가격"
                        className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600">
                        <input type="checkbox" checked={editForm.isPopular}
                          onChange={(e) => setEditForm((p) => ({ ...p, isPopular: e.target.checked }))}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500"
                        />
                        인기 메뉴
                      </label>
                      <div className="flex gap-1.5">
                        <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg">취소</button>
                        <button onClick={() => saveEdit(menu.id)} className="text-xs font-semibold text-white px-2.5 py-1 rounded-lg" style={{ backgroundColor: BRAND.color }}>확인</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {menu.isPopular && <span className="text-[10px] font-semibold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">인기</span>}
                        <span className="text-sm font-semibold text-gray-800">{menu.name}</span>
                      </div>
                      <span className="text-sm text-gray-500 mt-0.5 block">{menu.price.toLocaleString()}원</span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button onClick={() => startEdit(menu)} className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-white transition-colors">수정</button>
                      <button onClick={() => deleteMenu(menu.id)} className="text-xs text-red-400 border border-red-100 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors">삭제</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 새 메뉴 추가 */}
      <div className="bg-white rounded-xl border border-dashed border-orange-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">새 메뉴 추가</p>
        <div className="flex gap-3">
          <input
            type="text" value={newMenu.name}
            onChange={(e) => setNewMenu((p) => ({ ...p, name: e.target.value }))}
            placeholder="메뉴명 (예: 아메리카노)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="number" value={newMenu.price}
            onChange={(e) => setNewMenu((p) => ({ ...p, price: e.target.value }))}
            placeholder="가격"
            className="w-28 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={newMenu.isPopular}
              onChange={(e) => setNewMenu((p) => ({ ...p, isPopular: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
            />
            인기 메뉴로 표시
          </label>
          <button onClick={addMenu} disabled={!newMenu.name.trim()}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-50"
            style={{ backgroundColor: BRAND.color }}
          >
            + 추가
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: BRAND.color }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✅ 저장되었습니다</span>}
      </div>
    </div>
  );
}

// ─── 탭 4: 사진 ───────────────────────────────────────────────────────────────
function TabPhotos({ shop, onSaved }: { shop: Shop; onSaved: (s: Shop) => void }) {
  const [photos, setPhotos] = useState(shop.photos || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        const newPhoto = { id: genId(), url: data.url, isPrimary: photos.length === 0 };
        setPhotos((prev) => [...prev, newPhoto]);
        setSaved(false);
      }
    } finally {
      setUploading(false);
    }
  }

  function setPrimary(id: string) {
    setPhotos((prev) => prev.map((p) => ({ ...p, isPrimary: p.id === id })));
    setSaved(false);
  }

  function deletePhoto(id: string) {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      // 대표사진 삭제 시 첫 번째가 대표로
      if (next.length > 0 && !next.some((p) => p.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos }),
      });
      if (res.ok) {
        const data = await res.json();
        onSaved(data.shop);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100">
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
            {photo.isPrimary && (
              <span className="absolute top-2 left-2 text-xs font-semibold text-white bg-orange-500 px-2 py-0.5 rounded-full">
                대표
              </span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!photo.isPrimary && (
                <button
                  onClick={() => setPrimary(photo.id)}
                  className="text-xs font-semibold text-white bg-orange-500/80 px-2.5 py-1.5 rounded-lg hover:bg-orange-500 transition-colors"
                >
                  대표 설정
                </button>
              )}
              <button
                onClick={() => deletePhoto(photo.id)}
                className="text-xs font-semibold text-white bg-red-500/80 px-2.5 py-1.5 rounded-lg hover:bg-red-500 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        {/* 업로드 버튼 */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-2xl">+</span>
              <span className="text-xs text-orange-600 font-medium">사진 추가</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND.color }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✅ 저장되었습니다</span>}
      </div>
    </div>
  );
}

// ─── 탭 5: 공지 ───────────────────────────────────────────────────────────────
function TabNotice({ shop, onSaved }: { shop: Shop; onSaved: (s: Shop) => void }) {
  const [notices, setNotices] = useState<Notice[]>(shop.notices || []);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addNotice() {
    if (!newContent.trim()) return;
    const notice: Notice = {
      id: genId(),
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotices((prev) => [notice, ...prev]);
    setNewContent('');
    setSaved(false);
  }

  function deleteNotice(id: string) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setSaved(false);
  }

  function saveEdit(id: string) {
    setNotices((prev) => prev.map((n) => n.id === id ? { ...n, content: editContent } : n));
    setEditingId(null);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notices }),
      });
      if (res.ok) {
        const data = await res.json();
        onSaved(data.shop);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* 새 공지 등록 */}
      <div className="bg-white rounded-xl border border-dashed border-orange-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">새 공지 등록</p>
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="고객에게 전달할 공지 내용을 입력하세요. (예: 7월 15일 정기 휴무 안내)"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={addNotice}
            disabled={!newContent.trim()}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND.color }}
          >
            공지 추가
          </button>
        </div>
      </div>

      {/* 기존 공지 목록 */}
      <div className="space-y-3">
        {notices.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">등록된 공지가 없습니다.</p>
        )}
        {notices.map((notice) => (
          <div key={notice.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            {editingId === notice.id ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none bg-white"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg">
                    취소
                  </button>
                  <button
                    onClick={() => saveEdit(notice.id)}
                    className="text-sm font-semibold text-white px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: BRAND.color }}
                  >
                    확인
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-relaxed">{notice.content}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setEditingId(notice.id); setEditContent(notice.content); }}
                    className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteNotice(notice.id)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND.color }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✅ 저장되었습니다</span>}
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function ShopEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('info');

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE}/api/shops/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.shop) setShop(data.shop); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">가게를 찾을 수 없습니다.</p>
        <Link href="/dashboard" className="text-sm font-semibold" style={{ color: BRAND.color }}>← 대시보드로</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-100 sticky top-10 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="뒤로가기"
            >
              ←
            </button>
            <div>
              <span className="font-bold text-gray-900">{shop.name}</span>
              <span className="ml-2 text-xs text-gray-400">가게 관리</span>
            </div>
          </div>
          <Link
            href={`/shop/${shop.slug}`}
            target="_blank"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            가게 페이지 보기 →
          </Link>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-100 sticky top-24 z-30">
        <div className="max-w-3xl mx-auto px-4">
          <nav className="flex overflow-x-auto" role="tablist" aria-label="가게 관리 탭">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {activeTab === 'info' && <TabInfo shop={shop} onSaved={setShop} />}
          {activeTab === 'hours' && <TabHours shop={shop} onSaved={setShop} />}
          {activeTab === 'menu' && <TabMenu shop={shop} onSaved={setShop} />}
          {activeTab === 'photos' && <TabPhotos shop={shop} onSaved={setShop} />}
          {activeTab === 'notice' && <TabNotice shop={shop} onSaved={setShop} />}
        </div>
      </div>
    </div>
  );
}
