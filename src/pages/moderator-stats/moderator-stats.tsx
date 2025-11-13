import { useEffect, useState } from 'react'
import { StatsApi } from '../../api/ads-api/stats-api.ts'
import type { TStatsPeriod } from '../../types/stats-api.ts'

export function ModeratorStats() {
  // const [stats, setStats] = useState(null)
  // const [activityData, setActivityData] = useState([])
  // const [decisionsData, setDecisionsData] = useState([])
  // const [categoriesData, setCategoriesData] = useState([])
  const [period, setPeriod] = useState<TStatsPeriod>('week')
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState('')

  useEffect(() => {
    StatsApi.fetchStats(period)
    StatsApi.fetchActivity(period)
  }, [])
  return <div>Статистика модератора</div>
}
