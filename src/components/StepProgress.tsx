"use client";
import { usePathname } from 'next/navigation';

const steps = [
  { key: 'start', label: '시작', path: '/' },
  { key: 'school', label: '학교 입력', path: '/school' },
  { key: 'scan', label: '스캔', path: '/scan' },
  { key: 'result', label: '결과', path: '/result' },
];

export default function StepProgress() {
  const pathname = usePathname();
  const idx = Math.max(
    0,
    steps.findIndex((s) => (s.path === '/' ? pathname === '/' : pathname.startsWith(s.path)))
  );

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-center gap-3 text-sm">
        {steps.map((s, i) => {
          const active = i === idx;
          const done = i < idx;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  active ? 'bg-primary-500 text-white' : done ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1}
              </div>
              <div className={`${active ? 'text-black font-semibold' : 'text-gray-600'}`}>{s.label}</div>
              {i < steps.length - 1 && <div className="w-6 h-0.5 bg-gray-300 mx-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

