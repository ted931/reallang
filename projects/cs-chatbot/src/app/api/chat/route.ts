import { NextResponse } from "next/server";
import OpenAI from "openai";
import { FAQ_DATA, SYSTEM_CONTEXT } from "@/lib/faq-data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// 간단한 키워드 매칭으로 FAQ 검색 (RAG 대용)
function findRelevantFAQs(query: string) {
  const q = query.toLowerCase();
  return FAQ_DATA.filter((faq) =>
    faq.keywords.some((kw) => q.includes(kw)) ||
    faq.question.toLowerCase().includes(q) ||
    q.includes(faq.category.toLowerCase())
  ).slice(0, 3);
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  let body: { messages: Message[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { messages } = body;
  const lastUserMsg = messages[messages.length - 1]?.content || "";

  // FAQ 매칭 시도
  const matched = findRelevantFAQs(lastUserMsg);
  let faqContext = "";
  if (matched.length > 0) {
    faqContext = "\n\n[관련 FAQ]\n" + matched.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        { role: "system", content: SYSTEM_CONTEXT + faqContext },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const reply = completion.choices[0]?.message?.content || "죄송합니다. 잠시 후 다시 시도해주세요.";

    return NextResponse.json({
      reply,
      matchedFAQs: matched.map((f) => ({ id: f.id, question: f.question, category: f.category })),
    });
  } catch (err: any) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: err.message || "응답 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
