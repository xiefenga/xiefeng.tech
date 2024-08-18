'use client'
import React from 'react'
import { ThemeProvider } from 'next-themes'
import { AppProgressBar } from 'next-nprogress-bar'

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      {/* resolve build warnings: Entire page deopted into client-side rendering */}
      {/* https://github.com/Skyleen77/next-nprogress-bar/issues/25 */}
      <React.Suspense>
        <AppProgressBar shallowRouting options={{ showSpinner: false }} />
      </React.Suspense>
      {children}
    </ThemeProvider>
  )
}
