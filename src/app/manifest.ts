import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '오분완',
    short_name: '오분완',
    description: '오늘의 분리수거 완료! 재활용을 게임처럼 배우기',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b0b',
    theme_color: '#f97316',
    lang: 'ko-KR',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
