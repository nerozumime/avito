import { API_BASE_URL } from '../../constants/ads.ts'
import type { IModeratorActivity, IModeratorSummary, TStatsPeriod } from '../../types/stats-api.ts'

export const StatsApi = {
  fetchStats: async (period: TStatsPeriod): Promise<IModeratorSummary> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/summary?period=${period}`)
      const stats: IModeratorSummary = await response.json()

      console.log(stats)
      return stats
    } catch (error: any) {
      throw new Error(error)
    }
  },

  fetchActivity: async (period: TStatsPeriod): Promise<IModeratorActivity[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/chart/activity?period=${period}`)
      const activity: IModeratorActivity[] = await response.json()
      activity.forEach((day) => {
        console.log(day.date, day.approved, day.rejected, day.requestChanges)
      })
      return activity
    } catch (error: any) {
      throw new Error(error)
    }
  },
}
