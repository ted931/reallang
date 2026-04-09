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

  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;

  viewportWidth: number;
  setViewportWidth: (w: number) => void;

  error: string | null;
  setError: (err: string | null) => void;

  reset: () => void;
}

const initialState = {
  phase: "upload" as AppPhase,
  imageBase64: null,
  imageMediaType: null,
  imageName: null,
  siteType: "landing",
  ir: null,
  code: "",
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
