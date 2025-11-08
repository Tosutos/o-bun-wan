import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">리더보드</h1>
        <div className="card text-red-700">
          DATABASE_URL 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정에서 DATABASE_URL을 추가하세요.
        </div>
      </div>
    );
  }
  let users: { id: string; displayName: string | null; totalPoints: number }[] = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { totalPoints: 'desc' },
      take: 20,
      select: { id: true, displayName: true, totalPoints: true },
    });
  } catch (e) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">리더보드</h1>
        <div className="card text-red-700">리더보드를 불러오지 못했습니다. 서버 로그를 확인하세요.</div>
      </div>
    );
  }

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
