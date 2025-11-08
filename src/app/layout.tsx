import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import StepProgress from '@/components/StepProgress';

export const metadata: Metadata = {
  title: '오분완',
  description: '오늘의 분리수거 완료! 재활용을 게임처럼 배우기',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* PWA-friendly meta */}
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <header className="border-b bg-black text-white">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-2xl text-primary-500">오분완</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/recycle" className="hover:text-primary-500">Recycle</Link>
              <Link href="/leaderboard" className="hover:text-primary-500">Leaderboard</Link>
              <Link href="/login" className="hover:text-primary-500">Login</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6">
          <ServiceWorkerRegister />
          <StepProgress />
          {children}
        </main>
      </body>
    </html>
  );
}
