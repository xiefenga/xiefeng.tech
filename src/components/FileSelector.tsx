'use client'

import React from 'react'

interface FileSelectorProps {
  onChange?: (files: FileList | null) => void
}

const FileSelector: React.FC<React.PropsWithChildren<FileSelectorProps>> = ({
  children,
  onChange,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const onClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    inputRef.current?.click()
  }, [])

  return (
    <div onClick={onClick}>
      {children}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => onChange?.(e.target.files)}
      />
    </div>
  )
}

export default FileSelector
