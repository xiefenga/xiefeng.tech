import React from 'react'

interface PageTitileProps {
  text: string
}

const PageTitle: React.FC<PageTitileProps> = ({ text }) => {
  return (
    <div className="relative inline-block px-3">
      <h1 className="text-6xl font-bold">{text}</h1>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-5 bg-[#C4E7E8] opacity-60 dark:bg-[#1D1E1F]"></div>
    </div>
  )
}

export default PageTitle
