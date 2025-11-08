"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SchoolPage() {
  const [school, setSchool] = useState('');
  const router = useRouter();

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
      <h1 className="text-2xl font-bold mb-4">소속 초등학교 입력</h1>
      <form className="card space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">초등학교명</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="예: 서울오분완초등학교"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
        <button className="btn w-full" type="submit">입력 완료</button>
      </form>
    </div>
  );
}

