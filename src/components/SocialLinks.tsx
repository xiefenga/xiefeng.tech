import IconLink from './icon/IconLink'

import { env } from '@/env.mjs'

const SocialLinks = () => {
  return (
    <div className="mt-40 flex items-center justify-end gap-6 text-3xl text-icon">
      <IconLink href={env.GITHUB_URL} icon="grommet-icons:github" />
      <IconLink href={env.JUEJIN_URL} icon="simple-icons:juejin" />
      <IconLink href={env.ZHIHU_URL} icon="ant-design:zhihu-outlined" />
      <IconLink email href={env.EMAIL_URL} icon="mingcute:mail-fill" />
    </div>
  )
}

export default SocialLinks
