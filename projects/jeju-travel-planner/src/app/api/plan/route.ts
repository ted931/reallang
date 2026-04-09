import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import type { TravelPlan, TravelRequest } from "@/lib/types";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const SYSTEM_PROMPT = `당신은 제주도 여행 전문 AI 플래너입니다. 사용자의 요구사항에 맞는 최적의 제주 여행 일정을 만들어주세요.

## 규칙
1. 반드시 실존하는 제주도 장소만 추천하세요.
2. 동선이 효율적이도록 인접한 장소끼리 묶으세요 (제주시권, 서귀포권, 동부, 서부 등).
3. 예산은 숙소, 식사, 교통(렌터카), 관광/액티비티 기준으로 현실적으로 배분하세요.
4. 각 장소에 예상 비용을 반드시 포함하세요.
5. 이동 시간을 고려하여 너무 빡빡하지 않게 구성하세요.
6. 식사 시간(아침/점심/저녁)을 반드시 포함하세요.
7. 날짜별 테마를 설정하세요 (예: "서쪽 해안 힐링", "동쪽 자연 탐방").

## 제주 주요 권역
- **제주시권**: 용두암, 동문시장, 탑동해변, 이호테우해변, 한라수목원
- **애월/한림**: 애월카페거리, 협재해수욕장, 한림공원, 새별오름, 금능해변
- **서귀포**: 천지연폭포, 정방폭포, 이중섭거리, 올레시장, 새연교
- **중문**: 주상절리, 천제연폭포, 중문해수욕장, 여미지식물원, 테디베어뮤지엄
- **성산/우도**: 성산일출봉, 우도, 섭지코지, 광치기해변, 아쿠아플라넷
- **구좌/조천**: 월정리해변, 김녕미로공원, 만장굴, 비자림, 세화해변
- **산간**: 한라산(어리목/영실/성판악), 사려니숲길, 1100고지, 에코랜드

## 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

{
  "title": "여행 제목",
  "summary": "한 줄 요약",
  "nights": 숫자,
  "travelers": 숫자,
  "totalBudget": 총예산(원),
  "schedule": [
    {
      "day": 1,
      "date": "Day 1",
      "theme": "일자별 테마",
      "spots": [
        {
          "time": "09:00",
          "name": "장소명",
          "category": "숙소|식당|카페|관광지|액티비티|이동",
          "description": "설명",
          "estimatedCost": 비용(원),
          "address": "주소",
          "tip": "꿀팁"
        }
      ]
    }
  ],
  "budgetBreakdown": [
    { "category": "숙소", "amount": 금액 },
    { "category": "식비", "amount": 금액 },
    { "category": "교통", "amount": 금액 },
    { "category": "관광/액티비티", "amount": 금액 },
    { "category": "기타", "amount": 금액 }
  ],
  "packingTips": ["준비물1", "준비물2"]
}`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  let body: TravelRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { prompt, nights, travelers, budget, style } = body;

  const styleLabel = style?.length
    ? `여행 스타일: ${style.join(", ")}`
    : "";

  const userMessage = [
    prompt,
    `숙박: ${nights}박 ${nights + 1}일`,
    `인원: ${travelers}명`,
    `예산: ${budget.toLocaleString()}원 (${(budget / 10000).toFixed(0)}만원)`,
    styleLabel,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 3000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "AI 응답이 비어있습니다." }, { status: 500 });
    }

    const plan: TravelPlan = JSON.parse(raw);

    // 기본값 보정
    plan.nights = plan.nights || nights;
    plan.travelers = plan.travelers || travelers;

    // Supabase에 저장 (테이블 없으면 무시)
    const sb = getSupabase();
    if (sb) {
      sb.from("generated_plans").insert({
        type: "travel_plan",
        title: plan.title,
        summary: plan.summary,
        input_prompt: prompt,
        input_params: { nights, travelers, budget, style },
        result: plan,
        total_cost: plan.totalBudget || 0,
        days: (plan.nights || 0) + 1,
      }).then(() => {}).catch(() => {});
    }

    return NextResponse.json({ plan });
  } catch (err: any) {
    console.error("Plan generation error:", err);

    if (err.message?.includes("JSON")) {
      return NextResponse.json({ error: "AI 응답 파싱에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
    }

    return NextResponse.json(
      { error: err.message || "일정 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
