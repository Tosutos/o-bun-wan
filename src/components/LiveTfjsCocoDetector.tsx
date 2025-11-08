"use client";
import * as React from 'react';

declare global {
  interface Window {
    tf?: any;
    cocoSsd?: any;
  }
}

type Detection = {
  bbox: [number, number, number, number]; // [x, y, width, height] in video px
  class: string;
  score: number; // 0..1
};

type Props = {
  modelVariant?: 'lite_mobilenet_v2' | 'mobilenet_v2';
  intervalMs?: number;
  minScore?: number;
  onDetections?: (dets: Detection[]) => void;
  showRoi?: boolean;
  roiSizeRatio?: number;
  showOverlay?: boolean;
  captureOnScore?: number; // when a detection >= threshold, capture frame
  stopOnCapture?: boolean; // stop camera after capture
  onCapture?: (p: { image: string; label: string; score: number; bbox?: [number, number, number, number] }) => void;
  shouldCapture?: (d: Detection) => boolean; // predicate to allow capture
};

export default function LiveTfjsCocoDetector({
  modelVariant = 'lite_mobilenet_v2',
  intervalMs = 200,
  minScore = 0.3,
  onDetections,
  showRoi = true,
  roiSizeRatio = 0.8,
  showOverlay = true,
  captureOnScore,
  stopOnCapture = true,
  onCapture,
  shouldCapture,
}: Props) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const overlayRef = React.useRef<HTMLCanvasElement>(null);
  const [model, setModel] = React.useState<any>(null);
  const [ready, setReady] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const loopRef = React.useRef<number | null>(null);
  const capturedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    let cancelled = false;
    async function loadScripts() {
      try {
        if (!window.tf) {
          await appendScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.18.0/dist/tf.min.js');
        }
        if (!window.cocoSsd) {
          await appendScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');
        }
        if (cancelled) return;
        const m = await window.cocoSsd.load({ base: modelVariant });
        if (!cancelled) setModel(m);
      } catch (e: any) {
        setError('TFJS 모델 로드 실패: ' + String(e?.message || e));
      }
    }
    loadScripts();
    return () => {
      cancelled = true;
    };
  }, [modelVariant]);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      const vid = videoRef.current!;
      vid.srcObject = stream;
      await vid.play();
      setReady(true);
      // Auto-start detection when camera starts
      setRunning(true);
      requestAnimationFrame(resizeOverlayToVideo);
    } catch (e: any) {
      setError('카메라 접근 권한이 필요합니다.');
    }
  }

  function stopCamera() {
    const vid = videoRef.current;
    if (vid?.srcObject) {
      (vid.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      vid.srcObject = null;
    }
    setReady(false);
  }

  function resizeOverlayToVideo() {
    const vid = videoRef.current;
    const ov = overlayRef.current;
    if (!vid || !ov) return;
    const rect = vid.getBoundingClientRect();
    ov.width = Math.max(1, Math.floor(rect.width));
    ov.height = Math.max(1, Math.floor(rect.height));
  }

  React.useEffect(() => {
    const onResize = () => resizeOverlayToVideo();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    if (!running || !model || !ready) return;
    const vid = videoRef.current!;
    const ov = overlayRef.current;
    const octx = ov?.getContext('2d') || null;

    async function step() {
      try {
        const preds = (await model.detect(vid)) as Array<{ bbox: [number, number, number, number]; class: string; score: number }>;
        const dets = preds.filter((p) => p.score >= minScore).map((p) => ({ bbox: p.bbox, class: p.class, score: p.score }));
        if (octx && showOverlay) {
          resizeOverlayToVideo();
          octx.clearRect(0, 0, ov!.width, ov!.height);
          const sx = ov!.width / (vid.videoWidth || 1);
          const sy = ov!.height / (vid.videoHeight || 1);
          for (const d of dets) {
            const [x, y, w, h] = d.bbox;
            const xx = x * sx, yy = y * sy, ww = w * sx, hh = h * sy;
            octx.strokeStyle = 'rgba(234, 88, 12, 0.95)';
            octx.lineWidth = 3;
            octx.strokeRect(xx, yy, ww, hh);
            const text = `${d.class} ${Math.round(d.score * 100)}%`;
            octx.font = '12px sans-serif';
            const tw = octx.measureText(text).width + 10;
            octx.fillStyle = 'rgba(0,0,0,0.6)';
            octx.fillRect(xx, Math.max(0, yy - 18), tw, 18);
            octx.fillStyle = '#fff';
            octx.fillText(text, xx + 5, Math.max(12, yy - 5));
          }
        }
        onDetections?.(dets as Detection[]);

        // Optional capture when a confident detection appears
        if (!capturedRef.current && captureOnScore && dets.length) {
          const best = dets[0];
          const allowed = !shouldCapture || shouldCapture(best);
          if (best.score >= captureOnScore && allowed) {
            try {
              const imgDataUrl = captureFrame(videoRef.current!);
              onCapture?.({ image: imgDataUrl, label: best.class, score: best.score, bbox: best.bbox });
            } catch {
              // ignore capture errors
            }
            capturedRef.current = true;
            if (stopOnCapture) {
              if (loopRef.current) window.clearInterval(loopRef.current);
              loopRef.current = null;
              setRunning(false);
              stopCamera();
            }
          }
        }
      } catch {
        // ignore per-frame errors
      }
    }

    loopRef.current = window.setInterval(step, intervalMs);
    return () => {
      if (loopRef.current) window.clearInterval(loopRef.current);
      loopRef.current = null;
    };
  }, [running, model, ready, intervalMs, minScore, showOverlay]);

  React.useEffect(() => {
    return () => {
      if (loopRef.current) window.clearInterval(loopRef.current);
      stopCamera();
    };
  }, []);

  const canRun = !!model;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {!ready ? (
          <button className="btn" onClick={startCamera} disabled={!canRun}>카메라 시작</button>
        ) : (
          <button className="btn" onClick={stopCamera}>카메라 정지</button>
        )}
        <button className="btn" onClick={() => setRunning((v) => !v)} disabled={!ready || !canRun}>
          {running ? '실시간 중지' : '실시간 시작'}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="relative w-full max-w-full">
        <video ref={videoRef} className="w-full rounded border" muted playsInline onLoadedMetadata={resizeOverlayToVideo} />
        {ready && showRoi && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="border-4 border-primary-500/80 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]" style={{ width: `${Math.round(roiSizeRatio * 100)}%`, aspectRatio: '1 / 1' }} />
          </div>
        )}
        {ready && <canvas ref={overlayRef} className="pointer-events-none absolute inset-0" />}
      </div>
      {!canRun && <div className="text-gray-600 text-sm">모델 로딩 중...</div>}
    </div>
  );
}

function appendScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

function captureFrame(video: HTMLVideoElement): string {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(video, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.92);
}
