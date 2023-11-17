import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  return (
    <div className="navbar h-16 flex-shrink-0 bg-base-100 px-8">
      <Link href="/admin" className="btn btn-ghost text-xl">
        站点管理
      </Link>
      <div className="dropdown dropdown-end ml-auto">
        <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <Image width={40} height={40} src="/favicon.ico" alt="" />
            </div>
          </div>
        </label>
        {/* <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 z-10 w-20 rounded p-2 shadow"
        >
          <li>
            <Logout />
          </li>
        </ul> */}
      </div>
    </div>
  )
}

export default Header
