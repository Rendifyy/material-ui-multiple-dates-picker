import React, { createContext, useState, useCallback } from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/styles/ThemeProvider'
import green from '@material-ui/core/colors/green'
import purple from '@material-ui/core/colors/purple'

function createTheme (light) {
  const theme = {
    palette: {
      type: light ? 'light' : 'dark',
      primary: green,
      secondary: purple
    }
  }

  return createMuiTheme(theme)
}

export const ThemeContext = createContext({})

function ThemeProvider ({ children }) {
  const [theme, setTheme] = useState(createTheme(true))

  const setThemeType = useCallback(
    type => {
      setTheme(createTheme(type === 'light'))
    },
    [setTheme]
  )

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ theme, setThemeType }}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default ThemeProvider
