'use client'
import { useTheme } from 'next-themes'

import Typescript from '@/assets/icons/skill-icons/Typescript.svg'
import StyledComponents from '@/assets/icons/skill-icons/StyledComponents.svg'

import ReactDark from '@/assets/icons/skill-icons/ReactDark.svg'
import NextjsDark from '@/assets/icons/skill-icons/NextjsDark.svg'
import NodejsDark from '@/assets/icons/skill-icons/NodejsDark.svg'
import TailwindcssDark from '@/assets/icons/skill-icons/TailwindcssDark.svg'

import ReactLight from '@/assets/icons/skill-icons/ReactLight.svg'
import NextjsLight from '@/assets/icons/skill-icons/NextjsLight.svg'
import NodejsLight from '@/assets/icons/skill-icons/NodejsLight.svg'
import TailwindcssLight from '@/assets/icons/skill-icons/TailwindcssLight.svg'

const icons = {
  dark: {
    typescript: Typescript,
    react: ReactLight,
    styled: StyledComponents,
    nodejs: NodejsLight,
    nextjs: NextjsLight,
    tailwindcss: TailwindcssLight,
  },
  light: {
    typescript: Typescript,
    react: ReactDark,
    styled: StyledComponents,
    nodejs: NodejsDark,
    nextjs: NextjsDark,
    tailwindcss: TailwindcssDark,
  },
}

type Theme = 'light' | 'dark'

const TechStack = () => {
  const { theme = 'light' } = useTheme()
  return (
    <div className="flex select-none gap-1">
      {Object.values(icons[theme as Theme]).map((Icon, index) => (
        <Icon key={index} />
      ))}
    </div>
  )
}

export default TechStack
