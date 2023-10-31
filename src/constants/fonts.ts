import loadFont from 'next/font/local'

export const virgil = loadFont({
  src: '../assets/fonts/Virgil.woff2',
  variable: '--font-virgil',
})

// Load fonts locally to avoid Network Error
export const firaMono = loadFont({
  src: '../assets/fonts/FiraMono-Regular.ttf',
  variable: '--font-fira-mono',
})

export const inter = loadFont({
  src: [
    {
      path: '../assets/fonts/Inter/static/Inter-Regular.ttf',
      weight: '400',
    },
    {
      path: '../assets/fonts/Inter/static/Inter-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-inter',
})
