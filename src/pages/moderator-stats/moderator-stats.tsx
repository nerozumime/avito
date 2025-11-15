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
import { PERIODS } from '../../constants/constants.ts'
import { DoughnutChart } from '../../components/doughnut-chart/doughnut-chart.tsx'
import { Input } from '../../components/input/input.tsx'
import style from './moderator-stats.module.css'
import { NoData } from '../../components/no-data/no-data.tsx'

export function ModeratorStats() {
  const [stats, setStats] = useState<IModeratorSummary | null>(null)
  const [activity, setActivity] = useState<IModeratorActivity[]>([])
  const [decisions, setDecisions] = useState<IModeratorDecisions | null>(null)
  const [categories, setCategories] = useState<TChartsCategories | null>(null)
  const [period, setPeriod] = useState<TStatsPeriod>('week')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasAnyDiagram =
    decisions !== null && (decisions.approved > 0 || decisions.rejected > 0 || decisions.requestChanges > 0)

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

  useEffect(() => {
    console.log(activity)
  }, [activity])

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
    <div className={style['stats-page']}>
      <section className={style.period}>
        <span>Период:</span>
        <fieldset className={style.filter}>
          <Input
            type={'radio'}
            name={'period'}
            value={'today'}
            onChange={handleSetFilter}
            checked={period === 'today'}
            label={'Сегодня'}
          />

          <Input
            type={'radio'}
            name={'period'}
            value={'week'}
            onChange={handleSetFilter}
            checked={period === 'week'}
            label={'7д'}
          />

          <Input
            type={'radio'}
            name={'period'}
            value={'month'}
            onChange={handleSetFilter}
            checked={period === 'month'}
            label={'30д'}
          />
        </fieldset>
      </section>
      <ul className={style.stats}>
        <li className={style.box}>{`Проверено: ${stats.totalReviewed}`}</li>
        <li className={style.box}>{`Одобрено: ${stats.approvedPercentage.toFixed()}%`}</li>
        <li className={style.box}>{`Отклонено: ${stats.rejectedPercentage.toFixed()}%`}</li>
        <li className={style.box}>{`Ср. время: ${(stats.averageReviewTime / (1000 * 60)).toFixed(1)} мин`}</li>
      </ul>

      {hasAnyDiagram && (
        <section className={style.diagrams}>
          {activity.length > 0 && <BarChart data={activity} period={PERIODS[period]} />}
          {decisions && <CircleChart data={decisions} />}
          {categories && <DoughnutChart data={categories} />}
        </section>
      )}
      {hasAnyDiagram && <NoData />}
    </div>
  )
}
