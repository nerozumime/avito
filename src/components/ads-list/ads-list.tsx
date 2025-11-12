import { AdsApi } from '../../api/ads-api/ads-api.ts'
import type { IAd, IPagination, IResponse } from '../../types/api.ts'
import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '../paginator/paginator.tsx'
import { PreviewAd } from '../preview-ad/preview-ad.tsx'

export function AdsList() {
  const [ads, setAds] = useState<IAd[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [paginator, setPaginator] = useState<IPagination | null>(null)
  const [page, setPage] = useState<number>(1)

  const fetchAds = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      const response: IResponse = await AdsApi.getAds({ page })
      setAds(response.ads)
      setPaginator(response.pagination)
    } catch (_) {
      setError('Ошибка получения объявлений')
    } finally {
      setIsLoading(false)
    }
  }, [page])

  function handlePrevPageClick() {
    if (!paginator) return
    setPage((prev) => (prev <= 1 ? 1 : prev - 1))
  }

  function handleNextPageClick() {
    if (!paginator) return
    setPage((prev) => (prev >= paginator.totalPages ? prev : prev + 1))
  }

  useEffect(() => {
    fetchAds()
  }, [page])

  if (isLoading) {
    return <div>Загрузка...</div>
  }
  if (error) {
    return <div>Ошибка</div>
  }
  return (
    <div>
      {ads && (
        <ul>
          {ads.map((ad) => (
            <PreviewAd ad={ad} key={ad.id} />
          ))}
        </ul>
      )}
      {paginator && (
        <Paginator paginator={paginator} onPrevPageClick={handlePrevPageClick} onNextPageClick={handleNextPageClick} />
      )}
    </div>
  )
}
