import { Route, Routes } from 'react-router-dom'
import { AdsList } from '../components/ads-list/ads-list.tsx'
import { DetailedAdItem } from '../components/detailed-ad-item/detailed-ad-item.tsx'
import { ModeratorStats } from '../components/moderator-stats/moderator-stats.tsx'

export function App() {
  return (
    <Routes>
      <Route index element={<AdsList />} />
      <Route path={'list'} element={<AdsList />} />
      <Route path={'item/:id'} element={<DetailedAdItem />} />
      <Route path={'stats'} element={<ModeratorStats />} />
    </Routes>
  )
}
