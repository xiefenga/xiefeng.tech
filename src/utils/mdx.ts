import { MDXRemoteProps, compileMDX } from 'next-mdx-remote/rsc'
import { COMPONENT_MAP, COMPILE_OPTIONS } from '@/constants/mdx'

export const compile = async <T extends Record<string, unknown>>(
  source: string,
  components: NonNullable<MDXRemoteProps['components']> = {},
) => {
  return await compileMDX<T>({
    source,
    components: {
      ...COMPONENT_MAP,
      ...components,
    },
    // @ts-expect-error ignore
    options: COMPILE_OPTIONS,
  })
}
