'use client'
import React from 'react'
import ReactLoading from 'react-loading'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ConfirmDialogProps {
  title: React.ReactNode
  description: React.ReactNode
  content?: React.ReactNode
  onConfirm?: () => void | Promise<void>
}

const ConfirmDialog: React.FC<React.PropsWithChildren<ConfirmDialogProps>> = (props) => {
  const { children, title, content, description, onConfirm } = props

  const [open, setOpen] = React.useState(false)

  const [loading, setLoading] = React.useState(false)

  const onConfirmClick = async () => {
    setLoading(true)
    await onConfirm?.()
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-2">{description}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button disabled={loading} variant="destructive" size="sm" onClick={onConfirmClick}>
            {loading && <ReactLoading className="mr-1 !h-4 !w-4" type="spin" />}
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog
