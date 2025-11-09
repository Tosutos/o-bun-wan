"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfettiBurst from '@/components/ConfettiBurst';

type CaptureData = {
  image: string;
  label: string;
  category: 'plastic' | 'paper' | 'metal' | 'glass' | 'other';
};

type ChatMsg = { role: 'user' | 'assistant'; content: string };

const koCategory = (c: CaptureData['category']) => (
  ({ plastic: '플라스틱', paper: '종이', metal: '금속', glass: '유리', other: '기타' } as const)[c]
);

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<CaptureData | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: '안녕하세요! 분리수거 도우미예요. 궁금한 것을 물어보세요.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Load captured data from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('obw_capture');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setData({ image: parsed.image, label: parsed.customLabel ?? parsed.label, category: parsed.category });
    } catch {}
  }, []);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user', content: input.trim() } as ChatMsg];
    setMessages(next);
    setInput('');
    try {
      setLoading(true);
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const json = await res.json();
      const reply = res.ok ? String(json.reply || '') : '죄송해요, 잠시 후 다시 시도해 주세요.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: '죄송해요, 잠시 후 다시 시도해 주세요.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function complete() {
    if (!data) return;
    try {
      setCompleting(true);
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: data.category }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || '완료 처리 실패');
      alert(`오분완! +${json.pointsAdded}점 (누적 ${json.totalPoints}점)`);
    } catch {
      alert('완료 처리 중 문제가 발생했어요. 로그인 상태를 확인해주세요.');
    } finally {
      setCompleting(false);
    }
  }

  if (!data) return <div className="text-center text-gray-600">결과가 없습니다. 스캔을 먼저 진행해주세요.</div>;
  const { image, label, category } = data;

  const subject = `${koCategory(category)}/${label}`;
  const presets = [
    `${subject}은(는) 어떻게 분리수거 하나요?`,
    `${subject} 다른 재활용 방법이 있나요?`,
    `${subject} 오염되면 어떻게 해요?`,
  ];
  const catEmoji = ({ plastic: '🧴', paper: '📄', metal: '🥫', glass: '🍾', other: '🧩' } as const)[category];
  const labelEmoji = '🏷️';

  return (
    <div className="space-y-6">
      {/* 1) 오분완 멘트 + 로고 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="오분완 로고" className="w-12 h-12" />
          <div className="text-4xl font-extrabold text-primary-500">오분완!</div>
        </div>
        <div className="text-sm text-gray-600">오늘의 분리수거 완료</div>
      </div>
      <ConfettiBurst durationMs={1400} />

      {/* 2) 찍힌 사진 */}
      <div className="card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="captured" className="w-full rounded border" />
      </div>

      {/* 종류/라벨 뱃지 (사진 아래, 채팅 위) */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-primary-700 text-sm">{catEmoji} 종류: <strong>{koCategory(category)}</strong></span>
        <span className="px-3 py-1 rounded-full border bg-white text-sm">{labelEmoji} 라벨: <strong>{label}</strong></span>
      </div>

      {/* 3) AI 채팅 + 완료 버튼 + 프리셋 */}
      <div className="card space-y-3">
        <div className="font-bold text-black">분리수거 안내 (AI 채팅)</div>
        <div className="space-y-2 max-h-64 overflow-y-auto bg-white/50 rounded p-2 border">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary-500 text-white' : 'bg-white border'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-gray-600">AI 불러오는 중...</div>}
        </div>
        <div className="mt-1 flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="질문을 입력하세요 (예: 더 깨끗이 헹궈야 하나요?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && send()}
          />
          <button className="btn" onClick={send} disabled={loading || !input.trim()}>
            전송
          </button>
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {presets.map((q) => (
            <button
              key={q}
              type="button"
              className="px-3 py-2 rounded border text-sm hover:bg-gray-50"
              onClick={async () => {
                if (loading) return;
                const nextQuick = [...messages, { role: 'user', content: q } as ChatMsg];
                setMessages(nextQuick);
                try {
                  setLoading(true);
                  const res = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: nextQuick.map((m) => ({ role: m.role, content: m.content })) }),
                  });
                  const json = await res.json();
                  const reply = res.ok ? String(json.reply || '') : '죄송해요, 잠시 후 다시 시도해 주세요.';
                  setMessages((m) => [...m, { role: 'assistant', content: reply }]);
                } catch {
                  setMessages((m) => [...m, { role: 'assistant', content: '죄송해요, 잠시 후 다시 시도해 주세요.' }]);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="pt-2 flex gap-2">
          <button className="btn" onClick={complete} disabled={completing}>
            {completing ? '처리 중...' : '분리수거 완료'}
          </button>
          <button
            className="btn-black"
            onClick={() => router.push('/')}
            type="button"
          >
            처음으로
          </button>
        </div>
      </div>
    </div>
  );
}
