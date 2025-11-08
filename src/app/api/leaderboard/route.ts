import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Missing DATABASE_URL env. Configure on Vercel.' },
        { status: 503 }
      );
    }
    const users = await prisma.user.findMany({
      orderBy: { totalPoints: 'desc' },
      take: 20,
      select: { id: true, displayName: true, totalPoints: true },
    });
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Failed to load leaderboard', detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
