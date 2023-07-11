import { Theme } from '@/types'
import { createContext } from 'react'

interface ThemeContextValue {
  theme: Theme
  changeTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  changeTheme: () => {},
})


