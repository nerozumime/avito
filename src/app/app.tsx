import { Route, Routes } from 'react-router-dom'
import { AdsList } from '../pages/ads-list/ads-list.tsx'
import { DetailedAd } from '../pages/detailed-ad/detailed-ad.tsx'
import { ModeratorStats } from '../pages/moderator-stats/moderator-stats.tsx'
import Modal from '../components/modal/modal.tsx'
import { useAppDispatch, useAppSelector } from '../services/store/store.ts'
import { useEffect } from 'react'
import { initializeTheme, toggleTheme } from '../services/slices/themeSlice.ts'
import { Button } from '../widgets/button/button.tsx'
import { MoonIcon } from '../components/icons/moon-icon.tsx'
import { SunIcon } from '../components/icons/sun-icon.tsx'

export function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(initializeTheme())
  }, [])
  function handleToggleTheme() {
    dispatch(toggleTheme())
  }
  const isDarkTheme = useAppSelector((state) => state.theme.theme) === 'dark'
  return (
    <>
      <Modal />
      <Routes>
        <Route index element={<AdsList />} />
        <Route path={'list'} element={<AdsList />} />
        <Route path={'item/:id'} element={<DetailedAd />} />
        <Route path={'stats'} element={<ModeratorStats />} />
      </Routes>
      <Button onClick={handleToggleTheme} icon={isDarkTheme ? <MoonIcon /> : <SunIcon />} styleClass={'theme-button'} />
    </>
  )
}
