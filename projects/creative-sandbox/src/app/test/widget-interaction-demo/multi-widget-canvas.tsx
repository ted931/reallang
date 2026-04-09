"use client";

import { Tldraw, type Editor } from "tldraw";
import { useCallback } from "react";
import { LiveWidgetShapeUtil } from "@/components/canvas/live-widget-shape";
import { useCanvasStore } from "@/store/use-canvas-store";

const customShapeUtils = [LiveWidgetShapeUtil];

const DEMO_WIDGETS = [
  {
    x: 100, y: 100, w: 280, h: 220, title: "카운터",
    code: `() => {
  const [count, setCount] = useState(0);
  return (
    <div style={{padding:20, textAlign:"center"}}>
      <h3 style={{fontSize:16, fontWeight:600, marginBottom:8}}>카운터</h3>
      <p style={{fontSize:40, fontWeight:700, color:"#4f46e5"}}>{count}</p>
      <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:12}}>
        <button onClick={() => setCount(c => c-1)} style={{padding:"8px 20px", borderRadius:8, border:"1px solid #ddd", cursor:"pointer", fontSize:18}}>−</button>
        <button onClick={() => setCount(c => c+1)} style={{padding:"8px 20px", borderRadius:8, border:"none", background:"#4f46e5", color:"white", cursor:"pointer", fontSize:18}}>+</button>
      </div>
    </div>
  );
}`,
  },
  {
    x: 420, y: 100, w: 300, h: 280, title: "메모장",
    code: `() => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const addNote = () => { if(input.trim()) { setNotes([...notes, input.trim()]); setInput(""); } };
  return (
    <div style={{padding:16}}>
      <h3 style={{fontSize:16, fontWeight:600, marginBottom:8}}>메모장</h3>
      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && addNote()}
          placeholder="메모 입력..." style={{flex:1, padding:"6px 10px", border:"1px solid #ddd", borderRadius:6, fontSize:13}} />
        <button onClick={addNote} style={{padding:"6px 14px", background:"#059669", color:"white", border:"none", borderRadius:6, cursor:"pointer", fontSize:13}}>추가</button>
      </div>
      <div style={{maxHeight:160, overflow:"auto"}}>
        {notes.map((n, i) => (
          <div key={i} style={{padding:"6px 10px", background:"#f0fdf4", borderRadius:6, marginBottom:4, fontSize:13, display:"flex", justifyContent:"space-between"}}>
            <span>{n}</span>
            <button onClick={() => setNotes(notes.filter((_,j) => j!==i))} style={{color:"#ef4444", cursor:"pointer", border:"none", background:"none", fontSize:12}}>삭제</button>
          </div>
        ))}
        {notes.length === 0 && <p style={{color:"#9ca3af", fontSize:13, textAlign:"center"}}>메모가 없습니다</p>}
      </div>
    </div>
  );
}`,
  },
  {
    x: 760, y: 100, w: 260, h: 240, title: "컬러 피커",
    code: `() => {
  const [color, setColor] = useState("#4f46e5");
  const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#1e1e1e"];
  return (
    <div style={{padding:20, textAlign:"center"}}>
      <h3 style={{fontSize:16, fontWeight:600, marginBottom:12}}>컬러 피커</h3>
      <div style={{width:80, height:80, borderRadius:16, background:color, margin:"0 auto 16px", boxShadow:"0 4px 12px rgba(0,0,0,0.15)", transition:"background 0.2s"}} />
      <p style={{fontSize:13, color:"#6b7280", marginBottom:12, fontFamily:"monospace"}}>{color}</p>
      <div style={{display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap"}}>
        {colors.map(c => (
          <button key={c} onClick={() => setColor(c)}
            style={{width:28, height:28, borderRadius:"50%", background:c, border: color===c ? "3px solid #000" : "2px solid #e5e7eb", cursor:"pointer", transition:"border 0.15s"}} />
        ))}
      </div>
    </div>
  );
}`,
  },
];

export function MultiWidgetCanvas() {
  const { setEditor } = useCanvasStore();

  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor);
    DEMO_WIDGETS.forEach((widget) => {
      editor.createShape({
        type: "live-widget",
        x: widget.x,
        y: widget.y,
        props: { code: widget.code, w: widget.w, h: widget.h, title: widget.title },
      });
    });
  }, [setEditor]);

  return (
    <div className="w-full h-full">
      <Tldraw shapeUtils={customShapeUtils} onMount={handleMount} />
    </div>
  );
}
