import { NextResponse } from "next/server";

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

// 더미 드라이브 코스 데이터 (AI 없을 때 폴백)
const DUMMY_COURSES: Record<string, object> = {
  default: {
    courseName: "제주 서부 해안 드라이브",
    description: "애월 카페거리에서 시작해 한림공원을 거쳐 중문까지 이어지는 서쪽 해안 드라이브 코스입니다. 맑은 날씨를 최대한 활용하는 추천 코스입니다.",
    weatherSummary: "제주 서부 지역 맑음, 기온 22-24°C, 드라이브 최적 날씨",
    type: "outdoor",
    stops: [
      { order: 1, name: "애월 카페 거리", category: "카페", description: "제주 대표 카페거리, 오션뷰 카페가 즐비", driveMinutes: 0, tip: "오전 9-11시 혼잡 없음, 사진 명소" },
      { order: 2, name: "한림공원", category: "관광지", description: "야자수와 선인장 정원, 용암동굴 관람", driveMinutes: 25, tip: "협재해수욕장 바로 옆, 묶어서 관람 추천" },
      { order: 3, name: "협재해수욕장", category: "해변", description: "에메랄드 빛 바다와 비양도 뷰", driveMinutes: 5, tip: "조개껍데기 모래 특유의 흰 빛깔" },
      { order: 4, name: "중문 색달해변", category: "해변", description: "서핑과 해수욕을 동시에 즐길 수 있는 명소", driveMinutes: 45, tip: "근처 여미지식물원 방문도 추천" },
    ],
    totalDriveMinutes: 75,
    bestTimeToGo: "오전 9시 출발",
  },
  바다드라이브: {
    courseName: "제주 동부 해안 드라이브",
    description: "함덕에서 성산까지 이어지는 제주 동쪽 해안 드라이브입니다. 성산일출봉의 웅장한 뷰가 하이라이트입니다.",
    weatherSummary: "동부 지역 대체로 맑음, 드라이브 좋은 날씨",
    type: "outdoor",
    stops: [
      { order: 1, name: "함덕서우봉해변", category: "해변", description: "에메랄드 빛 바다, 제주 최고 해수욕장 중 하나", driveMinutes: 0, tip: "서우봉 언덕 트레킹도 추천" },
      { order: 2, name: "김녕성세기해변", category: "해변", description: "조용하고 한적한 숨겨진 해변", driveMinutes: 20, tip: "스노클링 포인트" },
      { order: 3, name: "월정리 해변 카페거리", category: "카페", description: "핫한 카페와 인생샷 성지", driveMinutes: 10, tip: "에메랄드 빛 바다 앞 카페" },
      { order: 4, name: "성산일출봉", category: "관광지", description: "유네스코 세계자연유산, 제주 상징", driveMinutes: 20, tip: "일출 감상 시 새벽 출발 필요" },
    ],
    totalDriveMinutes: 50,
    bestTimeToGo: "오전 8시 출발",
  },
  숲길: {
    courseName: "한라산 숲길 힐링 드라이브",
    description: "제주의 내륙 숲길을 따라 한라산 중턱까지 올라가는 힐링 드라이브입니다. 피톤치드 가득한 삼나무 숲이 압권입니다.",
    weatherSummary: "한라산 중턱 선선함, 숲길 드라이브 최적",
    type: "mixed",
    stops: [
      { order: 1, name: "사려니숲길", category: "관광지", description: "제주 최고 힐링 산책로, 삼나무 숲 터널", driveMinutes: 0, tip: "왕복 15km, 중간 탈출로 있음" },
      { order: 2, name: "교래자연휴양림", category: "관광지", description: "편백나무 숲 속 힐링 공간", driveMinutes: 15, tip: "오두막 숙박도 가능" },
      { order: 3, name: "산굼부리", category: "관광지", description: "분화구 억새밭, 제주 유일한 마르형 분화구", driveMinutes: 20, tip: "가을 억새 장관" },
      { order: 4, name: "성읍민속마을", category: "관광지", description: "제주 전통 가옥과 민속문화 체험", driveMinutes: 25, tip: "오메기떡, 고소리술 시음 가능" },
    ],
    totalDriveMinutes: 60,
    bestTimeToGo: "오전 10시 출발",
  },
  카페투어: {
    courseName: "제주 핫플 카페 투어",
    description: "인스타 핫플 카페들을 중심으로 제주의 감성을 담은 카페 투어 코스입니다. 비 오는 날에도 즐길 수 있습니다.",
    weatherSummary: "실내 위주 코스, 날씨 상관없이 즐길 수 있음",
    type: "indoor",
    stops: [
      { order: 1, name: "카페 드롭탑 제주점", category: "카페", description: "제주 돌담 외관의 감성 카페", driveMinutes: 0, tip: "제주 흑돼지 크림커피 필수" },
      { order: 2, name: "하르방 브런치", category: "카페", description: "제주 재료로 만든 감성 브런치", driveMinutes: 20, tip: "당근 케이크 유명" },
      { order: 3, name: "애월 오션뷰 카페", category: "카페", description: "바다 전망 최고 인스타 성지", driveMinutes: 30, tip: "일몰 시간 예약 필수" },
      { order: 4, name: "우도땅콩 카페", category: "카페", description: "우도 스타일 땅콩 아이스크림", driveMinutes: 40, tip: "우도땅콩 아이스크림은 필수 메뉴" },
    ],
    totalDriveMinutes: 90,
    bestTimeToGo: "오전 11시 출발",
  },
  맛집: {
    courseName: "제주 맛집 순례 코스",
    description: "제주 대표 맛집들을 연결하는 미식 드라이브 코스입니다. 흑돼지부터 해산물까지 제주 식문화를 만끽하세요.",
    weatherSummary: "맛집 위주 실내 코스, 날씨 무관",
    type: "mixed",
    stops: [
      { order: 1, name: "제주 시장 순대국밥", category: "식당", description: "제주 전통 순대국밥 명가", driveMinutes: 0, tip: "아침 식사 추천, 7시부터 영업" },
      { order: 2, name: "흑돼지 거리", category: "식당", description: "제주 흑돼지 구이 전문거리", driveMinutes: 20, tip: "점심에는 대기 짧음" },
      { order: 3, name: "성산 해녀의 집", category: "식당", description: "성산 해녀가 직접 잡은 해산물 요리", driveMinutes: 40, tip: "뿔소라, 전복죽 추천" },
      { order: 4, name: "모슬포 방어 맛집", category: "식당", description: "겨울 제철 방어회, 제주 최고 방어 산지", driveMinutes: 60, tip: "11월~2월이 제철" },
    ],
    totalDriveMinutes: 120,
    bestTimeToGo: "오전 7시 출발",
  },
  실내위주: {
    courseName: "비 오는 날 제주 실내 코스",
    description: "비 오는 날을 위한 실내 위주 제주 관광 코스입니다. 박물관과 체험관을 중심으로 제주 문화를 깊이 있게 탐방합니다.",
    weatherSummary: "비 오는 날 최적 실내 코스",
    type: "indoor",
    stops: [
      { order: 1, name: "제주 돌문화공원", category: "박물관", description: "제주 돌 문화의 모든 것, 거대 야외 공원", driveMinutes: 0, tip: "우산 필수, 실내 전시도 풍부" },
      { order: 2, name: "테디베어 뮤지엄", category: "박물관", description: "세계적인 테디베어 컬렉션", driveMinutes: 25, tip: "어린이 동반 가족 필수 코스" },
      { order: 3, name: "넥슨 컴퓨터 박물관", category: "박물관", description: "게임과 IT 역사 체험 공간", driveMinutes: 30, tip: "레트로 게임 체험 가능" },
      { order: 4, name: "제주 현대미술관", category: "박물관", description: "제주 작가들의 현대미술 전시", driveMinutes: 35, tip: "카페 뷰가 아름다움" },
    ],
    totalDriveMinutes: 90,
    bestTimeToGo: "오전 10시 출발",
  },
};

export async function POST(request: Request) {
  const { weatherData, preference } = await request.json();

  const apiKey = process.env.OPENAI_API_KEY;

  // OpenAI 없으면 더미 코스 반환
  if (!apiKey) {
    const pref = preference || "default";
    const course = DUMMY_COURSES[pref] || DUMMY_COURSES.default;
    return NextResponse.json({ ...course, isDummy: true });
  }

  const weatherSummary = (weatherData || [])
    .map((loc: any) => `${loc.name}: ${loc.temperature}° ${loc.sky} 풍속${loc.windSpeed}m/s 강수${loc.rainfall}mm`)
    .join("\n");

  const userMessage = `## 현재 제주도 날씨
${weatherSummary}

## 사용자 선호
${preference || "특별한 선호 없음, 날씨에 맞게 추천해주세요"}

위 날씨를 고려해서 최적의 드라이브 코스를 추천해주세요.`;

  try {
    const { default: OpenAI } = await import("openai");
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
    if (!raw) {
      const course = DUMMY_COURSES[preference] || DUMMY_COURSES.default;
      return NextResponse.json({ ...course, isDummy: true });
    }

    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    console.error("Suggest error:", err);
    // 에러 시 더미 코스로 폴백
    const course = DUMMY_COURSES[preference] || DUMMY_COURSES.default;
    return NextResponse.json({ ...course, isDummy: true });
  }
}
