'use client'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface PopconfirmProps {
  title: React.ReactNode
  description?: React.ReactNode
  onConfirm?: () => void | Promise<void>
}

const Popconfirm: React.FC<React.PropsWithChildren<PopconfirmProps>> = ({
  children,
  title,
  description,
  onConfirm,
}) => {
  const [open, setOpen] = React.useState(false)

  const onConfirmClick = async () => {
    await onConfirm?.()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="top" align="end" alignOffset={-50} className="w-auto">
        <h4 className="text-base font-medium">{title}</h4>
        <p className="py-1 text-sm">{description}</p>
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button size="sm" onClick={onConfirmClick}>
            确认
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Popconfirm
