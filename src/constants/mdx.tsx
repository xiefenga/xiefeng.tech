import React from 'react'
import slug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { type MDXRemoteProps } from 'next-mdx-remote/rsc'

import Icon from '@/components/home/mdx/Icon'
import CodeBlock from '@/components/home/mdx/CodeBlock'

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

// eslint-disable-next-line @next/next/no-img-element
const Image = ({ alt, ...props }: ImageProps) => <img {...props} alt={alt} />

export const COMPONENT_MAP: NonNullable<MDXRemoteProps['components']> = {
  Icon,
  img: (props) => {
    if (props.alt?.trim()) {
      const alt = props.alt.trim()
      return (
        <React.Fragment>
          <Image {...props} draggable={false} alt={alt} />
          <span className="block select-none text-center text-sm text-gray-500">{alt}</span>
        </React.Fragment>
      )
    }
    return <Image {...props} draggable={false} alt="" />
  },
  pre: (props) => {
    interface CodeProps {
      className?: `language-${string}`
      children: string
    }
    if (
      React.isValidElement<CodeProps>(props.children) &&
      typeof props.children.type === 'function' &&
      props.children.type.name === 'code'
    ) {
      const { className, children } = props.children.props
      let language = 'plan text'
      if (className?.startsWith('language-')) {
        language = className.replace(/language-/, '').trim()
      }
      return <CodeBlock code={children} language={language} />
    }
    return <pre {...props} />
  },
  code: (props) => <code className="inline-code" {...props} />,
  // TODO add table style support
  table: (props) => <table {...props} className="my-2" />,
}

export const COMPILE_OPTIONS = {
  parseFrontmatter: true,
  mdxOptions: {
    rehypePlugins: [slug],
    // remark-gfm use v3 https://github.com/hashicorp/next-mdx-remote/issues/403#issuecomment-1749540574
    remarkPlugins: [remarkGfm],
  },
}
