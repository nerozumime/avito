import { AdsApi } from '../../api/ads-api/ads-api.ts'
import type { IAd, IFilter, IPagination, IResponse, TAdsSortOptions, TSortOrder } from '../../types/ads-api.ts'
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Paginator } from '../../components/paginator/paginator.tsx'
import { PreviewAd } from '../../components/preview-ad/preview-ad.tsx'
import style from './ads-list.module.css'
import { Filter } from '../../widgets/filter/filter.tsx'
import { Button } from '../../widgets/button/button.tsx'
import { useNavigate, useSearchParams } from 'react-router'

export function AdsList() {
  const [ads, setAds] = useState<IAd[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [paginator, setPaginator] = useState<IPagination | null>(null)
  const [page, setPage] = useState<number>(1)
  const timer = useRef<number | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters: IFilter = useMemo(
    () => ({
      status: searchParams.get('status')?.split(',') || [],
      categoryId: isNaN(parseInt(searchParams.get('categoryId') || ''))
        ? null
        : parseInt(searchParams.get('categoryId') || ''),
      minPrice: isNaN(parseInt(searchParams.get('minPrice') || ''))
        ? null
        : parseInt(searchParams.get('minPrice') || ''),
      maxPrice: isNaN(parseInt(searchParams.get('maxPrice') || ''))
        ? null
        : parseInt(searchParams.get('maxPrice') || ''),
      search: searchParams.get('search') || '',
      sortBy: (searchParams.get('sortBy') as TAdsSortOptions) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as TSortOrder) || 'desc',
    }),
    [searchParams],
  )
  const setFilters = useCallback(
    (filters: IFilter) => {
      const params = new URLSearchParams()
      if (filters.status.length > 0) {
        params.set('status', filters.status.join(','))
      }
      if (filters.categoryId !== null && filters.categoryId !== undefined) {
        params.set('categoryId', String(filters.categoryId))
      }
      if (filters.minPrice !== null && filters.minPrice !== undefined) {
        params.set('minPrice', String(filters.minPrice))
      }
      if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
        params.set('maxPrice', String(filters.maxPrice))
      }
      if (filters.search) {
        params.set('search', filters.search)
      }
      if (filters.sortBy && filters.sortOrder) {
        params.set('sortBy', filters.sortBy)
        params.set('sortOrder', filters.sortOrder)
      }
      setSearchParams(params)
      setPage(1)
    },
    [setSearchParams],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleFocusSearch)
  }, [])

  function handleFocusSearch(e: KeyboardEvent) {
    const { key } = e
    if (searchRef.current && key === '/') {
      e.preventDefault() // Убираем возможность ввода слеша, но устраняем баг ввода
      searchRef.current.focus()
    }
  }

  const fetchAds = useCallback(async (page: number, filters: IFilter) => {
    try {
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
    setIsLoading(true)
    fetchAds(page, filters)
  }, [page, fetchAds])

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    setIsLoading(true)
    timer.current = setTimeout(async () => {
      fetchAds(1, filters)
    }, 400)
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [filters, fetchAds])

  function handlePrevPageClick() {
    if (!paginator || paginator.currentPage <= 1) return
    setPage((prev) => prev - 1)
  }

  function handleNextPageClick() {
    if (!paginator || paginator.currentPage >= paginator.totalPages) return
    setPage((prev) => prev + 1)
  }

  const handleResetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
    setPage(1)
  }, [])

  const handleFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (e.target.name === 'categoryId' || e.target.name === 'minPrice' || e.target.name === 'maxPrice') {
        setFilters({
          ...filters,
          [e.target.name]: e.target.value === '' ? null : parseInt(e.target.value, 10),
        })
      } else {
        setFilters({
          ...filters,
          [e.target.name]: e.target.value,
        })
      }
    },
    [filters, setFilters],
  )

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target
      if (checked) {
        setFilters({
          ...filters,
          status: [...filters.status, value],
        })
      } else {
        setFilters({
          ...filters,
          status: filters.status.filter((status) => status !== value),
        })
      }
    },
    [filters, setFilters],
  )

  const handleSort = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target
      const sortBy = value.split(' ')[0] as TAdsSortOptions
      const sortOrder = value.split(' ')[1] as TSortOrder
      setFilters({
        ...filters,
        sortBy,
        sortOrder,
      })
    },
    [filters, setFilters],
  )

  if (error) {
    return <div>{error}</div>
  }

  return (
    <main className={style['ads-list']}>
      <Filter
        filters={filters}
        searchRef={searchRef}
        handleFilterChange={handleFilterChange}
        handleResetFilters={handleResetFilters}
        handleSort={handleSort}
        handleStatusChange={handleStatusChange}
      />
      {isLoading && searchParams && <div>Применяем фильтры...</div>}
      {isLoading && !searchParams && <div>Загрузка объявлений...</div>}
      {ads.length > 0 && !isLoading && (
        <>
          <ul className={style.list}>
            {ads.map((ad) => (
              <li key={ad.id}>
                <PreviewAd ad={ad} />
              </li>
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
      {/*Кнопка для удобства навигации и тестирования */}
      <Button onClick={() => navigate('/stats')} text={'К статистике'} styleClass={style['stats-nav-button']} />
    </main>
  )
}
