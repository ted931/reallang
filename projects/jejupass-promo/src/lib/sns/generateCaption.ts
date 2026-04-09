import OpenAI from 'openai';
import type { CaptionRequest, CaptionResponse } from '../types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateCaption(req: CaptionRequest): Promise<CaptionResponse> {
  const { shopName, category, region, description, menuHighlights } = req;

  const menuText = menuHighlights?.length
    ? `대표 메뉴: ${menuHighlights.join(', ')}`
    : '';

  const prompt = `제주도에 있는 "${shopName}" (${category}, ${region} 지역)의 인스타그램 홍보 글을 작성해주세요.

가게 소개: ${description || '(없음)'}
${menuText}

요구사항:
- 2~3줄의 자연스러운 인스타그램 캡션 작성
- 제주도 느낌이 나도록
- 이모지 2~3개 적절히 포함
- 너무 광고스럽지 않게 자연스러운 톤
- 마지막에 관련 해시태그 5~8개 추천

JSON 형식으로만 응답:
{"caption": "캡션 내용", "hashtags": ["#태그1", "#태그2", ...]}`;

  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini', // TODO: gpt-4o로 업그레이드
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = res.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { caption: text, hashtags: [] };
  } catch (err) {
    console.error('Caption generation failed:', err);
    return {
      caption: `${region}에서 만나는 ${shopName} ${description ? `— ${description.slice(0, 50)}` : ''}`,
      hashtags: [`#제주${category}`, `#${region}`, '#제주여행', '#제주맛집', '#제주카페'],
    };
  }
}
