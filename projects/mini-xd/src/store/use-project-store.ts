import { create } from "zustand";
import type { DesignIR } from "@/lib/ir-schema";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type AppPhase =
  | "upload"
  | "analyzing"
  | "generating"
  | "editing"
  | "refining";

interface ProjectState {
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;

  imageBase64: string | null;
  imageMediaType: string | null;
  imageName: string | null;
  setImage: (base64: string, mediaType: string, name: string) => void;

  siteType: string;
  setSiteType: (type: string) => void;

  ir: DesignIR | null;
  setIR: (ir: DesignIR) => void;

  code: string;
  setCode: (code: string) => void;
  appendCode: (chunk: string) => void;

  // Undo/Redo
  codeHistory: string[];
  historyIndex: number;
  pushHistory: (code: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // 원본 비교
  compareMode: "off" | "side" | "overlay";
  setCompareMode: (mode: "off" | "side" | "overlay") => void;
  overlayOpacity: number;
  setOverlayOpacity: (v: number) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;

  viewportWidth: number;
  setViewportWidth: (w: number) => void;

  error: string | null;
  setError: (err: string | null) => void;

  reset: () => void;
}

const MAX_HISTORY = 50;

const initialState = {
  phase: "upload" as AppPhase,
  imageBase64: null,
  imageMediaType: null,
  imageName: null,
  siteType: "landing",
  ir: null,
  code: "",
  codeHistory: [] as string[],
  historyIndex: -1,
  compareMode: "off" as "off" | "side" | "overlay",
  overlayOpacity: 50,
  chatMessages: [] as ChatMessage[],
  viewportWidth: 1280,
  error: null,
};

export const useProjectStore = create<ProjectState>((set) => ({
  ...initialState,
  setPhase: (phase) => set({ phase }),
  setImage: (base64, mediaType, name) =>
    set({ imageBase64: base64, imageMediaType: mediaType, imageName: name }),
  setSiteType: (type) => set({ siteType: type }),
  setIR: (ir) => set({ ir }),
  setCode: (code) => set({ code }),
  appendCode: (chunk) => set((s) => ({ code: s.code + chunk })),

  // Undo/Redo
  pushHistory: (code) =>
    set((s) => {
      const trimmed = s.codeHistory.slice(0, s.historyIndex + 1);
      const next = [...trimmed, code].slice(-MAX_HISTORY);
      return { codeHistory: next, historyIndex: next.length - 1 };
    }),
  undo: () =>
    set((s) => {
      if (s.historyIndex <= 0) return s;
      const newIndex = s.historyIndex - 1;
      return { historyIndex: newIndex, code: s.codeHistory[newIndex] };
    }),
  redo: () =>
    set((s) => {
      if (s.historyIndex >= s.codeHistory.length - 1) return s;
      const newIndex = s.historyIndex + 1;
      return { historyIndex: newIndex, code: s.codeHistory[newIndex] };
    }),
  canUndo: () => {
    const s = useProjectStore.getState();
    return s.historyIndex > 0;
  },
  canRedo: () => {
    const s = useProjectStore.getState();
    return s.historyIndex < s.codeHistory.length - 1;
  },

  // 원본 비교
  setCompareMode: (mode) => set({ compareMode: mode }),
  setOverlayOpacity: (v) => set({ overlayOpacity: v }),

  addChatMessage: (msg) =>
    set((s) => ({
      chatMessages: [
        ...s.chatMessages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),
  setViewportWidth: (w) => set({ viewportWidth: w }),
  setError: (err) => set({ error: err }),
  reset: () => set(initialState),
}));
