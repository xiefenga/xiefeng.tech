'use client'
import React from 'react'
import { useClickAway } from 'ahooks'
import { Input } from '@/components/ui/input'

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
    <div className="h-full w-full">
      {status === 'view' && (
        <div className="h-full text-2xl font-bold" onClick={() => setStatus('edit')}>
          {title || <span className="text-base text-muted-foreground">请输入标题</span>}
        </div>
      )}
      {status === 'edit' && (
        <Input
          autoFocus
          ref={inputRef}
          defaultValue={title}
          placeholder="请输入..."
          className="w-full border-0 text-xl"
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
