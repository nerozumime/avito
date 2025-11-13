import { AdsApi } from '../../api/ads-api/ads-api.ts'
import type { IAd, IFilter, IPagination, IResponse, TAdsSortOptions, TSortOrder } from '../../types/api.ts'
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Paginator } from '../paginator/paginator.tsx'
import { PreviewAd } from '../preview-ad/preview-ad.tsx'
import style from './ads-list.module.css'
import { AD_STATUS } from '../../constants/ads.ts'
import { Button } from '../../widgets/button/button.tsx'

export function AdsList() {
  const [ads, setAds] = useState<IAd[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [paginator, setPaginator] = useState<IPagination | null>(null)
  const [page, setPage] = useState<number>(1)
  const timer = useRef<number | null>(null)
  const [filters, setFilters] = useState<IFilter>({
    status: [],
    categoryId: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    minPrice: null,
    maxPrice: null,
    search: '',
  })

  const fetchAds = useCallback(async (page: number, filters: IFilter) => {
    try {
      setIsLoading(true)
      setError(null)
      const response: IResponse = await AdsApi.getAds({
        page,
        ...filters,
      })
      setAds(response.ads)
      setPaginator(response.pagination)
    } catch (_) {
      setError('Ошибка получения объявлений')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAds(1, filters)
  }, [])

  useEffect(() => {
    fetchAds(page, filters)
  }, [page])

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(async () => {
      await fetchAds(page, filters)
    }, 700)
    console.log(filters)
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [filters])

  function handlePrevPageClick() {
    if (!paginator || paginator.currentPage <= 1) return
    setPage((prev) => prev - 1)
  }

  function handleNextPageClick() {
    if (!paginator || paginator.currentPage >= paginator.totalPages) return
    setPage((prev) => prev + 1)
  }

  const handleResetFilters = useCallback(() => {
    setFilters({
      status: [],
      categoryId: null,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      minPrice: null,
      maxPrice: null,
      search: '',
    })
    setPage(1)
  }, [])

  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const handleStatusChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    setFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          status: [...prev.status, value],
        }
      } else {
        return {
          ...prev,
          status: prev.status.filter((status) => status !== value),
        }
      }
    })
  }, [])

  function handleSort(e: ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target
    const sortBy = value.split(' ')[0] as TAdsSortOptions
    const sortOrder = value.split(' ')[1] as TSortOrder
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }))
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <div>
        <span>Фильтры</span>
        <div>
          <span>Статус</span>
          <div>
            <label>
              {AD_STATUS.pending.label}
              <input
                type='checkbox'
                name='status'
                value='pending'
                onChange={handleStatusChange}
                checked={filters.status.includes('pending')}
              />
            </label>
            <label>
              {AD_STATUS.approved.label}
              <input
                type='checkbox'
                name='status'
                value='approved'
                onChange={handleStatusChange}
                checked={filters.status.includes('approved')}
              />
            </label>
            <label>
              {AD_STATUS.rejected.label}
              <input
                type='checkbox'
                name='status'
                value='rejected'
                onChange={handleStatusChange}
                checked={filters.status.includes('rejected')}
              />
            </label>
          </div>
        </div>
        <div>
          <span>Категория</span>
          <select onChange={handleFilterChange} name={'categoryId'} value={filters.categoryId ?? ''}>
            <option value=''>Не выбрано</option>
            <option value={0}>Электроника</option>
            <option value={1}>Недвижимость</option>
            <option value={2}>Транспорт</option>
            <option value={3}>Работа</option>
            <option value={4}>Услуги</option>
            <option value={5}>Животные</option>
            <option value={6}>Мода</option>
            <option value={7}>Детское</option>
          </select>
        </div>
        <div>
          <span>Цена</span>
          <div>
            <label>
              Мин. цена
              <input type={'number'} name={'minPrice'} value={filters.minPrice ?? ''} onChange={handleFilterChange} />
            </label>
            <label>
              Макс. цена
              <input type={'number'} name={'maxPrice'} value={filters.maxPrice ?? ''} onChange={handleFilterChange} />
            </label>
          </div>
        </div>
        <div>
          <span>Название</span>
          <div>
            <input name={'search'} type={'text'} value={filters.search} onChange={handleFilterChange} />
          </div>
        </div>
        <div>
          <span>Сортировать</span>
          <div>
            <select onChange={handleSort} name={'sortBy'} value={`${filters.sortBy} ${filters.sortOrder}`}>
              <option value={'createdAt desc'}>По дате создания (сначала новые)</option>
              <option value={'price desc'}>По цене (по убыванию)</option>
              <option value={'priority desc'}>По приоритету (сначала приоритетные)</option>
              <option value={'createdAt asc'}>По дате создания (сначала старые)</option>
              <option value={'price asc'}>По цене (по возрастанию)</option>
              <option value={'priority asc'}>По приоритету (сначала обычные)</option>
            </select>
          </div>
        </div>
      </div>

      <Button onClick={handleResetFilters} text={'Сбросить фильтры'} />

      {ads.length > 0 && !isLoading && (
        <>
          <ul className={style.list}>
            {ads.map((ad) => (
              <PreviewAd ad={ad} key={ad.id} />
            ))}
          </ul>
          {paginator && (
            <Paginator
              paginator={paginator}
              onPrevPageClick={handlePrevPageClick}
              onNextPageClick={handleNextPageClick}
            />
          )}
        </>
      )}
      {isLoading && <div>Загрузка...</div>}
    </div>
  )
}
