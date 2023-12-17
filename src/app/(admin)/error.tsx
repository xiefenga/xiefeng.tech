'use client'
import React from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="p-4">
      <details className="border p-2">
        <summary>
          <span className="text-red-500">
            {error.name} {error.message}
          </span>
        </summary>
        <pre className="overflow-x-auto p-4">{error.stack}</pre>
      </details>
    </div>
  )
}
