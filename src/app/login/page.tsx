"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentId.trim(), displayName: displayName.trim() }),
      });
      if (!res.ok) throw new Error('Login failed');
      router.push('/recycle');
    } catch (e) {
      alert('로그인에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">학생 ID로 로그인</h1>
      <form onSubmit={onSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">학생 ID</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="예: S1234"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">이름 (선택)</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="예: 홍길동"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn w-full" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}

