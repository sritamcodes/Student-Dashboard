import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // we will always add 'class="dark"' on <html> via Next.js layout
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium dark palette
        background: '#050508',
        foreground: '#f4f4f7',
        accent: {
          primary: '#6366f1', // indigo-500
          secondary: '#10b981', // emerald-500
          tertiary: '#f43f5e', // rose-500
          cyan: '#06b6d4',
        },
        neutral: {
          500: '#6b7280',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
