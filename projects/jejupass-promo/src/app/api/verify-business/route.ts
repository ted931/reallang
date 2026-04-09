import { NextRequest, NextResponse } from 'next/server';

// 국세청 사업자등록 상태조회 API
// 실제 운영 시: data.go.kr에서 API 키 발급 필요
// MVP에서는 형식 검증 + 테스트 번호 허용

function isValidFormat(num: string): boolean {
  // 사업자등록번호: 10자리 숫자, 형식 검증
  const cleaned = num.replace(/[-\s]/g, '');
  if (cleaned.length !== 10 || !/^\d{10}$/.test(cleaned)) return false;

  // 사업자등록번호 체크섬 검증 (국세청 공식 알고리즘)
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
  const { businessNumber } = await req.json();

  if (!businessNumber) {
    return NextResponse.json({ error: '사업자등록번호를 입력해주세요.' }, { status: 400 });
  }

  const cleaned = businessNumber.replace(/[-\s]/g, '');

  // 1. 형식 검증 (체크섬)
  if (!isValidFormat(cleaned)) {
    return NextResponse.json({
      valid: false,
      status: 'invalid_format',
      message: '올바른 사업자등록번호가 아닙니다.',
    });
  }

  // 2. 국세청 API 조회 (실제 운영 시 활성화)
  // MVP에서는 형식만 검증하고 통과 처리
  // TODO: data.go.kr API 연동
  /*
  const API_KEY = process.env.NTS_API_KEY;
  const res = await fetch(
    `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ b_no: [cleaned] }),
    }
  );
  const data = await res.json();
  const status = data.data?.[0];
  */

  // MVP: 형식 검증 통과 시 유효 처리
  return NextResponse.json({
    valid: true,
    status: 'active',
    businessNumber: cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'),
    message: '인증되었습니다.',
  });
}
