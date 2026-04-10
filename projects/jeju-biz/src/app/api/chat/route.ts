import { NextResponse } from "next/server";
import OpenAI from "openai";

const FAQS = [
  { id: "faq-1", question: "예약 취소는 어떻게 하나요?", answer: "마이페이지 > 예약 내역에서 취소 버튼을 누르시면 됩니다. 이용일 3일 전까지 무료 취소 가능하며, 2일 전부터는 수수료가 발생합니다.", category: "예약" },
  { id: "faq-2", question: "환불은 얼마나 걸리나요?", answer: "취소 완료 후 카드사에 따라 3~7영업일 내 환불 처리됩니다. 체크카드는 즉시~3일, 신용카드는 3~7일 소요됩니다.", category: "환불" },
  { id: "faq-3", question: "렌터카 픽업 장소가 어디인가요?", answer: "제주공항 1층 도착장 앞 렌터카 셔틀 정류장에서 탑승하시면 됩니다. 업체별로 셔틀이 다르니 예약 확인 문자의 안내를 참고해주세요.", category: "렌터카" },
  { id: "faq-4", question: "고객센터 운영시간이 궁금해요", answer: "고객센터는 평일 09:00~18:00 운영합니다. 주말/공휴일은 카카오톡 채널로 문의하시면 순차 답변드립니다.", category: "기타" },
  { id: "faq-5", question: "보험은 어떤 게 좋나요?", answer: "초보 운전자나 제주 처음 방문이시라면 완전자차보험(면책 0원)을 추천드립니다. 일반 운전자는 일반보험(면책 30만원)으로도 충분합니다.", category: "렌터카" },
  { id: "faq-6", question: "예약 변경이 가능한가요?", answer: "이용일 2일 전까지 1회 무료 변경 가능합니다. 마이페이지에서 직접 변경하시거나 고객센터로 연락주세요.", category: "예약" },
  { id: "faq-7", question: "숙소 체크인/체크아웃 시간은?", answer: "일반적으로 체크인 15:00, 체크아웃 11:00입니다. 숙소별로 다를 수 있으니 예약 상세에서 확인해주세요.", category: "숙소" },
  { id: "faq-8", question: "할인 코드는 어떻게 사용하나요?", answer: "결제 페이지에서 '할인 코드 입력' 칸에 코드를 입력하시면 즉시 할인이 적용됩니다. 중복 적용은 불가합니다.", category: "결제" },
];

const SYSTEM_PROMPT = `당신은 제주패스 AI 고객 상담사입니다.
제주패스는 제주 렌터카, 숙소, 액티비티 예약 플랫폼입니다.

역할:
- 예약, 취소, 환불, 렌터카, 숙소, 액티비티 관련 고객 문의에 친절하게 답변
- 모르는 사항은 고객센터(1588-0000) 안내
- 응답은 2~3문장으로 간결하게
- 존댓말 사용, 이모지 적절히 활용

자주 묻는 질문(FAQ) 참고:
${FAQS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages 배열이 필요합니다." }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1]?.content || "";

    // FAQ 매칭 (키워드 기반)
    const matchedFAQs = FAQS.filter((faq) => {
      const keywords = faq.question.replace(/[?은는이가를]/g, "").split(/\s+/);
      return keywords.some((kw) => kw.length >= 2 && userMessage.includes(kw));
    })
      .slice(0, 3)
      .map((f) => ({ id: f.id, question: f.question, category: f.category }));

    // OpenAI API
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // API 키 없으면 FAQ 기반 응답
      const directMatch = FAQS.find((f) =>
        userMessage.includes(f.question.slice(0, 6)) || f.question.includes(userMessage.slice(0, 6))
      );
      return NextResponse.json({
        reply: directMatch?.answer || "안녕하세요! 제주패스 AI 상담사입니다. 궁금하신 점을 자세히 말씀해주시면 도움드리겠습니다.\n\n자세한 상담은 고객센터 1588-0000으로 문의해주세요.",
        matchedFAQs,
      });
    }

    const openai = new OpenAI({ apiKey });

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.slice(-10).map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "죄송합니다. 응답을 생성하지 못했습니다.";

    return NextResponse.json({ reply, matchedFAQs });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "채팅 응답 생성 중 오류가 발생했습니다.", reply: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n\n긴급 문의: 1588-0000", matchedFAQs: [] },
      { status: 500 }
    );
  }
}
