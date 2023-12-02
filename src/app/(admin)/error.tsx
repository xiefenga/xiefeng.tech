'use client'
import React from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="error">
      <h1>error</h1>
      <p>{error.stack}</p>
    </div>
  )
}
