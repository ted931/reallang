"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { CATEGORIES, DUMMY_PINS, EXTRA_PINS, type MapPin } from "@/lib/categories";

const ALL_PINS = [...DUMMY_PINS, ...EXTRA_PINS];

export default function MapPage() {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(["cafe", "restaurant", "attraction", "beach"])
  );
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [pins, setPins] = useState<MapPin[]>(ALL_PINS);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MapPin[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clusterRef = useRef<any>(null);
  const weatherMarkersRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // jejupass-promo 등록 가게 연동
  useEffect(() => {
    const SHOP_CAT: Record<string, string> = {
      cafe: 'cafe', restaurant: 'restaurant', dessert: 'cafe',
      bakery: 'cafe', brunch: 'cafe', bar: 'restaurant', etc: 'attraction',
    };
    const REGION_COORDS: Record<string, [number, number]> = {
      'jeju-si': [33.499, 126.531], seogwipo: [33.254, 126.560],
      aewol: [33.464, 126.332], hallim: [33.414, 126.260],
      hamdeok: [33.543, 126.670], seongsan: [33.458, 126.927],
      jungmun: [33.250, 126.412],
    };
    fetch('http://localhost:3001/api/shops')
      .then((r) => r.json())
      .then((data) => {
        const shops = (data.shops || []).filter((s: any) => s.isPublished);
        const shopPins: any[] = shops.map((s: any) => {
          const primaryPhoto = s.photos?.find((p: any) => p.isPrimary) || s.photos?.[0];
          const avgRating = s.reviews?.length
            ? s.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / s.reviews.length
            : undefined;
          const coords = REGION_COORDS[s.region] ?? [33.38, 126.55];
          const jitter = () => (Math.random() - 0.5) * 0.04;
          return {
            id: `jp_${s.id}`,
            name: s.name,
            category: SHOP_CAT[s.category] || 'cafe',
            lat: coords[0] + jitter(),
            lng: coords[1] + jitter(),
            address: s.address,
            phone: s.phone,
            description: s.description,
            source: 'jejupass',
            rating: avgRating,
            reviewCount: s.reviews?.length ?? 0,
            photoUrl: primaryPhoto?.url,
            shopSlug: s.slug,
            shopId: s.id,
          };
        });
        if (shopPins.length > 0) {
          setPins((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            return [...prev, ...shopPins.filter((p) => !existingIds.has(p.id))];
          });
        }
      })
      .catch(() => {});
  }, []);

  // 네이버 벌크 API
  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/api/naver-bulk`)
      .then((r) => r.json())
      .then((data) => {
        if (data.places?.length > 0) {
          setPins((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newPins = data.places.filter((p: MapPin) => !existingIds.has(p.id));
            return [...prev, ...newPins];
          });
        }
      })
      .catch(() => {});
  }, []);

  // 공공데이터 API
  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/api/places?type=12`)
      .then((r) => r.json())
      .then((data) => {
        if (data.places?.length > 0) {
          setPins((prev) => {
            const newIds = new Set(data.places.map((p: MapPin) => p.id));
            return [...prev.filter((p) => !newIds.has(p.id)), ...data.places];
          });
        }
        return fetch(`${basePath}/api/places?type=39`);
      })
      .then((r) => r.json())
      .then((data) => {
        if (data.places?.length > 0) {
          setPins((prev) => {
            const newIds = new Set(data.places.map((p: MapPin) => p.id));
            return [...prev.filter((p) => !newIds.has(p.id)), ...data.places];
          });
        }
      })
      .catch(() => {});
  }, []);

  // 날씨 데이터
  useEffect(() => {
    if (!showWeather) return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/api/weather`)
      .then((r) => r.json())
      .then((data) => setWeatherData(data.locations || []))
      .catch(console.error);
  }, [showWeather]);

  // 날씨 마커
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const L = (window as any).__leaflet;
    if (!L) return;
    weatherMarkersRef.current.forEach((m) => m.remove());
    weatherMarkersRef.current = [];
    if (!showWeather || weatherData.length === 0) return;

    weatherData.forEach((loc: any) => {
      if (!loc.lat || !loc.lng || loc.temperature === "-") return;
      const temp = parseFloat(loc.temperature);
      const bgColor = temp >= 25 ? "#EF4444" : temp >= 20 ? "#F59E0B" : temp >= 15 ? "#10B981" : temp >= 10 ? "#06B6D4" : "#3B82F6";
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${bgColor};color:white;padding:5px 10px;border-radius:16px;font-size:12px;font-weight:700;white-space:nowrap;border:2px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.25);display:flex;align-items:center;gap:4px;">${loc.sky.split(" ")[0]} ${loc.temperature}°</div>`,
        iconSize: [90, 32],
        iconAnchor: [45, 16],
      });
      const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: 1000 }).addTo(mapRef.current);
      marker.bindTooltip(`${loc.name}: ${loc.temperature}° ${loc.sky}`, { direction: "top", offset: [0, -12] });
      weatherMarkersRef.current.push(marker);
    });
  }, [showWeather, weatherData, mapReady]);

  // Leaflet 초기화 — CartoDB Voyager 타일
  useEffect(() => {
    if (typeof window === "undefined") return;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);

    const clusterCss = document.createElement("link");
    clusterCss.rel = "stylesheet";
    clusterCss.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
    document.head.appendChild(clusterCss);

    const clusterDefaultCss = document.createElement("link");
    clusterDefaultCss.rel = "stylesheet";
    clusterDefaultCss.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
    document.head.appendChild(clusterDefaultCss);

    import("leaflet").then(async (L) => {
      if (!containerRef.current || mapRef.current) return;

      const jejuBounds = L.latLngBounds([33.1, 126.1], [33.6, 127.0]);
      const map = L.map(containerRef.current, {
        center: [33.38, 126.55],
        zoom: 10,
        minZoom: 9,
        maxZoom: 18,
        maxBounds: jejuBounds.pad(0.1),
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // VWorld 기본 지도 (한국어 지명, 국토교통부)
      const vworldKey = process.env.NEXT_PUBLIC_VWORLD_KEY || "";
      if (vworldKey) {
        L.tileLayer(`https://api.vworld.kr/req/wmts/1.0.0/${vworldKey}/Base/{z}/{y}/{x}.png`, {
          attribution: '&copy; <a href="https://www.vworld.kr">VWorld</a>',
          maxZoom: 18,
        }).addTo(map);
      } else {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
          maxZoom: 18,
        }).addTo(map);
      }

      mapRef.current = map;
      (window as any).__leaflet = L;

      try {
        const MCScript = document.createElement("script");
        MCScript.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
        MCScript.onload = () => {
          setMapReady(true);
        };
        document.head.appendChild(MCScript);
      } catch {
        setMapReady(true);
      }
    });

    return () => { css.remove(); clusterCss.remove(); clusterDefaultCss.remove(); };
  }, []);

  // 마커 업데이트 (클러스터링)
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const L = (window as any).__leaflet;
    const MC = (window as any).L?.MarkerClusterGroup || (L as any).MarkerClusterGroup;
    if (!L) return;

    if (clusterRef.current) {
      mapRef.current.removeLayer(clusterRef.current);
    }
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = pins.filter((p) => activeCategories.has(p.category));

    let clusterGroup: any = null;
    if (MC) {
      clusterGroup = new MC({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          const size = count > 50 ? 48 : count > 20 ? 40 : 32;
          return L.divIcon({
            className: "",
            html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:white;display:flex;align-items:center;justify-content:center;font-size:${size > 40 ? 14 : 12}px;font-weight:700;border:3px solid white;box-shadow:0 3px 12px rgba(99,102,241,0.4);">${count}</div>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });
        },
      });
    }

    filtered.forEach((pin) => {
      const cat = CATEGORIES.find((c) => c.id === pin.category);
      const isSelected = selectedPin?.id === pin.id;

      const isJejupass = pin.source === 'jejupass';
      const sz = isSelected ? 44 : isJejupass ? 40 : 36;
      const borderColor = isJejupass ? '#F97316' : 'white';
      const ringStyle = isJejupass
        ? `box-shadow:0 0 0 3px #F9731640, 0 4px 14px rgba(0,0,0,0.3);`
        : isSelected
          ? `box-shadow:0 0 0 3px ${(cat?.color || '#6B7280')}40, 0 3px 12px rgba(0,0,0,0.25);`
          : `box-shadow:0 3px 10px rgba(0,0,0,0.2);`;
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;width:${sz}px;height:${sz}px;">
          <div style="
            width:${sz}px;height:${sz}px;border-radius:50%;
            background:${isJejupass ? '#F97316' : (cat?.color || '#6B7280')};
            display:flex;align-items:center;justify-content:center;
            font-size:${isSelected ? 18 : 16}px;
            border:${isSelected ? '3px' : '2.5px'} solid ${borderColor};
            ${ringStyle}
            cursor:pointer;transition:all 0.2s;line-height:1;
          ">${cat?.emoji || '📍'}</div>
          ${isJejupass ? `<div style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;box-shadow:0 1px 4px rgba(0,0,0,0.2);">⭐</div>` : ''}
        </div>`,
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon });
      marker.on("click", () => {
        setSelectedPin((prev) => (prev?.id === pin.id ? null : pin));
        mapRef.current.flyTo([pin.lat, pin.lng], 14, { duration: 0.5 });
      });

      if (clusterGroup) {
        clusterGroup.addLayer(marker);
      } else {
        marker.addTo(mapRef.current);
        markersRef.current.push(marker);
      }
    });

    if (clusterGroup) {
      mapRef.current.addLayer(clusterGroup);
      clusterRef.current = clusterGroup;
    }
  }, [activeCategories, mapReady, pins, selectedPin]);

  // 검색
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = pins
      .filter((p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q))
      .slice(0, 8);
    setSearchResults(results);
  }, [searchQuery, pins]);

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelectedPin(null);
  };

  const selectAll = () => setActiveCategories(new Set(CATEGORIES.map((c) => c.id)));
  const clearAll = () => setActiveCategories(new Set());

  const getCategoryInfo = (id: string) => CATEGORIES.find((c) => c.id === id);
  const filteredCount = useMemo(() => pins.filter((p) => activeCategories.has(p.category)).length, [pins, activeCategories]);

  const goToPin = (pin: MapPin) => {
    setSelectedPin(pin);
    setShowSearch(false);
    setSearchQuery("");
    if (mapRef.current) mapRef.current.flyTo([pin.lat, pin.lng], 14, { duration: 0.5 });
    if (!activeCategories.has(pin.category)) {
      setActiveCategories((prev) => new Set([...prev, pin.category]));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* ── 상단 바 ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm relative z-[1001]">
        {/* 검색 + 날씨 + 필터 */}
        <div className="px-4 py-2.5 flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              placeholder="장소 검색…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSearch(false); }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs leading-none"
              >
                ✕
              </button>
            )}
          </div>

          {/* 날씨 토글 */}
          <button
            onClick={() => setShowWeather(!showWeather)}
            className={`px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              showWeather
                ? "bg-sky-500 text-white border-transparent shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            🌤️
          </button>

          {/* 필터 토글 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
              showFilters
                ? "bg-indigo-500 text-white border-transparent shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            필터 · {activeCategories.size}
          </button>
        </div>

        {/* 검색 결과 드롭다운 */}
        {showSearch && searchResults.length > 0 && (
          <div className="absolute left-4 right-4 top-full bg-white rounded-xl shadow-xl border border-slate-200 mt-1 max-h-80 overflow-y-auto z-[1002]">
            {searchResults.map((pin) => {
              const cat = getCategoryInfo(pin.category);
              return (
                <button
                  key={pin.id}
                  onClick={() => goToPin(pin)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: cat?.color + "20", color: cat?.color }}
                  >
                    {cat?.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{pin.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{pin.address}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{cat?.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 카테고리 필터 패널 */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-slate-100 pt-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400">{filteredCount}개 장소</span>
              <div className="flex gap-3">
                <button onClick={selectAll} className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">전체 선택</button>
                <button onClick={clearAll} className="text-[11px] text-slate-400 hover:text-slate-600">초기화</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategories.has(cat.id);
                const count = pins.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                      isActive
                        ? "text-white border-transparent shadow-sm"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                    }`}
                    style={isActive ? { backgroundColor: cat.color } : {}}
                  >
                    <span className="text-sm leading-none">{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] ${isActive ? "text-white/70" : "text-slate-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 지도 + 상세 ── */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {/* 로딩 스켈레톤 */}
        {!mapReady && (
          <div className="absolute inset-0 z-[999] bg-gradient-to-b from-sky-50 to-white flex flex-col">
            {/* 격자 배경 */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 400">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#grid)" />
              </svg>
            </div>
            {/* 섬 윤곽 shimmer */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[40%] rounded-[50%/40%] opacity-50"
              style={{
                background: "linear-gradient(90deg,#eef2f7 0%,#f8fafc 50%,#eef2f7 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.6s infinite linear",
              }}
            />
            {/* 스피너 + 텍스트 */}
            <div className="flex-1 grid place-items-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-[3px] border-indigo-200 border-t-indigo-500 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">제주 지도를 그리는 중…</p>
                <p className="text-[11px] text-slate-400 mt-1">jeju · 제주특별자치도</p>
              </div>
            </div>
            {/* 하단 스켈레톤 카드 행 */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-1 h-14 rounded-xl"
                  style={{
                    background: "linear-gradient(90deg,#eef2f7 0%,#f8fafc 50%,#eef2f7 100%)",
                    backgroundSize: "200% 100%",
                    animation: `shimmer 1.6s ${i * 0.15}s infinite linear`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 장소 수 카운터 */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-3.5 py-2 text-xs text-slate-600 shadow-md z-[1000] font-medium">
          {filteredCount}개 장소
        </div>

        {/* ── 상세 패널 ── */}
        {selectedPin && (() => {
          const cat = getCategoryInfo(selectedPin.category);
          return (
            <>
              {/* 모바일 바텀시트 */}
              <div className="absolute bottom-0 left-0 right-0 md:hidden z-[1001] animate-slide-up">
                <div className="bg-white rounded-t-3xl shadow-2xl max-h-[60vh] overflow-y-auto">
                  {/* 핸들 + 헤더 */}
                  <div className="sticky top-0 bg-white rounded-t-3xl pt-3 pb-2 px-5 border-b border-slate-50">
                    <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: cat?.color + "20" }}
                        >
                          {cat?.emoji}
                        </span>
                        <span className="text-[11px] font-semibold" style={{ color: cat?.color }}>{cat?.label}</span>
                      </div>
                      <button
                        onClick={() => setSelectedPin(null)}
                        className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    {/* 제주패스 사진 */}
                    {selectedPin.source === 'jejupass' && selectedPin.photoUrl && (
                      <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${selectedPin.photoUrl})` }} />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-1">
                      <h2 className="text-lg font-bold text-slate-900 leading-tight">{selectedPin.name}</h2>
                      {selectedPin.source === 'jejupass' && (
                        <span className="shrink-0 ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">제주패스</span>
                      )}
                    </div>

                    {selectedPin.source === 'jejupass' && (selectedPin.rating !== undefined || selectedPin.reviewCount !== undefined) && (
                      <div className="flex items-center gap-2 mb-2">
                        {selectedPin.rating !== undefined && (
                          <span className="text-sm font-bold text-amber-500">★ {selectedPin.rating.toFixed(1)}</span>
                        )}
                        {selectedPin.reviewCount !== undefined && (
                          <span className="text-xs text-slate-400">리뷰 {selectedPin.reviewCount}개</span>
                        )}
                      </div>
                    )}

                    {selectedPin.description && (
                      <p className="text-sm text-slate-500 leading-relaxed mb-3">{selectedPin.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 mt-0.5">📍</span>
                        <span className="text-sm text-slate-700">{selectedPin.address}</span>
                      </div>
                      {selectedPin.phone && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-400">📞</span>
                          <a href={`tel:${selectedPin.phone}`} className="text-sm text-indigo-600 font-medium">{selectedPin.phone}</a>
                        </div>
                      )}
                    </div>

                    {selectedPin.source === 'jejupass' && selectedPin.shopSlug ? (
                      <a
                        href={`http://localhost:3001/shop/${selectedPin.shopSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 mb-2 rounded-xl text-white text-sm font-bold text-center transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#F97316' }}
                      >
                        제주패스에서 자세히 보기 →
                      </a>
                    ) : (
                      <a
                        href="http://localhost:3001/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 mb-2 rounded-xl text-sm font-bold text-center border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 transition-colors"
                      >
                        📝 제주패스에 무료로 가게 등록하기 →
                      </a>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://map.kakao.com/link/to/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-extrabold text-center hover:bg-indigo-600 transition-colors"
                      >
                        길찾기
                      </a>
                      <a
                        href={`https://map.kakao.com/link/map/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium text-center hover:bg-slate-50 transition-colors"
                      >
                        카카오맵
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 데스크톱 사이드 패널 */}
              <div className="hidden md:block absolute top-0 right-0 w-[420px] h-full z-[1001]">
                <div className="h-full bg-white/95 backdrop-blur-lg border-l border-slate-100 shadow-2xl overflow-y-auto">
                  {/* 헤더 */}
                  <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-slate-50 px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                        style={{ backgroundColor: cat?.color + "15" }}
                      >
                        {cat?.emoji}
                      </span>
                      <button
                        onClick={() => setSelectedPin(null)}
                        className="text-sm text-slate-400 hover:text-slate-700"
                      >
                        ← 목록
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedPin(null)}
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="px-5 py-5">
                    {/* 제주패스 가게 — 사진 히어로 */}
                    {selectedPin.source === 'jejupass' && selectedPin.photoUrl && (
                      <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${selectedPin.photoUrl})` }} />
                      </div>
                    )}

                    {/* 이름 + 배지 */}
                    <div className="flex items-start justify-between mb-1">
                      <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedPin.name}</h2>
                      {selectedPin.source === 'jejupass' && (
                        <span className="shrink-0 ml-2 mt-0.5 px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">⭐ 제주패스</span>
                      )}
                    </div>

                    {/* 별점/리뷰 */}
                    {selectedPin.source === 'jejupass' && (
                      <div className="flex items-center gap-3 mb-3">
                        {selectedPin.rating !== undefined && selectedPin.reviewCount && selectedPin.reviewCount > 0 ? (
                          <>
                            <span className="text-sm font-bold text-amber-500">★ {selectedPin.rating.toFixed(1)}</span>
                            <span className="text-xs text-slate-400">리뷰 {selectedPin.reviewCount}개</span>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">리뷰 없음 · 첫 리뷰를 남겨보세요</span>
                        )}
                      </div>
                    )}

                    {selectedPin.description && (
                      <p className="text-sm text-slate-500 leading-relaxed mb-5">{selectedPin.description}</p>
                    )}

                    {/* 정보 블록 */}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 mt-0.5">📍</span>
                        <span className="text-sm text-slate-700">{selectedPin.address}</span>
                      </div>
                      {selectedPin.phone && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-400">📞</span>
                          <a href={`tel:${selectedPin.phone}`} className="text-sm text-indigo-600 font-medium">{selectedPin.phone}</a>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="space-y-2">
                      {selectedPin.source === 'jejupass' && selectedPin.shopSlug ? (
                        <a
                          href={`http://localhost:3001/shop/${selectedPin.shopSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full py-3 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
                          style={{ backgroundColor: '#F97316' }}
                        >
                          제주패스에서 자세히 보기 →
                        </a>
                      ) : (
                        <a
                          href="http://localhost:3001/register"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-dashed border-orange-300 hover:bg-orange-50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-bold text-orange-600">📝 이 가게를 제주패스에 등록하세요</p>
                            <p className="text-[11px] text-orange-400 mt-0.5">무료 등록 · 제주 여행자에게 노출</p>
                          </div>
                          <span className="text-orange-400 font-bold text-sm">무료 →</span>
                        </a>
                      )}
                      <a
                        href={`https://map.kakao.com/link/to/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-extrabold hover:bg-indigo-600 transition-colors"
                      >
                        카카오맵 길찾기
                      </a>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://map.kakao.com/link/map/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium text-center hover:bg-slate-50 transition-colors"
                        >
                          카카오맵 보기
                        </a>
                        <a
                          href={`https://search.naver.com/search.naver?query=제주+${encodeURIComponent(selectedPin.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium text-center hover:bg-slate-50 transition-colors"
                        >
                          네이버 검색
                        </a>
                      </div>
                    </div>

                    {/* 좌표 */}
                    <div className="mt-5 p-3 bg-slate-50 rounded-xl text-center">
                      <p className="text-[11px] text-slate-400 font-mono">{selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .leaflet-control-zoom a {
          width: 36px !important; height: 36px !important;
          line-height: 36px !important; font-size: 16px !important;
          border-radius: 12px !important; margin-bottom: 4px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        .leaflet-control-zoom { border: none !important; border-radius: 12px !important; }
      `}</style>
    </div>
  );
}
