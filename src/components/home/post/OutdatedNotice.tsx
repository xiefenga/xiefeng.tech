'use client'
import React from 'react'
import dayjs from 'dayjs'

interface Props {
  updated: number
}

const OutdatedNotice = ({ updated }: Props) => {
  const current = dayjs().valueOf()

  const diff = current - updated

  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

  const outdated = diffDays > 15

  if (outdated) {
    return (
      <p className="bg-[#FEFBED] p-1 text-[#8F7725]">
        本文最后更新于 {diffDays} 天前，文中所描述的信息可能已发生改变
      </p>
    )
  }
}

export default OutdatedNotice
