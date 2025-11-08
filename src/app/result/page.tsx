"use client";
import { useEffect, useState } from 'react';
import { guidanceFor } from '@/lib/scoring';
import { customLabelKo } from '@/lib/model-config';
import { useRouter } from 'next/navigation';
import ConfettiBurst from '@/components/ConfettiBurst';

type CaptureData = {
  image: string;
  label: string;
  score: number;
  category: 'plastic' | 'paper' | 'metal' | 'glass' | 'other';
  guidance: string;
  customLabel?: string;
};

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<CaptureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('obw_capture');
      if (raw) setData(JSON.parse(raw) as CaptureData);
    } catch {}
  }, []);

  async function complete() {
    if (!data) return;
    setLoading(true);
    try {
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: data.category }),
      });
      if (!res.ok) throw new Error('완료 처리 실패');
      const json = (await res.json()) as { pointsAdded: number; totalPoints: number };
      setPoints(json.pointsAdded);
      alert(`오분완! +${json.pointsAdded}점 (누적 ${json.totalPoints}점)`);
    } catch (e) {
      alert('완료 처리 중 문제가 발생했어요. 로그인 상태를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return <div className="text-center text-gray-600">결과가 없습니다. 스캔을 먼저 진행해주세요.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-extrabold text-primary-500 mb-2 animate-pulse">오분완!</div>
        <div className="text-sm text-gray-600">오늘의 분리수거 완료</div>
      </div>
      <ConfettiBurst durationMs={2200} />

      <div className="card space-y-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.image} alt="captured" className="w-full rounded border" />
        <div className="text-lg font-semibold">종류: {data.category.toUpperCase()}</div>
        <div className="text-sm text-gray-700">라벨: {customLabelKo(data.customLabel) ?? data.customLabel ?? data.label}</div>
        <div className="text-sm text-gray-600">신뢰도: {(data.score * 100).toFixed(0)}%</div>
        <div className="border-l-4 border-primary-500 bg-[#FFF7ED] p-3 rounded">
          <div className="font-bold text-black mb-1">분류 방법</div>
          {(() => {
            const lines = (data.guidance || guidanceFor(data.category)).split('\n');
            return (
              <div className="space-y-1">
                {lines.map((line, i) => (
                  <div key={i} className="text-sm text-gray-800">• {line}</div>
                ))}
              </div>
            );
          })()}
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={complete} disabled={loading}>
            {loading ? '처리 중...' : '분리수거 완료'}
          </button>
          <button
            className="btn-black"
            onClick={() => {
              try { sessionStorage.removeItem('obw_capture'); } catch {}
              router.push('/scan');
            }}
          >
            다시 촬영
          </button>
        </div>
        {points !== null && (
          <div className="text-green-700 font-semibold">+{points} 점 획득!</div>
        )}
      </div>
    </div>
  );
}
