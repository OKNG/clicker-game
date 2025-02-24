import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'float-up': {
          '0%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(-100px)',
            opacity: '0'
          },
        },
        'poke': {
          '0%': { 
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        },
        'spin-once': {
          '0%': {
            transform: 'rotate(0deg)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },
        'flash': {
          '0%, 100%': {
            backgroundColor: 'var(--tw-bg-opacity)',
          },
          '50%': {
            backgroundColor: 'rgb(34 197 94 / var(--tw-bg-opacity))',
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        'slide-out': {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(100%)'
          }
        }
      },
      animation: {
        'float-up': 'float-up 1s ease-out forwards',
        'poke': 'poke 0.2s ease-in-out',
        'flash': 'flash 0.1s ease-in-out',
        'spin-once': 'spin-once 1s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'slide-out': 'slide-out 0.3s ease-out forwards'
      },
    },
  },
  plugins: [],
} satisfies Config;
