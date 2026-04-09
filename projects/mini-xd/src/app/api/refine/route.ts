import { NextRequest } from "next/server";
import { getClient, createStreamingResponse } from "@/lib/claude";

export const maxDuration = 60;

const REFINE_PROMPT = `You are a code refiner. You receive current HTML code and a user request. Output ONLY the complete updated HTML file. No explanations. No markdown fences. Start with <!DOCTYPE html>.

Rules:
- Keep using Tailwind CSS utility classes
- Apply the user's changes precisely
- Preserve everything not mentioned in the request
- Output the FULL complete HTML file
- If user says "디자인에 맞게" or "더 비슷하게": compare with the original design image and fix layout/colors/spacing`;

export async function POST(req: NextRequest) {
  const { message, currentCode, ir, chatHistory, originalImage, imageMediaType } = await req.json();

  if (!message || !currentCode) {
    return Response.json({ error: "메시지와 현재 코드가 필요합니다." }, { status: 400 });
  }

  const client = getClient();

  const historyContext = (chatHistory || [])
    .slice(-4)
    .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
    .join("\n");

  // 메시지 구성: 원본 이미지가 있으면 포함
  const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  // 원본 디자인 이미지 첨부 (있으면)
  if (originalImage) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:${imageMediaType || "image/webp"};base64,${originalImage}` },
    });
    userContent.push({
      type: "text",
      text: "위 이미지가 원본 디자인입니다. 이 디자인과 최대한 비슷하게 코드를 수정해주세요.\n\n",
    });
  }

  userContent.push({
    type: "text",
    text: `## 현재 코드\n${currentCode}\n\n## 이전 대화\n${historyContext || "없음"}\n\n## 수정 요청\n${message}\n\n위 요청에 맞게 전체 HTML 파일을 수정하여 출력해주세요. <!DOCTYPE html>부터 시작.`,
  });

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini", // TODO: gpt-4o로 업그레이드
    max_tokens: 8192,
    temperature: 0.1,
    stream: true,
    messages: [
      { role: "system", content: REFINE_PROMPT },
      { role: "user", content: userContent },
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
