import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        brand: {
          black: '#0b0b0b',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif', 'system-ui', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
      },
      boxShadow: {
        cute: '0 6px 20px rgba(249, 115, 22, 0.15)',
      },
      borderRadius: {
        cute: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
