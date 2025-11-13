import axios from 'axios'
import type { IAd, IFilter, IResponse, TAdRejectReason } from '../../types/api.ts'

const API_BASE_URL = 'http://localhost:3001/api/v1'

export const AdsApi = {
  getAds: async (params: Partial<IFilter>): Promise<IResponse> => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/ads`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status,
          categoryId: params.categoryId,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      })
      return data
    } catch (_) {
      throw new Error('Ошибка получения объявлений')
    }
  },

  getAdById: async (id: number): Promise<IAd> => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/ads/${id}`)
      return data
    } catch (_) {
      throw new Error('Ошибка получения объявления по id - ' + id)
    }
  },

  approveAd: async (id: number) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/ads/${id}/approve`)
      return data
    } catch (_) {
      throw new Error('Ошибка одобрения объявления с id - ' + id)
    }
  },

  rejectAd: async (id: number, reason: TAdRejectReason, comment = '') => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/ads/${id}/reject`, {
        reason,
        comment,
      })
      return data
    } catch (_) {
      throw new Error('Ошибка отклонения объявления с id - ' + id + ' и причиной - ' + reason)
    }
  },

  requestChanges: async (id: number, reason: TAdRejectReason, comment = '') => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/ads/${id}/request-changes`, {
        reason,
        comment,
      })
      return data
    } catch (_) {
      throw new Error('Ошибка запроса изменений объявления с id - ' + id + ' и причиной - ' + reason)
    }
  },
}
