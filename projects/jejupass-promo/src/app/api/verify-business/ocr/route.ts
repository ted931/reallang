import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// 사업자등록번호 체크섬 검증
function isValidBusinessNumber(num: string): boolean {
  const cleaned = num.replace(/[-\s]/g, '');
  if (cleaned.length !== 10 || !/^\d{10}$/.test(cleaned)) return false;

  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }
  sum += Math.floor((parseInt(cleaned[8]) * 5) / 10);
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(cleaned[9]);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return NextResponse.json({ error: '이미지를 업로드해주세요.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');
  const mediaType = file.type || 'image/jpeg';

  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini', // TODO: gpt-4o로 업그레이드
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mediaType};base64,${base64}` },
            },
            {
              type: 'text',
              text: `이 이미지는 한국 사업자등록증입니다. 다음 정보를 추출해주세요.
반드시 JSON 형식으로만 응답하세요:

{
  "businessNumber": "000-00-00000 형식의 사업자등록번호",
  "businessName": "상호(법인명)",
  "representative": "대표자 성명",
  "businessType": "업태",
  "businessItem": "종목",
  "address": "사업장 소재지",
  "isBusinessRegistration": true
}

사업자등록증이 아닌 경우:
{"isBusinessRegistration": false, "reason": "사유"}`,
            },
          ],
        },
      ],
    });

    const text = res.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({
        success: false,
        error: '문서를 인식할 수 없습니다. 사업자등록증 사진을 다시 올려주세요.',
      });
    }

    const extracted = JSON.parse(jsonMatch[0]);

    if (!extracted.isBusinessRegistration) {
      return NextResponse.json({
        success: false,
        error: extracted.reason || '사업자등록증이 아닙니다.',
      });
    }

    if (!extracted.businessNumber) {
      return NextResponse.json({
        success: false,
        error: '사업자등록번호를 찾을 수 없습니다. 더 선명한 사진을 올려주세요.',
      });
    }

    const cleaned = extracted.businessNumber.replace(/[-\s]/g, '');
    const isValid = isValidBusinessNumber(cleaned);
    const formatted = cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');

    return NextResponse.json({
      success: true,
      valid: isValid,
      data: {
        businessNumber: formatted,
        businessName: extracted.businessName || '',
        representative: extracted.representative || '',
        businessType: extracted.businessType || '',
        businessItem: extracted.businessItem || '',
        address: extracted.address || '',
      },
      message: isValid
        ? '사업자등록증이 인증되었습니다.'
        : '사업자등록번호 형식이 올바르지 않습니다. 직접 입력해주세요.',
    });
  } catch (err) {
    console.error('OCR failed:', err);
    return NextResponse.json({
      success: false,
      error: 'OCR 처리 중 오류가 발생했습니다. 사업자등록번호를 직접 입력해주세요.',
    });
  }
}
