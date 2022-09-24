import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Back2Previous: React.FC = () => {
  const router = useRouter()

  const previous = router.asPath.split('/').slice(0, -1).join('/')

  return (
    <div>
      <Link href={previous}>
        cd ..
      </Link>
    </div>
  )
}

export default Back2Previous