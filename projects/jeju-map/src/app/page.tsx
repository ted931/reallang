"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CATEGORIES, DUMMY_PINS, type MapPin } from "@/lib/categories";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(["cafe", "restaurant", "attraction", "beach"])
  );
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 카카오 지도 SDK 로드
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!kakaoKey) return;

    if (window.kakao?.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => setMapLoaded(true));
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !containerRef.current || mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(33.38, 126.55),
      level: 10,
    };
    mapRef.current = new window.kakao.maps.Map(containerRef.current, options);

    // 줌 컨트롤
    const zoomControl = new window.kakao.maps.ZoomControl();
    mapRef.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
  }, [mapLoaded]);

  // 마커 업데이트
  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !mapLoaded) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const filtered = DUMMY_PINS.filter((p) => activeCategories.has(p.category));

    filtered.forEach((pin) => {
      const cat = CATEGORIES.find((c) => c.id === pin.category);
      const position = new window.kakao.maps.LatLng(pin.lat, pin.lng);

      // 커스텀 마커 (이모지)
      const content = document.createElement("div");
      content.innerHTML = `<div style="
        width:36px;height:36px;border-radius:50%;
        background:${cat?.color || "#6B7280"};
        display:flex;align-items:center;justify-content:center;
        font-size:16px;border:2px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer;
      ">${cat?.emoji || "📍"}</div>`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: content,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });
      overlay.setMap(mapRef.current);

      content.addEventListener("click", () => {
        setSelectedPin((prev) => (prev?.id === pin.id ? null : pin));
        mapRef.current.panTo(position);
      });

      markersRef.current.push(overlay);
    });
  }, [activeCategories, mapLoaded]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelectedPin(null);
  };

  const getCategoryInfo = (categoryId: string) =>
    CATEGORIES.find((c) => c.id === categoryId);

  const filteredCount = DUMMY_PINS.filter((p) => activeCategories.has(p.category)).length;

  return (
    <div className="h-screen flex flex-col">
      {/* Category Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategories.has(cat.id);
            const count = DUMMY_PINS.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={containerRef} className="w-full h-full" />

          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-sky-50">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-400 mt-4">지도를 불러오고 있습니다...</p>
              </div>
            </div>
          )}

          {/* Info Badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-gray-500 shadow-sm">
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
                    <a href={`tel:${selectedPin.phone}`} className="text-blue-600">
                      {selectedPin.phone}
                    </a>
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
