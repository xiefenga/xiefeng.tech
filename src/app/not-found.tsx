import SiteLink from '@/components/link/SiteLink'

const NotFound = () => {
  return (
    <div className="relative animate-main px-20">
      <h1 className="text-5xl font-bold">404</h1>
      <div className="my-8 ">
        <p>Page Not Found 🤖</p>
      </div>
      <SiteLink replace href="/" text="cd /" />
    </div>
  )
}

export default NotFound
