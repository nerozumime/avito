import { API_BASE_URL } from '../../constants/ads.ts'
import type {
  IModeratorActivity,
  IModeratorDecisions,
  IModeratorSummary,
  TChartsCategories,
  TStatsPeriod,
} from '../../types/stats-api.ts'

export const StatsApi = {
  fetchStats: async (period: TStatsPeriod): Promise<IModeratorSummary> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/summary?period=${period}`)
      return await response.json()
    } catch (error: any) {
      throw new Error(error)
    }
  },

  fetchActivity: async (period: TStatsPeriod): Promise<IModeratorActivity[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/chart/activity?period=${period}`)
      return await response.json()
    } catch (error: any) {
      throw new Error(error)
    }
  },

  fetchDecisions: async (period: TStatsPeriod): Promise<IModeratorDecisions> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/chart/decisions?period=${period}`)
      return await response.json()
    } catch (error: any) {
      throw new Error(error)
    }
  },

  fetchCategories: async (period: TStatsPeriod): Promise<TChartsCategories> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/chart/categories?period=${period}`)
      return await response.json()
    } catch (error: any) {
      throw new Error(error)
    }
  },
}
