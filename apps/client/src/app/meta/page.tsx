import dayjs from 'dayjs'
import PKG from '$package$'

const BuildPage = () => {

  const version = PKG.version
  const buildingTime = Date.now()

  return (
    <div className='flex flex-col h-full animate-main'>
      <div className='grow'></div>
      <div className='leading-loose'>
        <p>
          <span>版本: </span>
          <span>{version}</span>
        </p>
        <p>
          <span>构建时间: </span>
          <span>{dayjs(buildingTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </p>
      </div>
    </div>
  )
}

export default BuildPage