export interface IModeratorSummary {
  totalReviewed: number
  totalReviewedToday: number
  totalReviewedThisWeek: number
  totalReviewedThisMonth: number
  approvedPercentage: number
  rejectedPercentage: number
  requestChangesPercentage: number
  averageReviewTime: number
}

export interface IModeratorActivity extends IModeratorDecisions {
  date: string
}

export interface IModeratorDecisions {
  approved: number
  rejected: number
  requestChanges: number
}

export type TChartsCategories = Record<string, number>

export type TStatsPeriod = 'today' | 'week' | 'month'
