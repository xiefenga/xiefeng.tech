import daisyui from 'daisyui'
import forms from '@tailwindcss/forms'
import { type Config } from 'tailwindcss'

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-fira-mono)'],
        virgil: ['var(--font-virgil)'],
      },
      animation: {
        header: 'header-effect 1s ease-out',
        main: 'main-effect 1s ease-out',
      },
      keyframes: {
        'header-effect': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'main-effect': {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      textColor: {
        icon: 'var(--icon-color)',
        'code-lang': 'var(--code-lang-text-color)',
      },
      backgroundColor: {
        'code-lang': 'var(--code-lang-background-color)',
        'block-code': 'var(--block-code-background-color)',
      },
    },
  },
  daisyui: {
    themes: ['light'],
    themeRoot: '[daisyui-root]',
  },
  plugins: [forms, daisyui],
} satisfies Config
