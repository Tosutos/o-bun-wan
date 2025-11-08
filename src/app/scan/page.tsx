"use client";
import { useEffect, useState } from 'react';
import LiveTfjsCocoDetector from '@/components/LiveTfjsCocoDetector';
import { guidanceFor } from '@/lib/scoring';
import { mapToCustomAndCategory, type CustomMapping } from '@/lib/model-config';
import { useRouter } from 'next/navigation';

type Classification = {
  category: 'plastic' | 'paper' | 'metal' | 'glass' | 'other';
  confidence: number;
  guidance: string;
};

export default function ScanPage() {
  const router = useRouter();
  const [mapCfg, setMapCfg] = useState<CustomMapping | null>(null);
  const [result, setResult] = useState<Classification | null>(null);
  const [captured, setCaptured] = useState<{ image: string; label: string; score: number } | null>(null);
  const [detectorKey, setDetectorKey] = useState(0);
  const minConf = 0.6;

  // Cute emoji for each recycling category
  function categoryEmoji(c: Classification['category']): string {
    switch (c) {
      case 'plastic':
        return '🧴';
      case 'paper':
        return '📰';
      case 'metal':
        return '🥫';
      case 'glass':
        return '🍾';
      default:
        return '📦';
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/models/mapping.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((obj) => {
        if (!cancelled && obj && typeof obj === 'object') setMapCfg(obj as CustomMapping);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function next() {
    if (!result || !captured) return;
    try {
      const mapped = mapToCustomAndCategory(captured.label, mapCfg || undefined);
      sessionStorage.setItem(
        'obw_capture',
        JSON.stringify({
          image: captured.image,
          label: captured.label,
          score: captured.score,
          category: result.category,
          customLabel: mapped.customLabel,
          guidance: result.guidance,
        })
      );
    } catch {}
    router.push('/result');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">스캔</h1>

      {!captured && (
        <div className="card space-y-3">
          <LiveTfjsCocoDetector
            key={detectorKey}
            minScore={0.4}
            onDetections={(dets) => {
              if (!dets.length) return;
              const best = dets[0];
              if (best.score >= minConf) {
                const { category } = mapToCustomAndCategory(best.class, mapCfg || undefined);
                setResult({ category, confidence: best.score, guidance: guidanceFor(category) });
              }
            }}
            showRoi
            roiSizeRatio={0.9}
            showOverlay
            captureOnScore={0.7}
            stopOnCapture
            shouldCapture={(d) => {
              const { category } = mapToCustomAndCategory(d.class, mapCfg || undefined);
              return category !== 'other';
            }}
            onCapture={({ image, label, score }) => {
              setCaptured({ image, label, score });
              const { category } = mapToCustomAndCategory(label, mapCfg || undefined);
              setResult({ category, confidence: score, guidance: guidanceFor(category) });
            }}
          />
          <div className="text-xs text-gray-500">신뢰도 70% 이상 시 자동으로 캡처하고 카메라가 정지합니다.</div>
        </div>
      )}

      {captured && result && (
        <div className="card space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={captured.image} alt="captured" className="w-full rounded border" />
          <div className="text-sm text-gray-600">신뢰도: {(result.confidence * 100).toFixed(0)}%</div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="btn" onClick={next}>다음</button>
            <button
              className="btn-black"
              onClick={() => {
                setCaptured(null);
                setResult(null);
                setDetectorKey((k) => k + 1);
              }}
            >
              다시 촬영
            </button>
            <span className="px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-primary-700 text-sm">♻️ {categoryEmoji(result.category)} 종류: <strong>{result.category}</strong></span>
            {captured && (
              <span className="px-3 py-1 rounded-full border border-orange-200 bg-white text-gray-800 text-sm">🏷️ 물체: <strong>{captured.label}</strong></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



