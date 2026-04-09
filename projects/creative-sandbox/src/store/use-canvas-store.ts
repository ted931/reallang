import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  code?: string;
  timestamp: number;
}

interface CanvasState {
  canvasId: string | null;
  setCanvasId: (id: string) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEditor: (editor: any) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;

  isChatOpen: boolean;
  toggleChat: () => void;

  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;

  visibility: "private" | "public";
  setVisibility: (v: "private" | "public") => void;

  error: string | null;
  setError: (err: string | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  canvasId: null,
  setCanvasId: (id) => set({ canvasId: id }),
  editor: null,
  setEditor: (editor) => set({ editor }),

  chatMessages: [],
  addChatMessage: (msg) =>
    set((s) => ({
      chatMessages: [
        ...s.chatMessages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  isChatOpen: false,
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),

  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),

  visibility: "private",
  setVisibility: (v) => set({ visibility: v }),

  error: null,
  setError: (err) => set({ error: err }),
}));
