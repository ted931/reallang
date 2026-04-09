import { z } from "zod";

// 느슨한 스키마 — AI 출력 형식이 다양할 수 있으므로 최소한만 검증
export const ComponentNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
}).passthrough();

export const SectionSchema = z.object({
  id: z.string(),
  tag: z.string(),
}).passthrough();

export const DesignIRSchema = z.object({
  meta: z.object({
    pageType: z.string(),
  }).passthrough(),
  theme: z.object({
    colors: z.record(z.unknown()),
  }).passthrough(),
  layout: z.object({
    sections: z.array(SectionSchema),
  }).passthrough(),
  components: z.array(ComponentNodeSchema),
}).passthrough();

export type DesignIR = z.infer<typeof DesignIRSchema>;
export type ComponentNode = z.infer<typeof ComponentNodeSchema>;
export type Section = z.infer<typeof SectionSchema>;
