"use client";

import { Tldraw, type Editor } from "tldraw";
import { useCallback, useRef } from "react";
import { LiveWidgetShapeUtil } from "./live-widget-shape";
import { useCanvasStore } from "@/store/use-canvas-store";
import { createClient } from "@/lib/supabase/client";

const customShapeUtils = [LiveWidgetShapeUtil];

interface Props {
  canvasId: string;
  initialSnapshot: Record<string, unknown> | null;
}

export function CreativeCanvas({ canvasId, initialSnapshot }: Props) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { setEditor } = useCanvasStore();
  const supabase = createClient();

  const handleMount = useCallback(
    (editor: Editor) => {
      setEditor(editor);

      // Load saved snapshot
      if (initialSnapshot) {
        try {
          editor.store.loadStoreSnapshot(initialSnapshot as unknown as Parameters<typeof editor.store.loadStoreSnapshot>[0]);
        } catch {
          // snapshot might be incompatible, start fresh
        }
      }

      // Auto-save on changes (debounced 2s)
      editor.store.listen(
        () => {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(async () => {
            const snapshot = editor.store.getStoreSnapshot();
            await supabase
              .from("canvases")
              .update({
                canvas_snapshot: snapshot as unknown as Record<string, unknown>,
                updated_at: new Date().toISOString(),
              })
              .eq("id", canvasId);
          }, 2000);
        },
        { source: "user", scope: "document" }
      );
    },
    [canvasId, initialSnapshot, setEditor, supabase]
  );

  return (
    <div className="w-full h-full">
      <Tldraw shapeUtils={customShapeUtils} onMount={handleMount} />
    </div>
  );
}
