import { AdsApi } from '../../api/ads-api/ads-api.ts'
import type { IAd, IFilter, IPagination, IResponse, TAdsSortOptions, TSortOrder } from '../../types/ads-api.ts'
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Paginator } from '../../components/paginator/paginator.tsx'
import { PreviewAd } from '../../components/preview-ad/preview-ad.tsx'
import style from './ads-list.module.css'
import { Filter } from '../../widgets/filter/filter.tsx'
import { Button } from '../../widgets/button/button.tsx'
import { useNavigate } from 'react-router'

export function AdsList() {
  const [ads, setAds] = useState<IAd[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [paginator, setPaginator] = useState<IPagination | null>(null)
  const [page, setPage] = useState<number>(1)
  const timer = useRef<number | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [filters, setFilters] = useState<IFilter>({
    status: [],
    categoryId: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    minPrice: null,
    maxPrice: null,
    search: '',
  })

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
    fetchAds(page, filters)
  }, [page])

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(async () => {
      fetchAds(1, filters)
    }, 700)
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

  const handleSort = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const sortBy = value.split(' ')[0] as TAdsSortOptions
    const sortOrder = value.split(' ')[1] as TSortOrder
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }))
  }, [])

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
      {isLoading && <div>Загрузка...</div>}
      {/*Кнопка для удобства навигации и тестирования */}
      <Button onClick={() => navigate('/stats')} text={'К статистике'} styleClass={style['stats-nav-button']} />
    </main>
  )
}
