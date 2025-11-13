export const AD_STATUS = {
  pending: {
    color: 'grey',
    label: 'На модерации',
  },
  approved: {
    color: 'green',
    label: 'Одобрено',
  },
  rejected: {
    color: 'red',
    label: 'Отклонено',
  },
  requestChanges: {
    label: 'На доработке',
    color: 'yellow',
  },
  draft: {
    label: 'На доработке',
    color: 'orange',
  },
} as const

export const PERIODS = {
  today: 'сегодня',
  week: '7 дней',
  month: '30 дней',
}

export const API_BASE_URL = 'http://localhost:3001/api/v1'
