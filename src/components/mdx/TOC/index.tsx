import React from 'react'
import omit from 'lodash.omit'
import { unified } from 'unified'
import remarkMDX from 'remark-mdx'
import remarkParse from 'remark-parse'
import type { Heading, Text } from 'mdast'

import Anchor from './anchor'
import { TOCItem, AnchorLink, Level } from './interface'

interface TableOfContentProps {
  source: string
}

const generateTOC = (links: TOCItem[], link: TOCItem) => {
  if (links.length === 0 || link.level === links[links.length - 1]!.level) {
    links.push(link)
  } else {
    generateTOC(links[links.length - 1]!.children, link)
  }
  return links
}

const TableOfContent: React.FC<TableOfContentProps> = ({ source }) => {
  const processor = unified().use(remarkParse).use(remarkMDX)

  const tree = processor.parse(source)

  const headingCountMap = new Map<Level, number>()

  const links: AnchorLink[] = []

  const toc = tree.children
    .filter((node): node is Heading => node.type === 'heading')
    .reduce((toc, node) => {
      const { depth, children } = node

      // ignore unconventional writing, only plain text is allowed after # in markdown source
      const text = children
        .filter((item): item is Text => item.type === 'text')
        .map((item) => item.value)
        .join('')

      const count = headingCountMap.get(depth) ?? 0
      headingCountMap.set(depth, count + 1)

      // unique id
      const id = `${depth}-${count}`

      const anchor = { id, text, level: depth, children: [] }

      links.push(omit(anchor, 'children'))

      return generateTOC(toc, anchor)
    }, [] as TOCItem[])

  return <Anchor delay={1200} toc={toc} links={links} offsetTop={500} />
}

export default TableOfContent
