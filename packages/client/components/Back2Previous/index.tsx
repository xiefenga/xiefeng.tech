import React from 'react'
import Link from 'next/link'

const Back2Previous: React.FC = () => {
  return (
    <div>
      <Link href="../">
        cd ..
      </Link>
    </div>
  )
}

export default Back2Previous