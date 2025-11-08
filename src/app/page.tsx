import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-8">
        <img src="/logo.svg" alt="오분완" className="w-40 h-40" />
      </div>
      <h1 className="text-4xl font-black mb-2 text-black">오분완</h1>
      <p className="text-gray-700 mb-8">오늘의 분리수거 완료! 재활용을 게임처럼 배워요.</p>
      <Link href="/school" className="btn text-lg">시작하기</Link>
    </div>
  );
}
