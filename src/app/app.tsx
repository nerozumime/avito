import { Route, Routes } from 'react-router-dom'
import { AdsList } from '../components/ads-list/ads-list.tsx'
import { DetailedAd } from '../components/detailed-ad/detailed-ad.tsx'
import { ModeratorStats } from '../components/moderator-stats/moderator-stats.tsx'
import Modal from '../components/modal/modal.tsx'

export function App() {
  return (
    <>
      <Modal />
      <Routes>
        <Route index element={<AdsList />} />
        <Route path={'list'} element={<AdsList />} />
        <Route path={'item/:id'} element={<DetailedAd />} />
        <Route path={'stats'} element={<ModeratorStats />} />
      </Routes>
    </>
  )
}
