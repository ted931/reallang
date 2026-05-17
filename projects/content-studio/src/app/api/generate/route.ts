import { NextResponse } from "next/server";
import OpenAI from "openai";

const BLOG_SYSTEM = `당신은 제주 여행·렌터카·카페 전문 블로그 작가입니다.
SEO에 최적화된 네이버·티스토리 블로그 글을 작성해주세요.

규칙:
- 제목(H1) 1개: 검색 키워드 포함, 클릭을 유도하는 제목
- 소제목(H2) 3~5개: 각 섹션마다 본문 2~4문단
- 전체 글자수 800~1200자
- 자연스러운 구어체 (너무 딱딱하지 않게)
- 각 소제목 아래 실용적인 정보 포함 (가격, 위치, 팁 등)
- 마지막에 "마무리" 또는 "정리" 섹션 포함
- JSON 형식으로 반환:
{
  "title": "H1 제목",
  "sections": [
    { "heading": "H2 소제목", "body": "본문 내용" }
  ],
  "seoKeywords": ["키워드1", "키워드2", "키워드3"],
  "summary": "블로그 글 한줄 요약 (메타 description용)"
}`;

const INSTA_SYSTEM = `당신은 인스타그램 제주 여행 인플루언서입니다.
감성적이고 공감가는 인스타그램 캡션을 작성해주세요.

규칙:
- 3가지 스타일의 캡션 작성 (감성형 / 정보형 / 유머형)
- 각 캡션 100~200자
- 각 캡션 아래 관련 해시태그 15~20개
- 이모지 적절히 사용
- JSON 형식으로 반환:
{
  "captions": [
    { "style": "감성형", "text": "캡션 내용", "hashtags": ["#태그1", "#태그2"] },
    { "style": "정보형", "text": "캡션 내용", "hashtags": ["#태그1", "#태그2"] },
    { "style": "유머형", "text": "캡션 내용", "hashtags": ["#태그1", "#태그2"] }
  ]
}`;

const CATEGORY_PROMPTS: Record<string, (data: Record<string, string>) => string> = {
  rental_car: (d) => `
렌터카 관련 블로그/콘텐츠를 작성해주세요.
주제: ${d.topic || "제주 렌터카 가성비 비교"}
차종: ${d.carType || ""}
가격 정보: ${d.priceInfo || ""}
특이사항: ${d.notes || ""}
`,
  cafepass: (d) => `
카페패스 관련 블로그/콘텐츠를 작성해주세요.
카페 이름 또는 지역: ${d.cafeName || "제주 카페패스 추천"}
테마/분위기: ${d.theme || ""}
리뷰 키워드: ${d.reviewKeywords || ""}
특이사항: ${d.notes || ""}
`,
  attraction: (d) => `
제주 관광지/장소 관련 블로그/콘텐츠를 작성해주세요.
장소명: ${d.placeName || ""}
지역: ${d.area || ""}
특징/볼거리: ${d.features || ""}
방문 팁: ${d.tips || ""}
`,
  review: (d) => `
다음 리뷰 데이터를 분석해서 블로그/콘텐츠를 작성해주세요.
리뷰 내용: ${d.reviews || ""}
장소/서비스명: ${d.targetName || ""}
주요 키워드: ${d.keywords || ""}
`,
  free: (d) => `
다음 주제로 블로그/콘텐츠를 작성해주세요.
주제: ${d.topic || ""}
추가 정보: ${d.notes || ""}
`,
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  let body: { mode: "blog" | "insta"; category: string; data: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { mode, category, data } = body;
  const promptFn = CATEGORY_PROMPTS[category] ?? CATEGORY_PROMPTS.free;
  const userMessage = promptFn(data);

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.85,
      max_tokens: 2500,
      messages: [
        { role: "system", content: mode === "blog" ? BLOG_SYSTEM : INSTA_SYSTEM },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ error: "AI 응답이 없습니다." }, { status: 500 });

    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    console.error("Content generation error:", err);
    return NextResponse.json({ error: err.message || "생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
