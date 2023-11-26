'use client'
import React from 'react'
import { useClickAway } from 'ahooks'

interface EditableTitleProps {
  title: string
  onChange?: (title: string) => void
}

type EditableTitleStatus = 'view' | 'edit'

const EditableTitle: React.FC<EditableTitleProps> = ({ title, onChange }) => {
  const [status, setStatus] = React.useState<EditableTitleStatus>('view')

  const inputRef = React.useRef<HTMLInputElement>(null)

  useClickAway(() => setStatus('view'), inputRef)

  return (
    <div className="w-full">
      {status === 'view' && (
        <span className="text-2xl font-bold" onClick={() => setStatus('edit')}>
          {title}
        </span>
      )}
      {status === 'edit' && (
        <input
          ref={inputRef}
          defaultValue={title}
          placeholder="请输入..."
          className="input input-bordered w-full text-xl"
          onKeyDown={(e) => {
            const value = (e.target as HTMLInputElement).value.trim()
            if (e.code === 'Enter' && value) {
              setStatus('view')
              onChange?.(value)
            }
          }}
        />
      )}
    </div>
  )
}

export default EditableTitle
