import dayjs from 'dayjs'
import React from 'react'
import Link from 'next/link'

import { env } from '@/env.mjs'
import LocalIcon from '@/components/icon/LocalIcon'

interface LicenseProps {
  created: number
  updated: number
  author?: string
}

const License: React.FC<LicenseProps> = ({ created, updated, author = env.SITE_AUTHOR }) => {
  const current = dayjs().valueOf()

  const diff = current - updated

  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

  const ifUpdated = diffDays > 0

  return (
    <div className="mt-12 text-sm leading-loose text-[#4A4A4A]">
      <div className="relative flex h-24 flex-col justify-between overflow-hidden border p-2 ">
        <div className="font-bold">
          <div className="flex">
            <span className="w-24">Author</span>
            <span className="w-24">Posted on</span>
            <span className="w-24">Updated on</span>
          </div>
          <div className="flex">
            <span className="w-24">{author}</span>
            <span className="w-24">{dayjs(created).format('YYYY-MM-DD')}</span>
            <span className="w-24">{dayjs(updated).format('YYYY-MM-DD')}</span>
          </div>
        </div>
        <p>
          本文使用
          <Link
            target="_blank"
            className="link-border mx-1"
            href="https://creativecommons.org/licenses/by-nc/4.0/"
          >
            CC BY-NC-SA 4.0
          </Link>
          创作共享协议，转载请署名，图片请转存。
        </p>
        <LocalIcon
          icon="ri:creative-commons-line"
          className="absolute -right-8 -top-4 -z-10 scale-110 text-9xl text-[#D4D4D4]"
        />
      </div>
      {ifUpdated && (
        <p className="bg-[#FEFBED] p-1 text-[#8F7725]">
          本文最后更新于 {diffDays} 天前，文中所描述的信息可能已发生改变
        </p>
      )}
    </div>
  )
}

export default License
