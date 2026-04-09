"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/use-project-store";

const DEMO_IR = {
  meta: { pageType: "landing", viewport: { width: 1280, height: 800 }, confidence: 0.9 },
  theme: {
    colors: { primary: "#3b82f6", secondary: "#8b5cf6", background: "#ffffff", surface: "#f9fafb", text: { primary: "#111827", secondary: "#6b7280" }, accent: "#f59e0b" },
    typography: { headingFont: "Inter", bodyFont: "Inter", scale: { h1: "text-4xl", h2: "text-2xl", body: "text-base" } },
    spacing: "normal" as const, borderRadius: "lg" as const,
  },
  layout: { type: "hero-sections" as const, sections: [{ id: "s1", tag: "header" as const, layout: "flex-row" as const, children: ["c1"] }] },
  components: [{ id: "c1", type: "hero" as const, props: {}, content: { text: "Demo Hero" }, style: {} }],
};

const DEMO_CODE = `<!-- HTML -->
<div class="page">
  <header class="header">
    <h1 class="logo">Demo App</h1>
    <nav class="nav">
      <a href="#">홈</a>
      <a href="#">소개</a>
      <a href="#">연락처</a>
    </nav>
  </header>
  <main class="hero">
    <h2>에디터 테스트 페이지</h2>
    <p>이 코드를 자유롭게 수정해보세요. 채팅으로 AI에게 요청할 수도 있습니다.</p>
    <button class="btn-primary">시작하기</button>
  </main>
</div>

<!-- CSS -->
.header { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; border-bottom: 1px solid #e5e7eb; }
.logo { font-size: 20px; font-weight: 700; color: #2563eb; }
.nav { display: flex; gap: 16px; }
.nav a { font-size: 14px; color: #6b7280; text-decoration: none; }
.nav a:hover { color: #111827; }
.hero { max-width: 800px; margin: 0 auto; padding: 80px 32px; text-align: center; }
.hero h2 { font-size: 48px; font-weight: 700; color: #111827; margin-bottom: 24px; }
.hero p { font-size: 20px; color: #6b7280; margin-bottom: 32px; }
.btn-primary { padding: 12px 32px; background: #2563eb; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #1d4ed8; }

<!-- JS -->`;

export function DevNav() {
  const pathname = usePathname();
  const router = useRouter();
  const store = useProjectStore();

  const goToEditor = () => {
    store.setIR(DEMO_IR);
    store.setCode(DEMO_CODE);
    store.setPhase("editing");
    router.push("/editor");
  };

  return (
    <div className="bg-gray-900 text-white sticky top-0 z-[9999]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">Mini XD</span>
        <Link
          href="/"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
            pathname === "/" ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          🎨 업로드
        </Link>
        <button
          onClick={goToEditor}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
            pathname === "/editor" ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          💻 에디터
        </button>
        <span className="text-[10px] text-gray-600 ml-auto whitespace-nowrap">테스트 네비</span>
      </div>
    </div>
  );
}
