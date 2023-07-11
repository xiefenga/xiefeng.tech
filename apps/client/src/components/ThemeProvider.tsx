'use client'
import { useLocalStorageState } from 'ahooks'

import { Theme } from '@/types'
import { ThemeContext } from '@/context/theme'

const ThemeKey = '0x1461A0.me.theme'

 const ThemeProvider = (props: React.PropsWithChildren) => {

  const [theme, setTheme] = useLocalStorageState<Theme>(ThemeKey, { defaultValue: 'light' })

  const context = {
    theme: theme!,
    changeTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  return (
    <ThemeContext.Provider value={context}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider