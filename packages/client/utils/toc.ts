
export interface NavData {
  id: string
  level: number
  text: string
}

export interface SubNavData extends NavData {
  subs?: SubNavData[]
}

export function handleNestingNav(navData: NavData[]): SubNavData[] {
  const subs = navData.reduce((memo, nav) => {
    const last = memo[memo.length - 1]
    if (memo.length > 0 && last.level < nav.level) {
      last.subs ??= []
      last.subs.push(nav)
    } else {
      memo.push(nav)
    }
    return memo
  }, [] as SubNavData[])

  for (const nav of subs) {
    if (nav.subs) {
      nav.subs = handleNestingNav(nav.subs)
    }
  }
  return subs
}

export function getNavStructure(source: string) {
  const contentWithoutCode = source
    // .replace(/^[^#]+\n/g, '')
    // .replace(/(?:[^\n#]+)#+\s([^#\n]+)\n*/g, '') // 匹配行内出现 # 号的情况
    // .replace(/^#\s[^#\n]*\n+/, '')
    .replace(/```[^`\n]*\n+[^```]+```\n+/g, '')
    .replace(/`([^`\n]+)`/g, '')
    // .replace(/\*\*?([^*\n]+)\*\*?/g, '$1')
    // .replace(/__?([^_\n]+)__?/g, '$1')
    .trim()

  // console.log(contentWithoutCode)

  const patternOfTitle = /#+\s([^#\n]+)\n*/g
  const matchResult = contentWithoutCode.match(patternOfTitle)

  if (!matchResult) {
    return []
  }

  const navData = matchResult.map((r, i) => ({
    id: '',
    level: r.match(/^#+/g)![0].length,
    text: r.replace(patternOfTitle, '$1').trim(),
  }))

  const map = new Map<number, NavData[]>()

  navData.forEach(nav => {
    const { level, text } = nav
    const navs = map.get(level) ?? []
    nav.id = `h${level}-${text}-${navs.length}`
    navs.push(nav)
    map.set(level, navs)
  })

  const subNav = handleNestingNav(navData)

  return subNav
}