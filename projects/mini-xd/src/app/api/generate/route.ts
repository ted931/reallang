import { NextRequest } from "next/server";
import { getClient, createStreamingResponse } from "@/lib/claude";
import { GENERATE_SYSTEM_PROMPT } from "@/lib/prompts/generate";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { ir } = await req.json();

  if (!ir) {
    return Response.json({ error: "JSON IR이 제공되지 않았습니다." }, { status: 400 });
  }

  const client = getClient();

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini", // TODO: gpt-4o로 업그레이드
    max_tokens: 8192,
    temperature: 0.2,
    stream: true,
    messages: [
      { role: "system", content: GENERATE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Convert this JSON IR to a complete, working React + Tailwind component:\n\n${JSON.stringify(ir, null, 2)}`,
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
