import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "suggest_course") {
    return suggestCourse(body.category, body.region);
  }

  // TODO: Supabase INSERT for party creation
  return NextResponse.json({ ok: true });
}

async function suggestCourse(category: string, region: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestion: "" });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: "제주도 여행 취미 활동 코스를 추천하는 AI. 실존 장소만 사용. 한국어로 200자 이내로 간결하게.",
        },
        {
          role: "user",
          content: `제주도 ${region} 지역에서 "${category}" 활동을 하려고 해요. 코스와 팁을 추천해주세요. 이동경로, 예상 소요시간, 추천 맛집 포함.`,
        },
      ],
    });

    const suggestion = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ suggestion });
  } catch {
    return NextResponse.json({ suggestion: "" });
  }
}

export async function GET() {
  // TODO: Supabase SELECT for party list
  return NextResponse.json({ parties: [] });
}
