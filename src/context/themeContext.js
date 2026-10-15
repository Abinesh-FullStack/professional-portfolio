import { createContext, useContext } from 'react'

export const ThemeContext = createContext({ theme: 'dark', toggle: () => {}, setTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

export const THEME_KEY = 'av-theme'
