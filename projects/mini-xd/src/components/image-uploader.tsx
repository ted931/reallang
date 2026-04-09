"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { processImage, imageFromClipboard } from "@/lib/image-utils";
import { useProjectStore } from "@/store/use-project-store";

export function ImageUploader() {
  const { setImage, setError, imageBase64 } = useProjectStore();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setError(null);
        const { base64, mediaType } = await processImage(file);
        setImage(base64, mediaType, file.name);
        setPreview(URL.createObjectURL(file));
      } catch (err) {
        setError(err instanceof Error ? err.message : "이미지 처리 실패");
      }
    },
    [setImage, setError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const file = imageFromClipboard(e.clipboardData);
      if (file) handleFile(file);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-8
        transition-all duration-200 flex flex-col items-center justify-center
        min-h-[280px]
        ${isDragging
          ? "border-blue-500 bg-blue-50 scale-[1.02]"
          : imageBase64
            ? "border-green-400 bg-green-50/50"
            : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={preview}
            alt="업로드된 디자인"
            className="max-h-[200px] rounded-lg shadow-md object-contain"
          />
          <p className="text-sm text-gray-500">클릭하거나 새 이미지를 드롭하여 교체</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
            🎨
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              디자인 이미지를 드롭하세요
            </p>
            <p className="text-sm text-gray-500 mt-1">
              또는 클릭하여 선택 · 클립보드 붙여넣기(Ctrl+V) 가능
            </p>
          </div>
          <p className="text-xs text-gray-400">PNG, JPEG, WebP, GIF · 최대 5MB</p>
        </div>
      )}
    </div>
  );
}
