"use client";

import dynamic from "next/dynamic";
import { useProjectStore } from "@/store/use-project-store";

const Editor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400 text-sm">
      에디터 로딩 중...
    </div>
  ),
});

export function CodeEditor() {
  const { code, setCode, phase } = useProjectStore();

  return (
    <Editor
      height="100%"
      language="typescriptreact"
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{
        minimap: { enabled: false },
        wordWrap: "on",
        readOnly: phase === "generating" || phase === "refining",
        fontSize: 13,
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        renderLineHighlight: "line",
        tabSize: 2,
        padding: { top: 12 },
      }}
    />
  );
}
