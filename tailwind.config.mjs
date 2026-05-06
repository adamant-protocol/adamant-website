/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: '#000000',
        'bg-2': '#07080e',
        'bg-3': '#0c0e16',
        // Ink
        ink: '#ece8df',
        'ink-2': '#a8aab5',
        'ink-3': '#5a5d6b',
        'ink-4': '#2e3140',
        // Accents
        ember: '#ff7d4d',
        'ember-dim': 'rgba(255,125,77,0.5)',
        cold: '#7da6ff',
        'cold-dim': 'rgba(125,166,255,0.35)',
        // Rules / borders
        rule: 'rgba(236,232,223,0.06)',
        'rule-2': 'rgba(236,232,223,0.12)',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.2em',
        label: '0.22em',
        wider: '0.18em',
      },
      maxWidth: {
        wrap: '1480px',
      },
      spacing: {
        // Spatial system from the design
        'pad-side': '64px',
        'pad-section': '200px',
        'pad-section-sm': '120px',
        'pad-section-head': '80px',
        'gap-major': '96px',
        'gap-minor': '48px',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
