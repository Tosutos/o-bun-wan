import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import StepProgress from '@/components/StepProgress';
import { Noto_Sans_KR, Jua } from 'next/font/google';

const sans = Noto_Sans_KR({ subsets: ['latin'], weight: ['400','500','700'], variable: '--font-sans', display: 'swap' });
const display = Jua({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: '오분완',
  description: '카메라로 분리수거 완료! 생활 속 친환경 실천',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        {/* PWA-friendly meta */}
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <header className="border-b border-orange-200 bg-orange-100/70 backdrop-blur">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-display text-3xl text-primary-600">오분완</Link>
            <nav className="flex gap-2 text-sm">
              <Link href="/recycle" className="px-3 py-1.5 rounded-full bg-white border border-orange-200 text-primary-700 hover:bg-orange-50">Recycle</Link>
              <Link href="/leaderboard" className="px-3 py-1.5 rounded-full bg-white border border-orange-200 text-primary-700 hover:bg-orange-50">Leaderboard</Link>
              <Link href="/login" className="px-3 py-1.5 rounded-full bg-white border border-orange-200 text-primary-700 hover:bg-orange-50">Login</Link>
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

