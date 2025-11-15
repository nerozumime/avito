export const STATUS_COLOR_MAP = {
  approved: {
    backgroundColor: '#04e061',
    borderColor: '#139816',
  },
  rejected: {
    backgroundColor: '#ff4053',
    borderColor: '#ca3636',
  },
  requestChanges: {
    backgroundColor: '#f3c34a',
    borderColor: '#c88b46',
  },
}

export const AD_STATUS = {
  pending: {
    color: STATUS_COLOR_MAP.requestChanges.backgroundColor,
    label: 'На модерации',
  },
  approved: {
    color: STATUS_COLOR_MAP.approved.backgroundColor,
    label: 'Одобрено',
  },
  rejected: {
    color: STATUS_COLOR_MAP.rejected.backgroundColor,
    label: 'Отклонено',
  },
  requestChanges: {
    label: 'На доработке',
    color: STATUS_COLOR_MAP.requestChanges.backgroundColor,
  },
  draft: {
    label: 'На доработке',
    color: STATUS_COLOR_MAP.requestChanges.backgroundColor,
  },
} as const

export const PERIODS = {
  today: 'сегодня',
  week: '7 дней',
  month: '30 дней',
}

export const CATEGORY_COLOR_MAP = {
  Электроника: '#4d45f3',
  Недвижимость: '#f89c43',
  Транспорт: '#10b981',
  Работа: '#f59e0b',
  Услуги: '#4480ef',
  Животные: '#83f65c',
  Мода: '#ff46f6',
  Детское: '#4DF7FAED',
}

export const API_BASE_URL = 'http://localhost:3001/api/v1'
