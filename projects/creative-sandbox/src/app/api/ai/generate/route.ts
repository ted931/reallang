import { NextRequest } from "next/server";
import { getClient, createStreamingResponse } from "@/lib/claude";
import { GENERATE_WIDGET_PROMPT } from "@/lib/prompts/generate-widget";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { message, chatHistory } = await req.json();

  if (!message) {
    return Response.json({ error: "메시지가 필요합니다." }, { status: 400 });
  }

  const client = getClient();

  const historyContext = (chatHistory || [])
    .slice(-6)
    .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
    .join("\n");

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 4096,
    temperature: 0.2,
    stream: true,
    messages: [
      { role: "system", content: GENERATE_WIDGET_PROMPT },
      {
        role: "user",
        content: `## 요청\n${message}\n\n## 대화 기록\n${historyContext || "없음"}`,
      },
    ],
  });

  return new Response(createStreamingResponse(stream), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
