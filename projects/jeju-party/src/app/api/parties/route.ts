import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "suggest_course") {
    return suggestCourse(body.category, body.region);
  }
  if (body.action === "suggest_schedule") {
    return suggestSchedule(body.category, body.region, body.date, body.time);
  }

  return NextResponse.json({ ok: true });
}

async function suggestSchedule(category: string, region: string, date?: string, startTime?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ schedule: [], description: "" });

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `제주도 취미 활동 일정을 만드는 AI. 실존하는 제주 장소만 사용.
반드시 아래 JSON만 출력. 다른 텍스트 없이.
{
  "description": "파티 소개 텍스트 (2~3문장)",
  "schedule": [
    { "time": "10:00", "place": "장소명", "memo": "간단 설명" }
  ]
}
일정은 4~8개 항목. 시작시간은 ${startTime || "10:00"}부터. 마지막에 식사/해산 포함.`,
        },
        {
          role: "user",
          content: `제주도 ${region}에서 "${category}" 활동 일정을 짜줘.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ schedule: [], description: "" });

    const data = JSON.parse(raw);
    return NextResponse.json({
      schedule: data.schedule || [],
      description: data.description || "",
    });
  } catch {
    return NextResponse.json({ schedule: [], description: "" });
  }
}

async function suggestCourse(category: string, region: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ suggestion: "" });

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 500,
      messages: [
        { role: "system", content: "제주도 여행 취미 활동 코스를 추천하는 AI. 실존 장소만 사용. 한국어로 200자 이내로 간결하게." },
        { role: "user", content: `제주도 ${region} 지역에서 "${category}" 활동을 하려고 해요. 코스와 팁을 추천해주세요.` },
      ],
    });
    return NextResponse.json({ suggestion: completion.choices[0]?.message?.content || "" });
  } catch {
    return NextResponse.json({ suggestion: "" });
  }
}

export async function GET() {
  return NextResponse.json({ parties: [] });
}
