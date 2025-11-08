import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { COOKIE_NAME, createAuthToken, authCookieMaxAgeSec } from '@/lib/auth';

const Body = z.object({
  studentId: z.string().min(1).max(32),
  displayName: z.string().max(64).optional().transform((v) => (v?.length ? v : undefined)),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const { studentId, displayName } = parsed.data;

  await prisma.user.upsert({
    where: { id: studentId },
    update: { displayName: displayName ?? undefined },
    create: { id: studentId, displayName: displayName ?? null },
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: createAuthToken(studentId),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: authCookieMaxAgeSec(),
  });
  return res;
}
