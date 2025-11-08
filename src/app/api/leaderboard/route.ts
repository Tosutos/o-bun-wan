import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { totalPoints: 'desc' },
    take: 20,
    select: { id: true, displayName: true, totalPoints: true },
  });
  return NextResponse.json({ users });
}
export const dynamic = 'force-dynamic';
