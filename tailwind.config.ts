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
    },
  },
  plugins: [],
};

export default config;
