import { type ChangeEvent, useCallback, useEffect, useState } from 'react'
import { StatsApi } from '../../api/ads-api/stats-api.ts'
import type {
  IModeratorActivity,
  IModeratorDecisions,
  IModeratorSummary,
  TChartsCategories,
  TStatsPeriod,
} from '../../types/stats-api.ts'
import { BarChart } from '../../components/bar-chart/bar-chart.tsx'
import { CircleChart } from '../../components/circle-chart/circle-chart.tsx'
import { PERIODS } from '../../constants/ads.ts'
import { DoughnutChart } from '../../components/doughnut-chart/doughnut-chart.tsx'

export function ModeratorStats() {
  const [stats, setStats] = useState<IModeratorSummary | null>(null)
  const [activity, setActivity] = useState<IModeratorActivity[]>([])
  const [decisions, setDecisions] = useState<IModeratorDecisions | null>()
  const [categories, setCategories] = useState<TChartsCategories>()
  const [period, setPeriod] = useState<TStatsPeriod>('week')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [stats, activity, decisions, categories] = await Promise.all([
        StatsApi.fetchStats(period),
        StatsApi.fetchActivity(period),
        StatsApi.fetchDecisions(period),
        StatsApi.fetchCategories(period),
      ])
      setStats(stats)
      setActivity(activity)
      setDecisions(decisions)
      setCategories(categories)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  function handleSetFilter(e: ChangeEvent<HTMLInputElement>) {
    setPeriod(e.target.value as TStatsPeriod)
  }

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error}</div>
  }
  if (!stats) return null
  return (
    <div>
      <section>
        <span>Период:</span>
        <label>
          <input
            type={'radio'}
            name={'period'}
            value={'today'}
            onChange={handleSetFilter}
            checked={period === 'today'}
          />
          Сегодня
        </label>
        <label>
          <input type={'radio'} name={'period'} value={'week'} onChange={handleSetFilter} checked={period === 'week'} />
          7д
        </label>
        <label>
          <input
            type={'radio'}
            name={'period'}
            value={'month'}
            onChange={handleSetFilter}
            checked={period === 'month'}
          />
          30д
        </label>
      </section>
      <section>
        <div>{`Проверено ${stats.totalReviewed}`}</div>
        <div>{`Одобрено ${stats.approvedPercentage.toFixed()}%`}</div>
        <div>{`Отклонено ${stats.rejectedPercentage.toFixed()}%`}</div>
        <div>{`Ср. время ${(stats.averageReviewTime / (1000 * 60)).toFixed(1)} мин`}</div>
      </section>

      {activity.length > 0 && (
        <section>
          <div>
            <BarChart data={activity} period={PERIODS[period]} />
          </div>
        </section>
      )}
      {decisions && <CircleChart data={decisions} />}
      {categories && <DoughnutChart data={categories} />}
    </div>
  )
}
