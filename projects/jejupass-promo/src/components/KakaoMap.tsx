'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  address: string;
  name: string;
}

export default function KakaoMap({ address, name }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState(false);

  const initMap = () => {
    if (!mapRef.current || !window.kakao?.maps) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any[], status: string) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        setError(true);
        return;
      }
      const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
      const map = new window.kakao.maps.Map(mapRef.current, { center: coords, level: 4 });
      const marker = new window.kakao.maps.Marker({ position: coords });
      marker.setMap(map);
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:13px;font-weight:bold;white-space:nowrap;">${name}</div>`,
      });
      infowindow.open(map, marker);
    });
  };

  useEffect(() => {
    if (sdkLoaded) initMap();
  }, [sdkLoaded, address]);

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => window.kakao.maps.load(() => setSdkLoaded(true))}
        onError={() => setError(true)}
      />
      {error ? (
        <a
          href={`https://map.kakao.com/link/search/${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-48 rounded-xl bg-gray-100 text-sm text-gray-500 hover:bg-gray-200 transition-colors"
        >
          🗺️ 카카오맵에서 보기 →
        </a>
      ) : !sdkLoaded ? (
        <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-400">
          지도 불러오는 중...
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-48 rounded-xl overflow-hidden" />
      )}
    </>
  );
}
