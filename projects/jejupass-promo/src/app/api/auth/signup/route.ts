import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/userStore';
import type { User } from '@/lib/types';

function generateId() {
  return 'user-' + Math.random().toString(36).slice(2, 10);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, phone, businessNumber } = body;

  if (!name || !email || !password || !phone || !businessNumber) {
    return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
  }

  const now = new Date().toISOString();
  const user: User = {
    id: generateId(),
    name,
    email,
    password, // 프로토타입 — plain text
    phone,
    businessNumber,
    shopIds: [],
    createdAt: now,
  };

  await createUser(user);

  const { password: _pw, ...safeUser } = user;
  void _pw;
  return NextResponse.json({ user: safeUser }, { status: 201 });
}
