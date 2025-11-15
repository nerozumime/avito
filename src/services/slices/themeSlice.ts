import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: 'light',
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function clearThemeClasses() {
  document.body.classList.remove('dark-theme')
  document.body.classList.remove('light-theme')
}

function handleToggleTheme() {
  const theme = localStorage.getItem('theme')
  const systemTheme = getSystemTheme()
  if (theme) {
    clearThemeClasses()
    document.body.classList.add(`${theme}-theme`)
  } else {
    clearThemeClasses()
    localStorage.setItem('theme', systemTheme)
    document.body.classList.add(`${systemTheme}-theme`)
  }
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      localStorage.setItem('theme', action.payload)
      handleToggleTheme()
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      const isDark = localStorage.getItem('theme') === 'dark'
      localStorage.setItem('theme', isDark ? 'light' : 'dark')
      handleToggleTheme()
      state.theme = localStorage.getItem('theme') as Theme
    },
    initializeTheme: (state) => {
      handleToggleTheme()
      state.theme = localStorage.getItem('theme') as Theme
    },
  },
})

export const { setTheme, toggleTheme, initializeTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer
