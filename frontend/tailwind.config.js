/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0e0e0e',
          void: '#000000',
          elevated: '#1a1919',
          glass: 'rgba(26, 25, 25, 0.4)',
          surface: '#131313',
          card: '#1c1c1c',
        },
        cyber: {
          cyan: '#8ff5ff',
          purple: '#d575ff',
          mint: '#aeffd4',
          red: '#ff716c',
        }
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
