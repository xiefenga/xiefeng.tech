import { Skeleton } from '@/components/ui/skeleton'

const PostListSkeleton = () => {
  return (
    <div>
      {new Array(10).fill(0).map((_, index) => (
        <Skeleton key={index} className="mt-2 h-6 w-[500px]" />
      ))}
    </div>
  )
}

export default PostListSkeleton
