'use client'
import React from 'react'

interface PopconfirmProps {
  // TODO: placement
  title: React.ReactNode
  onConfirm?: () => void
}

const Popconfirm: React.FC<React.PropsWithChildren<PopconfirmProps>> = ({
  children,
  title,
  onConfirm,
}) => {
  return (
    <div className="dropdown dropdown-end">
      {children}
      <div tabIndex={0} className="dropdown-content z-[1] rounded-md bg-base-100 p-3 shadow">
        <p className="mb-3 whitespace-nowrap text-sm leading-loose">{title}</p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-xs">取消</button>
          <button className="btn btn-primary btn-xs" onClick={onConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  )
}

export default Popconfirm
