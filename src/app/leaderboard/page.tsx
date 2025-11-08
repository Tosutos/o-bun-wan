import { prisma } from '@/lib/prisma';

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    orderBy: { totalPoints: 'desc' },
    take: 20,
    select: { id: true, displayName: true, totalPoints: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">리더보드</h1>
      <div className="card">
        <ol className="space-y-2">
          {users.map((u, i) => (
            <li key={u.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 text-right font-bold">{i + 1}</span>
                <span>{u.displayName || u.id}</span>
              </div>
              <span className="font-semibold">{u.totalPoints} 점</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
