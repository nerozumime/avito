export type TAdRejectReason =
  | 'Запрещенный товар'
  | 'Неверная категория'
  | 'Некорректное описание'
  | 'Проблемы с фото'
  | 'Подозрение на мошенничество'
  | 'Другое'
  | string

export type TAdCategory =
  | 'Электроника'
  | 'Недвижимость'
  | 'Транспорт'
  | 'Работа'
  | 'Услуги'
  | 'Животные'
  | 'Мода'
  | 'Детское'

export type TAdStatus = 'pending' | 'approved' | 'rejected' | 'requestChanges'
export type TAdPriority = 'normal' | 'urgent'
export type TAdProductCondition = 'Новое' | 'Б/у' | 'Отличное' | 'Хорошее' | 'Удовлетворительное'
export type TAdWarrantyStatus = 'Есть' | 'Нет' | 'Частичная'
export type TAdColor = 'Черный' | 'Белый' | 'Серый' | 'Синий' | 'Красный' | 'Зеленый'
export type TAdsSortOptions = 'createdAt' | 'price' | 'priority'
export type TSortOrder = 'asc' | 'desc'

export interface IFilter {
  page?: number
  limit?: number
  status: string[]
  categoryId?: number | null
  minPrice?: number | null
  maxPrice?: number | null
  search?: string
  sortBy?: TAdsSortOptions
  sortOrder?: TSortOrder
}

export interface ISeller {
  id: number
  name: string
  rating: number
  totalAds: number
  registeredAt: string
}

export interface IAdFeatures {
  Состояние: TAdProductCondition
  Гарантия: TAdWarrantyStatus
  Производитель: string
  Модель: string
  Цвет: TAdColor
}

export interface IModerationHistory {
  id: number
  moderatorId: number
  moderatorName: string
  action: TAdStatus
  reason: TAdRejectReason
  comment?: string
  timestamp: string
}

export interface IAd {
  id: number
  title: string
  description: string
  price: number
  category: TAdCategory
  categoryId: number
  status: TAdStatus
  priority: TAdPriority
  createdAt: string
  updatedAt: string
  images: string[]
  seller: ISeller
  characteristics: IAdFeatures
  moderationHistory: Array<IModerationHistory>
}

export interface IPagination {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface IResponse {
  ads: IAd[]
  pagination: IPagination
}
