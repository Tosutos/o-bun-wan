import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computePoints, type Category } from '@/lib/scoring';
import { getUserFromCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Missing DATABASE_URL env' }, { status: 503 });
  }
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null as any);
  const category = body?.category as Category | undefined;
  const size = body?.size as 'small' | 'medium' | 'large' | undefined;
  if (!category) return NextResponse.json({ error: 'Missing category' }, { status: 400 });

  const points = computePoints(category, size);

  const event = await prisma.$transaction(async (tx) => {
    const ev = await tx.recyclingEvent.create({
      data: {
        userId: user.id,
        category,
        size: size ?? null,
        points,
        confidence: 0.75,
      },
    });
    await tx.user.update({ where: { id: user.id }, data: { totalPoints: { increment: points } } });
    return ev;
  });

  const updated = await prisma.user.findUnique({ where: { id: user.id } });
  return NextResponse.json({ pointsAdded: points, totalPoints: updated?.totalPoints ?? user.totalPoints });
}
