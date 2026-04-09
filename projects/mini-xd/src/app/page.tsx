"use client";

import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/image-uploader";
import { ContextSelector } from "@/components/context-selector";
import { useProjectStore } from "@/store/use-project-store";
import { consumeSSE } from "@/lib/stream-utils";

export default function Home() {
  const router = useRouter();
  const {
    imageBase64, imageMediaType, siteType,
    phase, setPhase, setCode, setIR, setError, error,
  } = useProjectStore();

  const handleGenerate = async () => {
    if (!imageBase64) return;

    setPhase("analyzing");
    setError(null);

    // IR 단계 없이 바로 코드 생성 (4o가 이미지→코드 직접 변환)
    let accumulated = "";

    await consumeSSE(
      "/api/analyze",
      { image: imageBase64, mediaType: imageMediaType, siteType },
      (chunk) => {
        accumulated += chunk;
        setCode(accumulated);
      },
      (fullText) => {
        // 마크다운 펜스 제거
        const cleaned = fullText.replace(/```html\s*/g, '').replace(/```\s*/g, '').trim();
        setCode(cleaned);
        setIR({ meta: { pageType: siteType || "landing" }, theme: { colors: {} }, layout: { sections: [] }, components: [] });
        setPhase("editing");
        router.push("/editor");
      },
      (err) => {
        setError(err);
        setPhase("upload");
      }
    );
  };

  const isGenerating = phase === "analyzing";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Mini <span className="text-blue-600">XD</span>
          </h1>
          <p className="text-gray-500 text-lg">
            디자인 이미지를 업로드하면 AI가 코드로 변환합니다
          </p>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <ImageUploader />
          <ContextSelector />

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!imageBase64 || isGenerating}
            className={`
              w-full py-3 px-6 rounded-xl text-white font-semibold text-lg
              transition-all duration-200
              ${isGenerating
                ? "bg-blue-400 cursor-wait"
                : imageBase64
                  ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg active:scale-[0.99]"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                코드 생성 중...
              </span>
            ) : (
              "코드 생성하기"
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Powered by GPT-4o · HTML + CSS + JS
        </p>
      </div>
    </div>
  );
}
