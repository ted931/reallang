'use client';

import { useState } from 'react';
import { BRAND } from '@/lib/constants';

interface QRSectionProps {
  shopId: string;
  shopName: string;
}

export default function QRSection({ shopId, shopName }: QRSectionProps) {
  const [open, setOpen] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const qrUrl = `${basePath}/api/shops/${shopId}/qr`;

  const handleDownload = async () => {
    const res = await fetch(`${qrUrl}?format=png`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shopName}-qr.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ backgroundColor: BRAND.colorLight }}>
          📱
        </span>
        손님 사진 QR 코드
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* QR 이미지 */}
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${qrUrl}?format=png`}
                alt={`${shopName} QR 코드`}
                className="w-32 h-32 rounded-lg border border-gray-100"
              />
            </div>

            {/* 설명 + 버튼 */}
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-gray-800">테이블에 QR 코드를 붙여두세요</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                손님이 QR을 찍으면 이 가게 페이지로 바로 연결됩니다.
                사진 업로드, 리뷰 작성이 가능해져 자연스럽게 홍보가 쌓여요.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: BRAND.color }}
                >
                  PNG 다운로드
                </button>
                <a
                  href={`${qrUrl}?format=svg`}
                  download={`${shopName}-qr.svg`}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  SVG 다운로드
                </a>
              </div>
              <p className="text-[10px] text-gray-400">
                인쇄 시 SVG 권장 · PNG는 디지털 화면용
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
