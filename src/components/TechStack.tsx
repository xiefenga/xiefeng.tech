'use client'
import React from 'react'
import { useTheme } from 'next-themes'

import { SVGComponent, Theme } from '@/types'
import { LOCAL_ICONS } from '@/constants/icons'

const LOCAL_SKILL_ICONS = Object.keys(LOCAL_ICONS)
  .filter((key) => key.startsWith('skill-icons:'))
  .reduce(
    (memo, item) => ({
      ...memo,
      [item.replace('skill-icons:', '')]: LOCAL_ICONS[item]!,
    }),
    {} as Record<string, SVGComponent>,
  )

const LIGHT_SKILL_ICONS = Object.keys(LOCAL_SKILL_ICONS)
  .filter((key) => !key.endsWith('-dark'))
  .reduce(
    (memo, item) => ({
      ...memo,
      [item.replace('-light', '')]: LOCAL_SKILL_ICONS[item]!,
    }),
    {} as Record<string, SVGComponent>,
  )

const DARK_SKILL_ICONS = Object.keys(LOCAL_SKILL_ICONS)
  .filter((key) => !key.endsWith('-light'))
  .reduce(
    (memo, item) => ({
      ...memo,
      [item.replace('-dark', '')]: LOCAL_SKILL_ICONS[item]!,
    }),
    {} as Record<string, SVGComponent>,
  )

const SKILL_ICONS = {
  light: DARK_SKILL_ICONS,
  dark: LIGHT_SKILL_ICONS,
}

interface TechStackProps {
  skills?: string[]
}

const TechStack: React.FC<TechStackProps> = ({ skills = [] }) => {
  const { theme = 'light' } = useTheme()
  const ThemedSkillIcons = SKILL_ICONS[theme as Theme]
  const icons = skills.map((skill) => ThemedSkillIcons[skill] ?? React.Fragment)
  if (icons.length) {
    return (
      <div className="flex select-none gap-1">
        {Object.values(icons).map((Icon, index) => (
          <Icon className="h-8 w-8" key={index} />
        ))}
      </div>
    )
  }
}

export default TechStack
