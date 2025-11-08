"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Category = 'plastic' | 'paper' | 'metal' | 'glass' | 'other';

export default function SchoolPage() {
  const [school, setSchool] = useState('');
  const [assignment, setAssignment] = useState<{ category: Category; label: string } | null>(null);
  const router = useRouter();

  // Pick today's random assignment on load (and store for later screens)
  useEffect(() => {
    const cats = [
      { category: 'plastic' as const, label: '플라스틱' },
      { category: 'paper' as const, label: '종이' },
      { category: 'metal' as const, label: '금속' },
      { category: 'glass' as const, label: '유리' },
      { category: 'other' as const, label: '기타' },
    ];
    const pick = cats[Math.floor(Math.random() * cats.length)];
    setAssignment(pick);
    try {
      sessionStorage.setItem('obw_assignment_category', pick.category);
      sessionStorage.setItem('obw_assignment_label', pick.label);
    } catch {}
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (school.trim().length) {
        localStorage.setItem('obw_school', school.trim());
      } else {
        localStorage.removeItem('obw_school');
      }
    } catch {}
    router.push('/scan');
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">학교/학급 입력</h1>
      <form className="card space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">학교명</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="예: OO초등학교"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
        <button className="btn w-full" type="submit">입력 완료</button>
      </form>
      {/* Today Assignment */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-orange-200 bg-orange-50 text-primary-700 text-sm">
          ♻️ 오늘의 분리수거 과제 — <strong>{assignment?.label ?? '...'}</strong> 점수x2
        </div>
        <div className="text-xs text-gray-500 mt-2">해당 종류를 분리수거하면 200점 적립됩니다.</div>
      </div>
    </div>
  );
}
