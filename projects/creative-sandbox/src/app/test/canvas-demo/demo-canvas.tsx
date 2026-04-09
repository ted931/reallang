"use client";

import { Tldraw, type Editor } from "tldraw";
import { useCallback } from "react";
import { LiveWidgetShapeUtil } from "@/components/canvas/live-widget-shape";
import { useCanvasStore } from "@/store/use-canvas-store";

const customShapeUtils = [LiveWidgetShapeUtil];

export function DemoCanvas() {
  const { setEditor } = useCanvasStore();

  const handleMount = useCallback(
    (editor: Editor) => {
      setEditor(editor);

      // Insert a demo widget to show it works
      editor.createShape({
        type: "live-widget",
        x: 200,
        y: 200,
        props: {
          code: `() => {
  const [count, setCount] = useState(0);
  return (
    <div style={{padding:20, textAlign:"center"}}>
      <h2 style={{fontSize:18, fontWeight:600, marginBottom:12}}>카운터 데모</h2>
      <p style={{fontSize:32, fontWeight:700, color:"#4f46e5"}}>{count}</p>
      <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:12}}>
        <button
          onClick={() => setCount(c => c - 1)}
          style={{padding:"8px 16px", borderRadius:8, border:"1px solid #ddd", cursor:"pointer", background:"white"}}
        >-</button>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{padding:"8px 16px", borderRadius:8, border:"none", background:"#4f46e5", color:"white", cursor:"pointer"}}
        >+</button>
      </div>
    </div>
  );
}`,
          w: 280,
          h: 200,
          title: "카운터 데모 위젯",
        },
      });
    },
    [setEditor]
  );

  return (
    <div className="w-full h-full">
      <Tldraw shapeUtils={customShapeUtils} onMount={handleMount} />
    </div>
  );
}
