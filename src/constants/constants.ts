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

export const STATUS_COLOR_MAP = {
  approved: {
    backgroundColor: '#42e17c',
    borderColor: '#139816',
  },
  rejected: {
    backgroundColor: '#ff3d3d',
    borderColor: '#ca3636',
  },
  requestChanges: {
    backgroundColor: '#f3c34a',
    borderColor: '#c88b46',
  },
}

export const API_BASE_URL = 'http://localhost:3001/api/v1'
