import React from 'react'

const Footer: React.FC = () => {
  const thisYear = new Date().getFullYear()
  return (
    <footer className='pb-2 pt-12 text-center shrink-0'>
      <div className='capitalize'>copyright © {thisYear} xie feng</div>
      {/* <div className='text-sm'>Powered by NextJS</div> */}
    </footer>
  )
}


export default Footer