'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BRAND, CATEGORIES, REGIONS, DAYS_KR } from '@/lib/constants';
import type { Shop, ShopMenu, Notice } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

type Tab = 'info' | 'hours' | 'menu' | 'photos' | 'notice';

const TABS: { key: Tab; label: string; icon: string; sub: string }[] = [
  { key: 'info',    label: '기본 정보',     icon: '📋', sub: '상호·카테고리·소개' },
  { key: 'hours',   label: '영업시간',       icon: '🕐', sub: '요일별 영업·휴무' },
  { key: 'menu',    label: '메뉴',           icon: '🍽️', sub: '메뉴 등록 / 수정' },
  { key: 'photos',  label: '사진 관리',      icon: '📷', sub: '대표 / 메뉴 / 분위기' },
  { key: 'notice',  label: '공지',           icon: '📢', sub: '사장님 공지' },
];

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── 탭 1: 기본 정보 ─────────────────────────────────────────────────────────
function TabInfo({ shop, onSaved }: { shop: Shop; onSaved: (s: Shop) => void }) {
  const [form, setForm] = useState({
    name: shop.name, category: shop.category, region: shop.region,
    address: shop.address, phone: shop.phone, description: shop.description,
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
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (res.ok) { const data = await res.json(); onSaved(data.shop); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-extrabold text-slate-900">기본 정보</h3>

      {/* 상호명 */}
      <FieldBlock label="상호명">
        <input name="name" type="text" value={form.name} onChange={handleChange}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </FieldBlock>

      <div className="grid grid-cols-2 gap-4">
        <FieldBlock label="카테고리">
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
        </FieldBlock>
        <FieldBlock label="지역">
          <select name="region" value={form.region} onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
            {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </FieldBlock>
      </div>

      <FieldBlock label="주소">
        <input name="address" type="text" value={form.address} onChange={handleChange}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </FieldBlock>

      <FieldBlock label="전화번호">
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="064-000-0000"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </FieldBlock>

      <FieldBlock label="가게 소개">
        <textarea name="description" value={form.description} onChange={handleChange} rows={4}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
      </FieldBlock>

      <SaveRow saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

// ─── 탭 2: 영업시간 ────────────────────────────────────────────────────────────
function TabHours({ shop, onSaved }: { shop: Shop; onSaved: (s: Shop) => void }) {
  const [hours, setHours] = useState<Record<string, string>>(() => {
    const h: Record<string, string> = {};
    for (const day of DAYS) h[day] = shop.businessHours[day] || '09:00-18:00';
    return h;
  });
  const [closed, setClosed] = useState<Record<string, boolean>>(() => {
    const c: Record<string, boolean> = {};
    for (const day of DAYS) c[day] = shop.businessHours[day] === '휴무';
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
      const cur = prev[day] || '09:00-18:00'; const parts = cur.split('-');
      return { ...prev, [day]: part === 'start' ? `${value}-${parts[1] || '18:00'}` : `${parts[0] || '09:00'}-${value}` };
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const businessHours: Record<string, string> = {};
    for (const day of DAYS) businessHours[day] = closed[day] ? '휴무' : hours[day];
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessHours }),
      });
      if (res.ok) { const data = await res.json(); onSaved(data.shop); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-slate-900">영업시간 / 휴무</h3>
      <p className="text-xs text-slate-500">요일별로 영업시간을 다르게 설정할 수 있어요</p>
      <div className="space-y-1.5">
        {DAYS.map((day) => (
          <div key={day}
            className={`flex items-center gap-3 p-3 rounded-xl border ${closed[day] ? 'border-slate-100 bg-slate-50' : 'border-slate-200 bg-white'}`}>
            <span className="w-8 text-sm font-extrabold text-slate-700">{DAYS_KR[day]}</span>
            <button
              onClick={() => { setClosed((prev) => ({ ...prev, [day]: !prev[day] })); setSaved(false); }}
              className={`px-2 py-1 font-mono text-[10px] rounded font-extrabold transition-colors ${
                closed[day] ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-700'
              }`}>
              {closed[day] ? '휴무' : '영업'}
            </button>
            {closed[day] ? (
              <span className="flex-1 text-center text-sm text-slate-400">정기 휴무</span>
            ) : (
              <>
                <input type="time" value={parseTime(hours[day], 'start')} onChange={(e) => setTime(day, 'start', e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300 text-center" />
                <span className="text-slate-400 text-sm">—</span>
                <input type="time" value={parseTime(hours[day], 'end')} onChange={(e) => setTime(day, 'end', e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300 text-center" />
              </>
            )}
          </div>
        ))}
      </div>
      <SaveRow saving={saving} saved={saved} onSave={handleSave} />
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
    setMenus((prev) => prev.map((m) => m.id === id ? { ...m, name: editForm.name, price: Number(editForm.price) || 0, isPopular: editForm.isPopular } : m));
    setEditingId(null); setSaved(false);
  }
  function deleteMenu(id: string) { setMenus((prev) => prev.filter((m) => m.id !== id)); setSaved(false); }
  function addMenu() {
    if (!newMenu.name.trim()) return;
    setMenus((prev) => [...prev, { id: genId(), name: newMenu.name.trim(), price: Number(newMenu.price) || 0, isPopular: newMenu.isPopular }]);
    setNewMenu({ name: '', price: '', isPopular: false }); setSaved(false);
  }

  async function handleMenuPhotoUpload(menuId: string, file: File) {
    setUploadingId(menuId);
    try {
      const formData = new FormData(); formData.append('file', file); formData.append('shopId', shop.id);
      const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: formData });
      if (res.ok) { const data = await res.json(); setMenus((prev) => prev.map((m) => m.id === menuId ? { ...m, photoUrl: data.url } : m)); setSaved(false); }
    } finally { setUploadingId(null); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ menus }),
      });
      if (res.ok) { const data = await res.json(); onSaved(data.shop); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900">메뉴 · {menus.length}개</h3>
        <span className="text-xs font-mono text-slate-400">클릭해서 수정</span>
      </div>

      <div className="space-y-2">
        {menus.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">등록된 메뉴가 없습니다.</p>
        )}
        {menus.map((menu) => (
          <div key={menu.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex gap-3 p-3">
              <div
                className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 cursor-pointer group"
                onClick={() => photoRefs.current[menu.id]?.click()}
              >
                {menu.photoUrl ? (
                  <>
                    <img src={menu.photoUrl} alt={menu.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">변경</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 group-hover:bg-slate-300 transition-colors">
                    {uploadingId === menu.id ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-base text-slate-400">📷</span>
                        <span className="text-[8px] text-slate-400">사진</span>
                      </>
                    )}
                  </div>
                )}
                <input ref={(el) => { photoRefs.current[menu.id] = el; }} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMenuPhotoUpload(menu.id, f); e.target.value = ''; }} />
              </div>

              <div className="flex-1 min-w-0">
                {editingId === menu.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="메뉴명"
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                      <input type="number" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                        placeholder="가격"
                        className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600">
                        <input type="checkbox" checked={editForm.isPopular} onChange={(e) => setEditForm((p) => ({ ...p, isPopular: e.target.checked }))}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-orange-500" />인기 메뉴
                      </label>
                      <div className="flex gap-1.5">
                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-400 border border-slate-200 px-2.5 py-1 rounded-lg">취소</button>
                        <button onClick={() => saveEdit(menu.id)} className="text-xs font-bold text-white px-2.5 py-1 rounded-lg" style={{ backgroundColor: BRAND.color }}>확인</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        {menu.isPopular && <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">인기</span>}
                        <span className="text-sm font-bold text-slate-800">{menu.name}</span>
                      </div>
                      <span className="text-sm text-slate-500 font-mono mt-0.5 block">₩{menu.price.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      <button onClick={() => startEdit(menu)}
                        className="text-xs text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-white transition-colors">수정</button>
                      <button onClick={() => deleteMenu(menu.id)}
                        className="text-xs text-red-400 border border-red-100 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors">삭제</button>
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
        <p className="text-sm font-bold text-slate-700">새 메뉴 추가</p>
        <div className="flex gap-3">
          <input type="text" value={newMenu.name} onChange={(e) => setNewMenu((p) => ({ ...p, name: e.target.value }))}
            placeholder="메뉴명 (예: 아메리카노)"
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          <input type="number" value={newMenu.price} onChange={(e) => setNewMenu((p) => ({ ...p, price: e.target.value }))}
            placeholder="가격"
            className="w-28 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
            <input type="checkbox" checked={newMenu.isPopular} onChange={(e) => setNewMenu((p) => ({ ...p, isPopular: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />인기 메뉴로 표시
          </label>
          <button onClick={addMenu} disabled={!newMenu.name.trim()}
            className="text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-40"
            style={{ backgroundColor: BRAND.color }}>+ 추가</button>
        </div>
      </div>

      <SaveRow saving={saving} saved={saved} onSave={handleSave} />
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
      const formData = new FormData(); formData.append('file', file);
      const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: formData });
      if (res.ok) { const data = await res.json(); setPhotos((prev) => [...prev, { id: genId(), url: data.url, isPrimary: prev.length === 0 }]); setSaved(false); }
    } finally { setUploading(false); }
  }

  function setPrimary(id: string) { setPhotos((prev) => prev.map((p) => ({ ...p, isPrimary: p.id === id }))); setSaved(false); }
  function deletePhoto(id: string) {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (next.length > 0 && !next.some((p) => p.isPrimary)) next[0].isPrimary = true;
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ photos }),
      });
      if (res.ok) { const data = await res.json(); onSaved(data.shop); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-extrabold text-slate-900">사진 관리</h3>
      <p className="text-xs text-slate-500">대표 1장 + 추가 사진. 호버하여 대표 설정 / 삭제.</p>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
            {photo.isPrimary && (
              <span className="absolute top-1 left-1 text-[9px] font-extrabold text-white bg-orange-500 px-1.5 py-0.5 rounded-full">대표</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              {!photo.isPrimary && (
                <button onClick={() => setPrimary(photo.id)}
                  className="text-[10px] font-bold text-white bg-orange-500/80 px-2 py-1 rounded-lg hover:bg-orange-500 transition-colors">대표</button>
              )}
              <button onClick={() => deletePhoto(photo.id)}
                className="text-[10px] font-bold text-white bg-red-500/80 px-2 py-1 rounded-lg hover:bg-red-500 transition-colors">삭제</button>
            </div>
          </div>
        ))}
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors disabled:opacity-50">
          {uploading ? <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /> : (
            <><span className="text-2xl text-orange-400">+</span><span className="text-xs text-orange-600 font-medium">사진 추가</span></>
          )}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} />

      <SaveRow saving={saving} saved={saved} onSave={handleSave} />
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
    setNotices((prev) => [{ id: genId(), content: newContent.trim(), createdAt: new Date().toISOString() }, ...prev]);
    setNewContent(''); setSaved(false);
  }
  function deleteNotice(id: string) { setNotices((prev) => prev.filter((n) => n.id !== id)); setSaved(false); }
  function saveEdit(id: string) { setNotices((prev) => prev.map((n) => n.id === id ? { ...n, content: editContent } : n)); setEditingId(null); setSaved(false); }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/shops/${shop.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notices }),
      });
      if (res.ok) { const data = await res.json(); onSaved(data.shop); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-extrabold text-slate-900">공지</h3>

      <div className="bg-white rounded-xl border border-dashed border-orange-200 p-4 space-y-3">
        <p className="text-sm font-bold text-slate-700">새 공지 등록</p>
        <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)}
          placeholder="고객에게 전달할 공지 내용을 입력하세요." rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
        <div className="flex justify-end">
          <button onClick={addNotice} disabled={!newContent.trim()}
            className="text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-40"
            style={{ backgroundColor: BRAND.color }}>공지 추가</button>
        </div>
      </div>

      <div className="space-y-3">
        {notices.length === 0 && <p className="text-sm text-slate-400 text-center py-6">등록된 공지가 없습니다.</p>}
        {notices.map((notice) => (
          <div key={notice.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            {editingId === notice.id ? (
              <div className="space-y-3">
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none bg-white" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="text-sm text-slate-400 border border-slate-200 px-3 py-1.5 rounded-lg">취소</button>
                  <button onClick={() => saveEdit(notice.id)} className="text-sm font-bold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: BRAND.color }}>확인</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 leading-relaxed">{notice.content}</p>
                  <p className="text-xs text-slate-400 mt-1.5">{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditingId(notice.id); setEditContent(notice.content); }}
                    className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white transition-colors">수정</button>
                  <button onClick={() => deleteNotice(notice.id)}
                    className="text-xs text-red-400 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">삭제</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <SaveRow saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

// ─── 공통 서브컴포넌트 ────────────────────────────────────────────────────────
function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SaveRow({ saving, saved, onSave }: { saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button onClick={onSave} disabled={saving}
        className="px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 hover:opacity-90 transition-opacity"
        style={{ backgroundColor: BRAND.color }}>
        {saving ? '저장 중...' : '저장'}
      </button>
      {saved && <span className="text-sm text-emerald-600 font-medium">✅ 저장되었습니다</span>}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-xl font-black tabular-nums text-slate-900">{value}</p>
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

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!shop) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <p className="text-slate-500">가게를 찾을 수 없습니다.</p>
      <Link href="/dashboard" className="text-sm font-bold" style={{ color: BRAND.color }}>← 대시보드로</Link>
    </div>
  );

  const reviewCount = shop.reviews?.length ?? 0;
  const completionFields = [shop.name, shop.description, shop.address, shop.phone, shop.photos.length > 0].filter(Boolean).length;
  const completionPct = Math.round((completionFields / 5) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-100 sticky top-10 z-40">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')}
              className="text-slate-400 hover:text-slate-600 transition-colors text-lg" aria-label="뒤로가기">←</button>
            <div>
              <span className="font-extrabold text-slate-900">{shop.name}</span>
              <span className="ml-2 text-xs text-slate-400">가게 관리</span>
            </div>
          </div>
          <Link href={`/shop/${shop.slug}`} target="_blank"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            가게 페이지 보기 →
          </Link>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
        {/* 가게 헤더 카드 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 flex items-center gap-5 flex-wrap shadow-sm">
          {shop.photos[0] ? (
            <img src={shop.photos[0].url} alt={shop.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-xl shrink-0 grid place-items-center text-3xl"
              style={{ background: 'repeating-linear-gradient(45deg,#fef3e8,#fef3e8 8px,#fed7aa 8px,#fed7aa 16px)' }}>
              <span className="opacity-40">☕</span>
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900">{shop.name}</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-mono">
                ● 공개 중
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{shop.category.toUpperCase()} · {shop.region}</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-slate-500">정보 완성도</span>
              <div className="flex-1 max-w-[180px] h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%`, backgroundColor: completionPct >= 80 ? '#10b981' : completionPct >= 50 ? '#f59e0b' : '#ef4444' }} />
              </div>
              <span className="font-extrabold font-mono" style={{ color: completionPct >= 80 ? '#10b981' : completionPct >= 50 ? '#f59e0b' : '#ef4444' }}>
                {completionPct}%
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/shop/${shop.slug}`} target="_blank"
              className="px-3 py-2 text-sm font-bold border border-slate-200 bg-white rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
              미리보기 →
            </Link>
            <Link href={`/dashboard/sns?shopId=${shop.id}`}
              className="px-3 py-2 text-sm font-extrabold rounded-xl text-white"
              style={{ backgroundColor: BRAND.color }}>
              SNS 콘텐츠 만들기
            </Link>
          </div>
        </div>

        {/* 3-컬럼 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_260px] gap-5">
          {/* 좌측 섹션 네비 */}
          <aside>
            <nav className="bg-white border border-slate-200 rounded-2xl p-2 sticky top-24 shadow-sm" role="navigation" aria-label="가게 관리 섹션">
              {TABS.map((tab, idx) => {
                const on = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                      on ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-mono text-[10px] w-5 h-5 rounded-lg grid place-items-center shrink-0 font-extrabold ${
                      on ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>{idx + 1}</span>
                    <span className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{tab.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{tab.sub}</p>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 메인 편집 패널 */}
          <main className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" role="main">
            {activeTab === 'info'   && <TabInfo    shop={shop} onSaved={setShop} />}
            {activeTab === 'hours'  && <TabHours   shop={shop} onSaved={setShop} />}
            {activeTab === 'menu'   && <TabMenu    shop={shop} onSaved={setShop} />}
            {activeTab === 'photos' && <TabPhotos  shop={shop} onSaved={setShop} />}
            {activeTab === 'notice' && <TabNotice  shop={shop} onSaved={setShop} />}
          </main>

          {/* 우측 사이드바 */}
          <aside className="space-y-4">
            {/* 통계 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">최근 7일</p>
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="조회" value="1,240" />
                <StatCard label="저장" value="86" />
                <StatCard label="전화" value="32" />
                <StatCard label="길찾기" value="148" />
              </div>
            </div>

            {/* 추천 팁 */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <p className="text-xs font-extrabold text-orange-700">💡 추천</p>
              <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
                사진 5장 더 추가하면 검색 노출이 평균 23% 늘어요.
              </p>
              <button
                onClick={() => setActiveTab('photos')}
                className="mt-3 text-xs font-extrabold text-orange-700 underline underline-offset-2">
                사진 추가하러 →
              </button>
            </div>

            {/* 위험 액션 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">공개 / 비공개</p>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">검색 노출</p>
                  <p className="text-xs text-slate-500 mt-0.5">jeju-map 검색에 표시</p>
                </div>
                <div className="w-12 h-7 rounded-full bg-emerald-500 p-0.5 cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-white ml-auto shadow-sm" />
                </div>
              </div>
              <div className="mt-3 p-3 border border-red-200 bg-red-50 rounded-xl">
                <p className="text-xs font-bold text-red-700">⚠ 가게 삭제</p>
                <p className="text-[11px] text-red-500 mt-0.5 leading-relaxed">모든 데이터가 영구 삭제됩니다.</p>
                <button className="mt-2 px-3 py-1.5 text-xs font-bold bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                  가게 삭제 요청
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
