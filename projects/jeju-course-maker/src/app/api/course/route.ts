import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { CourseRequest, CourseResult } from "@/lib/types";

const SYSTEM_PROMPT = `당신은 제주도 코스 설계 전문 AI입니다. 사용자의 취향에 맞는 최적의 제주 코스 3가지를 만들어주세요.

## 규칙
1. 반드시 실존하는 제주도 장소만 사용하세요.
2. 3가지 코스를 만들되, 각각 성격이 달라야 합니다 (예: 해안 중심, 산간 중심, 시내 중심).
3. 가장 추천하는 코스 1개에 recommended: true를 설정하세요.
4. 동선이 효율적이도록 인접 장소끼리 묶으세요.
5. 장소 간 이동시간(driveMinutes)을 반드시 포함하세요 (렌터카 기준).
6. 식사시간(아침/점심/저녁)을 반드시 포함하세요.
7. 총 이동거리(km)와 이동시간(분)을 계산하세요.

## 제주 권역별 주요 장소
- **제주시**: 용두암, 동문시장, 탑동, 이호테우, 한라수목원, 용연다리
- **애월/한림**: 애월카페거리, 협재해변, 한림공원, 새별오름, 금능해변, 곽지해변
- **서귀포**: 천지연폭포, 정방폭포, 이중섭거리, 올레시장, 새연교, 쇠소깍
- **중문**: 주상절리, 천제연폭포, 중문해변, 여미지식물원, 테디베어뮤지엄
- **성산**: 성산일출봉, 섭지코지, 광치기해변, 아쿠아플라넷
- **구좌/조천**: 월정리해변, 김녕미로공원, 만장굴, 비자림, 세화해변, 함덕해변
- **우도**: 하고수동해변, 검멀레해변, 우도봉, 피넛아이스크림
- **산간**: 한라산, 사려니숲길, 1100고지, 에코랜드, 절물자연휴양림

## 인기 맛집 (실존)
- 제주시: 우진해장국(몸국), 삼성혈해물탕, 올래국수
- 애월: 흑돈가, 봄날, 더럭분식
- 서귀포: 자매국수, 색달식당, 미영이네
- 성산: 성산해녀의집, 보말칼국수
- 중문: 도노미야, 제주갈치조림

## 출력 형식 (JSON만, 다른 텍스트 없이)

{
  "courses": [
    {
      "id": "A",
      "name": "코스명",
      "description": "코스 한줄 설명",
      "recommended": true|false,
      "days": [
        {
          "day": 1,
          "theme": "일자별 테마",
          "stops": [
            {
              "time": "09:00",
              "name": "장소명",
              "category": "관광지|식당|카페|액티비티|숙소|공항",
              "description": "설명",
              "estimatedCost": 비용(원),
              "address": "제주시 ○○로 ○○",
              "tip": "꿀팁",
              "driveMinutes": 이전장소에서이동시간(분)
            }
          ],
          "dayCost": 일별합계(원)
        }
      ],
      "totalCost": 총비용(원),
      "totalDriveKm": 총이동거리(km),
      "totalDriveMinutes": 총이동시간(분),
      "highlights": ["하이라이트1", "하이라이트2", "하이라이트3"]
    }
  ]
}`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  let body: CourseRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { prompt, days, companions, themes, budget, hasRentalCar } = body;

  const userMessage = [
    prompt,
    `일정: ${days}일`,
    `동행: ${companions}`,
    themes?.length ? `선호 테마: ${themes.join(", ")}` : "",
    `예산: ${budget.toLocaleString()}원 (${(budget / 10000).toFixed(0)}만원)`,
    `교통: ${hasRentalCar ? "렌터카 있음" : "대중교통/택시"}`,
    "",
    "3가지 서로 다른 성격의 코스를 만들어주세요.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      max_tokens: 4000,
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

    const result: CourseResult = {
      ...JSON.parse(raw),
      input: { days, companions, budget },
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Course generation error:", err);
    return NextResponse.json(
      { error: err.message || "코스 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
