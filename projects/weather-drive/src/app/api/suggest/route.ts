import { NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `당신은 제주도 드라이브 코스 전문가입니다. 현재 날씨 데이터를 보고 최적의 드라이브 코스를 추천합니다.

## 규칙
1. 비 오는 지역은 피하고, 맑은 지역 중심으로 코스를 짜세요.
2. 비 오는 날엔 실내 코스(카페, 박물관, 실내 체험)를 추천하세요.
3. 바람이 강하면(풍속 10m/s 이상) 해안도로 대신 내륙 코스를 추천하세요.
4. 기온에 맞는 활동을 추천하세요 (더우면 해변/빙수, 추우면 카페/실내).
5. 반드시 실존하는 제주 장소만 사용하세요.
6. 코스는 3~5개 장소, 드라이브 동선이 효율적이어야 합니다.

## 출력 (JSON만)
{
  "courseName": "코스 이름",
  "description": "코스 설명 (2~3문장)",
  "weatherSummary": "현재 날씨 요약",
  "type": "outdoor|indoor|mixed",
  "stops": [
    {
      "order": 1,
      "name": "장소명",
      "category": "관광지|카페|식당|체험|해변|박물관",
      "description": "한줄 설명",
      "driveMinutes": 0,
      "tip": "꿀팁"
    }
  ],
  "totalDriveMinutes": 총이동시간,
  "bestTimeToGo": "추천 출발 시간"
}`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const { weatherData, preference } = await request.json();

  const weatherSummary = (weatherData || [])
    .map((loc: any) => `${loc.name}: ${loc.temperature}° ${loc.sky} 풍속${loc.windSpeed}m/s 강수${loc.rainfall}mm`)
    .join("\n");

  const userMessage = `## 현재 제주도 날씨
${weatherSummary}

## 사용자 선호
${preference || "특별한 선호 없음, 날씨에 맞게 추천해주세요"}

위 날씨를 고려해서 최적의 드라이브 코스를 추천해주세요.`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 1500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ error: "AI 응답이 비어있습니다." }, { status: 500 });

    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    console.error("Suggest error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
