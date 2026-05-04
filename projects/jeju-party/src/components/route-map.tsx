"use client";

import { useEffect, useRef, useState } from "react";
import type { ScheduleItem } from "@/lib/types";

interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stayMin: number;
}

type TravelMode = "walking" | "cycling" | "driving";

const SPEEDS: Record<TravelMode, number> = { walking: 4, cycling: 12, driving: 40 };
const MODE_LABELS: Record<TravelMode, [string, string]> = {
  walking: ["🚶 도보", "4km/h"],
  cycling: ["🚴 자전거", "12km/h"],
  driving: ["🚗 렌터카", "40km/h"],
};

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

function fmtMin(min: number) {
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

function addMin(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

interface Props {
  startTime: string;
  defaultMode?: TravelMode;
  onApply: (items: ScheduleItem[]) => void;
}

export default function RouteMap({ startTime, defaultMode = "walking", onApply }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  const [stops, setStops] = useState<RouteStop[]>(() => {
    // URL 파라미터에서 공유된 코스 복원
    if (typeof window === "undefined") return [];
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("route");
    if (!raw) return [];
    try {
      return raw.split("|").map((part, i) => {
        const [lat, lng, ...nameParts] = part.split(",");
        return { id: `url_${i}`, name: decodeURIComponent(nameParts.join(",")), lat: parseFloat(lat), lng: parseFloat(lng), stayMin: 30 };
      }).filter((s) => !isNaN(s.lat) && !isNaN(s.lng));
    } catch { return []; }
  });
  const [mode, setMode] = useState<TravelMode>(() => {
    if (typeof window === "undefined") return defaultMode;
    const m = new URLSearchParams(window.location.search).get("mode") as TravelMode;
    return (["walking", "cycling", "driving"].includes(m) ? m : defaultMode);
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load Leaflet CSS once
  useEffect(() => {
    if (document.querySelector("#leaflet-css")) return;
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }, []);

  // Init map
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapDivRef.current) return;

      // Fix default icons
      const proto = L.Icon.Default.prototype as any;
      delete proto._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapDivRef.current, {
        center: [33.38, 126.55],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.attribution({ prefix: "© OSM" }).addTo(map);

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        setReverseLoading(true);
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko`
        )
          .then((r) => r.json())
          .then((data) => {
            const name = data.display_name?.split(",")[0] || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setStops((prev) => [
              ...prev,
              { id: `${Date.now()}`, name, lat, lng, stayMin: 30 },
            ]);
          })
          .catch(() => {
            setStops((prev) => [
              ...prev,
              { id: `${Date.now()}`, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng, stayMin: 30 },
            ]);
          })
          .finally(() => setReverseLoading(false));
      });

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers + polyline
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      stops.forEach((stop, idx) => {
        const icon = L.divIcon({
          html: `<div style="background:#F97316;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)">${idx + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          className: "",
        });
        const marker = L.marker([stop.lat, stop.lng], { icon })
          .addTo(mapRef.current)
          .bindTooltip(stop.name, { direction: "top", offset: [0, -4] });
        markersRef.current.push(marker);
      });

      if (stops.length >= 2) {
        const latlngs = stops.map((s) => [s.lat, s.lng] as [number, number]);
        polylineRef.current = L.polyline(latlngs, {
          color: "#F97316",
          weight: 3,
          dashArray: "8 5",
          opacity: 0.85,
        }).addTo(mapRef.current);
        mapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [36, 36] });
      } else if (stops.length === 1) {
        mapRef.current.setView([stops[0].lat, stops[0].lng], 14);
      }
    });
  }, [stops]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + " 제주")}&viewbox=126.1,33.1,127.1,33.6&bounded=1&format=json&limit=6&accept-language=ko`
      );
      setResults(await res.json());
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  const addFromSearch = (r: any) => {
    const name = r.display_name.split(",")[0];
    setStops((prev) => [
      ...prev,
      { id: `${Date.now()}`, name, lat: parseFloat(r.lat), lng: parseFloat(r.lon), stayMin: 30 },
    ]);
    setResults([]);
    setQuery("");
  };

  const removeStop = (id: string) => setStops((prev) => prev.filter((s) => s.id !== id));
  const updateStay = (id: string, min: number) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, stayMin: min } : s)));

  // Segment calculations
  const segments = stops.slice(1).map((stop, i) => {
    const dist = haversine(stops[i].lat, stops[i].lng, stop.lat, stop.lng);
    const travelMin = Math.max(1, Math.round((dist / SPEEDS[mode]) * 60));
    return { dist, travelMin };
  });

  const totalDist = segments.reduce((sum, s) => sum + s.dist, 0);
  const totalTravel = segments.reduce((sum, s) => sum + s.travelMin, 0);
  const totalStay = stops.reduce((sum, s) => sum + s.stayMin, 0);

  const handleShare = async () => {
    const routeParam = stops
      .map((s) => `${s.lat.toFixed(5)},${s.lng.toFixed(5)},${encodeURIComponent(s.name)}`)
      .join("|");
    const url = `${window.location.origin}${window.location.pathname}?route=${routeParam}&mode=${mode}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `제주 코스 — ${stops.length}곳`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* cancelled */ }
  };

  const handleApply = () => {
    if (stops.length === 0) return;
    const items: ScheduleItem[] = [];
    let t = startTime;
    stops.forEach((stop, idx) => {
      items.push({ time: t, place: stop.name, memo: `약 ${stop.stayMin}분` });
      t = addMin(t, stop.stayMin);
      if (idx < stops.length - 1) t = addMin(t, segments[idx].travelMin);
    });
    onApply(items);
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="장소 검색 (예: 성산일출봉, 카페 이름...)"
          className="flex-1 pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none"
        />
        <span className="absolute left-3 top-3 text-gray-400 text-sm">🔍</span>
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold disabled:opacity-50 shrink-0"
        >
          {searching ? "…" : "검색"}
        </button>
      </div>

      {/* Search results dropdown */}
      {results.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => addFromSearch(r)}
              className="w-full px-3 py-2.5 text-left hover:bg-orange-50 border-b last:border-b-0 border-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">{r.display_name.split(",")[0]}</span>
              <span className="text-[11px] text-gray-400 ml-2 truncate">
                {r.display_name.split(",").slice(1, 3).join(", ")}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 relative">
        {reverseLoading && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-orange-500 text-white text-[11px] px-3 py-1 rounded-full shadow">
            📍 장소 가져오는 중...
          </div>
        )}
        <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur text-[10px] text-gray-500 px-2 py-1 rounded-lg shadow-sm pointer-events-none">
          지도 클릭 → 경유지 추가
        </div>
        <div ref={mapDivRef} style={{ height: 300 }} />
      </div>

      {/* Travel mode */}
      <div className="flex gap-2">
        {(["walking", "cycling", "driving"] as TravelMode[]).map((m) => {
          const [label, speed] = MODE_LABELS[m];
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all leading-tight ${
                mode === m ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
              <br />
              <span className="text-[10px] opacity-70">{speed}</span>
            </button>
          );
        })}
      </div>

      {/* Stops list */}
      {stops.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-3">
          지도를 클릭하거나 장소를 검색해서 경유지를 추가하세요
        </p>
      ) : (
        <div className="space-y-0.5">
          {stops.map((stop, idx) => (
            <div key={stop.id}>
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800 truncate">{stop.name}</span>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
                  <span>체류</span>
                  <input
                    type="number"
                    value={stop.stayMin}
                    min={5}
                    max={240}
                    step={5}
                    onChange={(e) => updateStay(stop.id, parseInt(e.target.value) || 30)}
                    className="w-10 text-center border border-orange-200 rounded-lg text-xs py-0.5 bg-white"
                  />
                  <span>분</span>
                </div>
                <button
                  onClick={() => removeStop(stop.id)}
                  className="text-gray-300 hover:text-red-400 text-sm ml-1 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Segment info */}
              {idx < stops.length - 1 && segments[idx] && (
                <div className="flex items-center gap-2 pl-10 py-1">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-3 bg-orange-200" />
                    <div className="w-px h-3 bg-orange-200" />
                  </div>
                  <span className="text-[10px] text-orange-400 font-medium">
                    {fmtDist(segments[idx].dist)} · {fmtMin(segments[idx].travelMin)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary + Apply */}
      {stops.length >= 2 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>
                총 거리{" "}
                <span className="font-bold text-gray-700">{fmtDist(totalDist)}</span>
                {" · "}이동{" "}
                <span className="font-bold text-gray-700">{fmtMin(totalTravel)}</span>
              </p>
              <p>
                체류{" "}
                <span className="font-bold text-gray-700">{fmtMin(totalStay)}</span>
                {" · "}총{" "}
                <span className="font-bold text-gray-700">{fmtMin(totalTravel + totalStay)}</span>
              </p>
            </div>
            <button
              onClick={handleApply}
              className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shrink-0 shadow-sm shadow-orange-200"
            >
              일정에 적용 →
            </button>
          </div>
          <button
            onClick={handleShare}
            className="w-full py-2 border border-gray-200 bg-white rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? "✅ 링크 복사됨!" : "🔗 이 코스 공유하기"}
          </button>
        </div>
      )}
    </div>
  );
}
