import type React from 'react'

const PostLayout = ({ children }: React.PropsWithChildren) => {
  // mx-auto max-w-4xl
  return <div className="px-24 pb-6 lg:px-48">{children}</div>
}

export default PostLayout
