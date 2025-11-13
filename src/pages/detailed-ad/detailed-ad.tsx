import { useLocation, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { Gallery } from '../../widgets/gallery/gallery.tsx'
import { useCallback, useEffect, useState } from 'react'
import type { IAd, TAdStatus } from '../../types/api.ts'
import { AdsApi } from '../../api/ads-api/ads-api.ts'
import { AD_STATUS } from '../../constants/ads.ts'
import { Button } from '../../widgets/button/button.tsx'
import { useAppDispatch } from '../../services/store/store.ts'
import { openModal } from '../../services/slices/modalSlice.ts'
import { ModerateForm } from '../../components/modarate-form/moderate-form.tsx'

export function DetailedAd() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const from = location.state?.from || '/list'
  const { id } = useParams()
  const [ad, setAd] = useState<IAd | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  function handleReturnToList() {
    navigate(from)
  }

  if (!id) return null

  function handlePrevAd() {
    if (!id || parseInt(id) <= 1) return
    navigate(`/item/${parseInt(id) - 1}`, { state: { from: location } })
  }

  function handleNextAd() {
    if (!id) return
    navigate(`/item/${parseInt(id) + 1}`, { state: { from: location } })
  }

  async function handleApprove() {
    if (!id) return
    fetchAd
    await AdsApi.approveAd(parseInt(id))
    fetchAd()
  }

  async function handleModerate(status: TAdStatus) {
    if (!id) return
    dispatch(
      openModal({
        content: <ModerateForm status={status} callback={fetchAd} adId={id} />,
      }),
    )
  }

  const fetchAd = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response: IAd = await AdsApi.getAdById(parseInt(id))
      setAd(response)
    } catch (_) {
      setError('Ошибка получения объявления по id - ' + id)
      handleReturnToList() // Временное решение для невалидного перемещения на следующую страницу
      /* По хорошему, вынести пагинатор в redux и оттуда брать значение максимального элемента
       * и валидировать при попытке преехода на следующую страницу */
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAd()
  }, [fetchAd])

  if (isLoading) return <div>Идет загрузка пользователя...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <Gallery images={Array(3).fill('/image-placeholder.jpeg')} />
      <div>{ad?.description}</div>
      <section>
        <span>Характеристики</span>
        <table>
          <tbody>
            <tr>
              <td>Гарантия</td>
              <td>{ad?.characteristics.Гарантия}</td>
            </tr>
            <tr>
              <td>Модель</td>
              <td>{ad?.characteristics.Модель}</td>
            </tr>
            <tr>
              <td>Цвет</td>
              <td>{ad?.characteristics.Цвет}</td>
            </tr>
            <tr>
              <td>Производитель</td>
              <td>{ad?.characteristics.Производитель}</td>
            </tr>
            <tr>
              <td>Состояние</td>
              <td>{ad?.characteristics.Состояние}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <span>
          Продавец: {ad?.seller.name} {ad?.seller.rating} {`${ad?.seller.totalAds} объявлений`}{' '}
          {`На сайте с: ${ad?.seller.registeredAt.split('T')[0]}`}
        </span>
      </section>
      <section>
        <span>История модерации</span>
        <div>
          {ad?.moderationHistory.map((moderation) => (
            <div key={moderation.id}>
              {`Проверил ${moderation.moderatorName} ${moderation.timestamp}
            с исходом ${AD_STATUS[moderation.action]?.label}`}
              {moderation.action !== 'approved' && ` по причине ${moderation.reason}`}
              <br />
              {moderation.comment && ` Комментарий: ${moderation.comment}`}
            </div>
          ))}
        </div>
      </section>
      <menu>
        <ul>
          <li>
            <Button text={'Одобрить'} onClick={handleApprove} />
          </li>
          <li>
            <Button text={'Отклонить'} onClick={() => handleModerate('rejected')} />
          </li>
          <li>
            <Button text={'Доработка'} onClick={() => handleModerate('requestChanges')} />
          </li>
        </ul>
      </menu>
      <nav>
        <ul>
          <li>
            <Button onClick={handleReturnToList} text={'К списку'} />
          </li>
          <li>
            <Button text={'Пред'} onClick={handlePrevAd} disabled={parseInt(id) <= 1} />
          </li>
          <li>
            <Button text={'След'} onClick={handleNextAd} />
          </li>
        </ul>
      </nav>
    </div>
  )
}
