import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CARS } from "@/lib/car-data";

const SYSTEM_PROMPT = `당신은 제주도 렌터카 전문 상담사입니다. 고객의 여행 정보를 듣고 최적의 차종을 추천합니다.

## 보유 차종
${CARS.map((c) => `- ${c.name} (${c.category}, ${c.seats}인승, 트렁크: ${c.trunkCapacity}, ${c.fuelType}, 일 ${c.pricePerDay.toLocaleString()}원) — ${c.bestFor.join(", ")}`).join("\n")}

## 규칙
1. 반드시 위 차종 중에서만 추천하세요.
2. 1순위 추천 + 이유, 2순위 대안을 제시하세요.
3. 업그레이드가 필요한 경우 명확히 안내하세요 ("짐이 많으시면 투싼 추천, 하루 +20,000원").
4. 제주도 특화 팁을 포함하세요 (주차, 도로 상황, 충전소 등).
5. 예상 총 비용을 계산해주세요.

## 출력 형식 (JSON만)
{
  "recommendation": {
    "carId": "차종 ID",
    "reason": "추천 이유 (2~3문장)",
    "tips": ["제주 팁1", "팁2"],
    "totalCost": 총비용(원),
    "costBreakdown": "일수 x 단가 = 총액"
  },
  "alternative": {
    "carId": "대안 차종 ID",
    "reason": "대안 이유",
    "priceDiff": "가격 차이 설명"
  },
  "summary": "한줄 요약"
}`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const body = await request.json();
  const { travelers, luggage, days, purpose, budget, preferences } = body;

  const userMessage = [
    `인원: ${travelers}명`,
    `짐: ${luggage}`,
    `일수: ${days}일`,
    `목적: ${purpose}`,
    budget ? `예산: ${budget.toLocaleString()}원` : "",
    preferences ? `선호: ${preferences}` : "",
  ].filter(Boolean).join("\n");

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ error: "AI 응답이 비어있습니다." }, { status: 500 });

    const result = JSON.parse(raw);

    // 차종 상세 정보 첨부
    const recCar = CARS.find((c) => c.id === result.recommendation?.carId);
    const altCar = CARS.find((c) => c.id === result.alternative?.carId);

    return NextResponse.json({
      ...result,
      recommendation: { ...result.recommendation, car: recCar },
      alternative: { ...result.alternative, car: altCar },
      allCars: CARS,
    });
  } catch (err: any) {
    console.error("Recommend error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
