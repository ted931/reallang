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

      // CartoDB Voyager — 깔끔한 모던 타일
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      mapRef.current = map;
      (window as any).__leaflet = L;

      // 마커 클러스터 로드
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

    // 기존 제거
    if (clusterRef.current) {
      mapRef.current.removeLayer(clusterRef.current);
    }
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = pins.filter((p) => activeCategories.has(p.category));

    // 클러스터 그룹 생성
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

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:${isSelected ? 42 : 36}px;height:${isSelected ? 42 : 36}px;border-radius:50%;
          background:${cat?.color || "#6B7280"};
          display:flex;align-items:center;justify-content:center;
          font-size:${isSelected ? 18 : 16}px;
          border:${isSelected ? "3px" : "2.5px"} solid white;
          box-shadow:${isSelected ? "0 0 0 3px " + (cat?.color || "#6B7280") + "40," : ""} 0 3px 12px rgba(0,0,0,0.25);
          cursor:pointer;transition:all 0.2s;line-height:1;
        ">${cat?.emoji || "📍"}</div>`,
        iconSize: [isSelected ? 42 : 36, isSelected ? 42 : 36],
        iconAnchor: [isSelected ? 21 : 18, isSelected ? 21 : 18],
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 상단 바 */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-[1001]">
        {/* 검색 + 필터 토글 */}
        <div className="px-4 py-2.5 flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              placeholder="장소 검색..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setShowSearch(false); }} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs">
                ✕
              </button>
            )}
          </div>

          {/* 날씨 토글 */}
          <button
            onClick={() => setShowWeather(!showWeather)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              showWeather ? "bg-sky-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
            }`}
          >
            🌤️
          </button>

          {/* 필터 토글 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              showFilters ? "bg-indigo-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {activeCategories.size}
          </button>
        </div>

        {/* 검색 결과 드롭다운 */}
        {showSearch && searchResults.length > 0 && (
          <div className="absolute left-4 right-4 top-full bg-white rounded-xl shadow-xl border border-gray-100 mt-1 max-h-80 overflow-y-auto z-[1002]">
            {searchResults.map((pin) => {
              const cat = getCategoryInfo(pin.category);
              return (
                <button
                  key={pin.id}
                  onClick={() => goToPin(pin)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: cat?.color + "20", color: cat?.color }}>
                    {cat?.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{pin.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{pin.address}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{cat?.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 카테고리 필터 패널 */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-gray-50">
            <div className="flex items-center justify-between mb-2 pt-2">
              <span className="text-[11px] text-gray-400">{filteredCount}개 장소</span>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-[11px] text-indigo-500 hover:text-indigo-700">전체 선택</button>
                <button onClick={clearAll} className="text-[11px] text-gray-400 hover:text-gray-600">초기화</button>
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
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isActive ? "text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                    style={isActive ? { backgroundColor: cat.color } : {}}
                  >
                    <span className="text-sm">{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] ${isActive ? "text-white/70" : "text-gray-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 지도 + 상세 */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-50 to-white z-[999]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-4 font-medium">제주 지도를 불러오고 있습니다</p>
            </div>
          </div>
        )}

        {/* 장소 수 카운터 */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-3.5 py-2 text-xs text-gray-600 shadow-lg z-[1000] font-medium">
          {filteredCount}개 장소
        </div>

        {/* 상세 패널 — 데스크톱: 사이드, 모바일: 바텀시트 */}
        {selectedPin && (() => {
          const cat = getCategoryInfo(selectedPin.category);
          return (
            <>
              {/* 모바일 바텀시트 */}
              <div className="absolute bottom-0 left-0 right-0 md:hidden z-[1001] animate-slide-up">
                <div className="bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white rounded-t-2xl pt-3 pb-2 px-5 border-b border-gray-50">
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: cat?.color + "20" }}>
                          {cat?.emoji}
                        </span>
                        <span className="text-[11px] font-semibold" style={{ color: cat?.color }}>{cat?.label}</span>
                      </div>
                      <button onClick={() => setSelectedPin(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs">
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{selectedPin.name}</h2>
                    {selectedPin.description && <p className="text-sm text-gray-500 mb-3">{selectedPin.description}</p>}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400">📍</span>
                        <span className="text-gray-600">{selectedPin.address}</span>
                      </div>
                      {selectedPin.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📞</span>
                          <a href={`tel:${selectedPin.phone}`} className="text-indigo-600">{selectedPin.phone}</a>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a href={`https://map.kakao.com/link/to/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`} target="_blank" rel="noopener noreferrer"
                        className="py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium text-center hover:bg-indigo-600 transition-colors">
                        길찾기
                      </a>
                      <a href={`https://map.kakao.com/link/map/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`} target="_blank" rel="noopener noreferrer"
                        className="py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium text-center hover:bg-gray-50 transition-colors">
                        카카오맵
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 데스크톱 사이드 패널 */}
              <div className="hidden md:block absolute top-0 right-0 w-96 h-full z-[1001]">
                <div className="h-full bg-white/95 backdrop-blur-lg border-l border-gray-100 shadow-2xl overflow-y-auto">
                  {/* 헤더 */}
                  <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-base" style={{ backgroundColor: cat?.color + "15" }}>
                        {cat?.emoji}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: cat?.color }}>
                        {cat?.label}
                      </span>
                    </div>
                    <button onClick={() => setSelectedPin(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
                      ✕
                    </button>
                  </div>

                  <div className="px-6 py-5">
                    {/* 이름 */}
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPin.name}</h2>
                    {selectedPin.description && <p className="text-sm text-gray-500 leading-relaxed mb-5">{selectedPin.description}</p>}

                    {/* 정보 */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-400 mt-0.5">📍</span>
                        <span className="text-sm text-gray-700">{selectedPin.address}</span>
                      </div>
                      {selectedPin.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-400">📞</span>
                          <a href={`tel:${selectedPin.phone}`} className="text-sm text-indigo-600 font-medium">{selectedPin.phone}</a>
                        </div>
                      )}
                    </div>

                    {/* 액션 */}
                    <div className="space-y-2">
                      <a href={`https://map.kakao.com/link/to/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-200">
                        카카오맵 길찾기
                      </a>
                      <a href={`https://map.kakao.com/link/map/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        카카오맵에서 보기
                      </a>
                      <a href={`https://search.naver.com/search.naver?query=제주+${encodeURIComponent(selectedPin.name)}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        네이버 검색
                      </a>
                    </div>

                    {/* 좌표 */}
                    <div className="mt-6 p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-[11px] text-gray-400">
                        {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      <style jsx global>{`
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
