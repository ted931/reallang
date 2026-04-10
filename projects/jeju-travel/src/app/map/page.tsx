"use client";

import { useState, useEffect, useRef } from "react";
import { CATEGORIES, DUMMY_PINS, type MapPin } from "@/lib/categories";
import { loadPlan, type SavedPlan } from "@/lib/shared-state";

export default function MapPage() {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(["cafe", "restaurant", "attraction", "beach"])
  );
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [pins, setPins] = useState<MapPin[]>(DUMMY_PINS);
  const [loading, setLoading] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [savedPlan, setSavedPlan] = useState<SavedPlan | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const weatherMarkersRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 일정 공유 데이터 로드
  useEffect(() => {
    const plan = loadPlan();
    if (plan && plan.spots.length > 0) setSavedPlan(plan);
  }, []);

  // 날씨 데이터 로드
  useEffect(() => {
    if (!showWeather) return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/api/weather`)
      .then((r) => r.json())
      .then((data) => setWeatherData(data.locations || []))
      .catch(console.error);
  }, [showWeather]);

  // 날씨 마커 표시/숨기기
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
        html: `<div style="
          background:${bgColor};color:white;
          padding:4px 8px;border-radius:12px;
          font-size:11px;font-weight:700;
          white-space:nowrap;border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          display:flex;align-items:center;gap:3px;
        ">${loc.sky.split(" ")[0]} ${loc.temperature}°</div>`,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: 1000 }).addTo(mapRef.current);
      marker.bindTooltip(`${loc.name}: ${loc.temperature}° ${loc.sky} (습도 ${loc.humidity}%, 풍속 ${loc.windSpeed}m/s)`, { direction: "top" });
      weatherMarkersRef.current.push(marker);
    });
  }, [showWeather, weatherData, mapReady]);

  // 공공데이터 API에서 실제 POI 로드
  useEffect(() => {
    setLoading(true);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/api/places?type=12`) // 관광지부터
      .then((r) => r.json())
      .then((data) => {
        if (data.places?.length > 0) {
          setPins((prev) => {
            const newIds = new Set(data.places.map((p: MapPin) => p.id));
            const filtered = prev.filter((p) => !newIds.has(p.id));
            return [...filtered, ...data.places];
          });
        }
        // 음식점도 로드
        return fetch(`${basePath}/api/places?type=39`);
      })
      .then((r) => r.json())
      .then((data) => {
        if (data.places?.length > 0) {
          setPins((prev) => {
            const newIds = new Set(data.places.map((p: MapPin) => p.id));
            const filtered = prev.filter((p) => !newIds.has(p.id));
            return [...filtered, ...data.places];
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Leaflet 동적 로드 (SSR 회피)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // CSS 로드
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [33.38, 126.55],
        zoom: 10,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      (window as any).__leaflet = L;
      setMapReady(true);
    });

    return () => { link.remove(); };
  }, []);

  // 마커 업데이트
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const L = (window as any).__leaflet;
    if (!L) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = pins.filter((p) => activeCategories.has(p.category));

    filtered.forEach((pin) => {
      const cat = CATEGORIES.find((c) => c.id === pin.category);

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:34px;height:34px;border-radius:50%;
          background:${cat?.color || "#6B7280"};
          display:flex;align-items:center;justify-content:center;
          font-size:15px;border:2.5px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;
          line-height:1;
        ">${cat?.emoji || "📍"}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(mapRef.current);
      marker.on("click", () => {
        setSelectedPin((prev) => (prev?.id === pin.id ? null : pin));
        mapRef.current.flyTo([pin.lat, pin.lng], 13, { duration: 0.5 });
      });

      markersRef.current.push(marker);
    });
  }, [activeCategories, mapReady, pins]);

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelectedPin(null);
  };

  const getCategoryInfo = (id: string) => CATEGORIES.find((c) => c.id === id);
  const filteredCount = pins.filter((p) => activeCategories.has(p.category)).length;

  return (
    <div className="h-screen flex flex-col">
      {/* 일정 연동 배너 */}
      {savedPlan && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-emerald-700">
            <span>✈️</span>
            <span className="font-medium">&quot;{savedPlan.title}&quot; 일정의 장소 {savedPlan.spots.length}곳이 지도에 표시됩니다</span>
            <button onClick={() => setSavedPlan(null)} className="ml-auto text-emerald-500 hover:text-emerald-700 text-xs">닫기</button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {/* 날씨 토글 */}
          <button
            onClick={() => setShowWeather(!showWeather)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all border-2 ${
              showWeather ? "bg-sky-500 text-white border-sky-500" : "bg-white text-sky-600 border-sky-300 hover:bg-sky-50"
            }`}
          >
            🌤️ 날씨
          </button>
          <span className="w-px h-6 bg-gray-200 self-center flex-shrink-0" />
          {CATEGORIES.map((cat) => {
            const isActive = activeCategories.has(cat.id);
            const count = pins.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive ? "text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-gray-200"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map + Detail */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <div ref={containerRef} className="w-full h-full" />

          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-sky-50">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-400 mt-4">지도를 불러오고 있습니다...</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-gray-500 shadow-sm z-[1000]">
            {filteredCount}개 장소 · {activeCategories.size}개 카테고리
          </div>
        </div>

        {/* Detail Panel */}
        {selectedPin && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: getCategoryInfo(selectedPin.category)?.color }}
                >
                  {getCategoryInfo(selectedPin.category)?.emoji}{" "}
                  {getCategoryInfo(selectedPin.category)?.label}
                </span>
                <button onClick={() => setSelectedPin(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPin.name}</h2>

              {selectedPin.description && (
                <p className="text-sm text-gray-500 mb-4">{selectedPin.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 flex-shrink-0">📍</span>
                  <span className="text-gray-700">{selectedPin.address}</span>
                </div>
                {selectedPin.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📞</span>
                    <a href={`tel:${selectedPin.phone}`} className="text-blue-600">{selectedPin.phone}</a>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <a
                  href={`https://map.kakao.com/link/to/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium text-center hover:bg-blue-500"
                >
                  카카오맵 길찾기
                </a>
                <a
                  href={`https://map.kakao.com/link/map/${selectedPin.name},${selectedPin.lat},${selectedPin.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-50"
                >
                  카카오맵에서 보기
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
