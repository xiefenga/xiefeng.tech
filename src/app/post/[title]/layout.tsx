import type React from 'react'

const PostLayout = ({ children }: React.PropsWithChildren) => {
  return <div className="animate-main px-24 pb-6 lg:px-48">{children}</div>
}

export default PostLayout
