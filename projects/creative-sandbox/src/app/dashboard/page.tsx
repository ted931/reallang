"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Canvas {
  id: string;
  title: string;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const loadCanvases = async () => {
    const { data } = await supabase
      .from("canvases")
      .select("id, title, visibility, created_at, updated_at")
      .order("updated_at", { ascending: false });
    setCanvases(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCanvases();
  }, []);

  const handleCreate = async () => {
    const title = newTitle.trim() || "Untitled Canvas";
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("canvases")
      .insert({ title, owner_id: user.id })
      .select()
      .single();

    if (data) {
      router.push(`/canvas/${data.id}`);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("canvases").delete().eq("id", id);
    setCanvases((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Creative <span className="text-indigo-600">Sandbox</span>
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">내 캔버스</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-500 transition-colors"
          >
            + 새 캔버스
          </button>
        </div>

        {/* Create dialog */}
        {showCreate && (
          <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="캔버스 이름 (선택)"
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500"
            >
              생성
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-gray-500 text-sm rounded-lg hover:bg-gray-100"
            >
              취소
            </button>
          </div>
        )}

        {/* Canvas grid */}
        {loading ? (
          <p className="text-gray-400 text-center py-12">불러오는 중...</p>
        ) : canvases.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎨</div>
            <p className="text-gray-500">아직 캔버스가 없습니다</p>
            <p className="text-sm text-gray-400 mt-1">
              새 캔버스를 만들어 아이디어를 시작하세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvases.map((canvas) => (
              <div
                key={canvas.id}
                onClick={() => router.push(`/canvas/${canvas.id}`)}
                className="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {canvas.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      canvas.visibility === "public"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {canvas.visibility === "public" ? "공개" : "비공개"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(canvas.updated_at).toLocaleDateString("ko-KR")} 수정
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("이 캔버스를 삭제할까요?")) handleDelete(canvas.id);
                  }}
                  className="mt-2 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
