import { useLocation, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { Gallery } from '../../widgets/gallery/gallery.tsx'
import { useCallback, useEffect, useState } from 'react'
import type { IAd, TAdStatus } from '../../types/ads-api.ts'
import { AdsApi } from '../../api/ads-api/ads-api.ts'
import { AD_STATUS, STATUS_COLOR_MAP } from '../../constants/constants.ts'
import { Button } from '../../widgets/button/button.tsx'
import { useAppDispatch } from '../../services/store/store.ts'
import { openModal } from '../../services/slices/modalSlice.ts'
import { ModerateForm } from '../../components/modarate-form/moderate-form.tsx'
import style from './detailed-ad.module.css'
import { BackArrowIcon } from '../../components/icons/back-arrow-icon/back-arrow-icon.tsx'
import clsx from 'clsx'
import { ApproveIcon } from '../../components/icons/approve-icon/approve-icon.tsx'
import { CloseIcon } from '../../components/icons/close-icon/close-icon.tsx'

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
    navigate('/list')
  }

  function returnFromInvalidAdPage() {
    navigate(from)
  }

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
    try {
      await AdsApi.approveAd(parseInt(id))
      await fetchAd()
    } catch (_) {
      throw new Error('Ошибка одобрения объявления id - ' + id)
    }
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
      if (!id) return
      setIsLoading(true)
      setError(null)
      const response: IAd = await AdsApi.getAdById(parseInt(id))
      setAd(response)
    } catch (_) {
      setError('Ошибка получения объявления по id - ' + id)
      returnFromInvalidAdPage() // Временное решение для невалидного перемещения на следующую страницу
      /* По хорошему, вынести пагинатор в redux и оттуда брать значение максимального элемента
       * и валидировать при попытке преехода на следующую страницу */
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAd()
  }, [fetchAd])

  function handleHotkeyPress(e: KeyboardEvent) {
    const { key } = e
    if (key === 'A' || key === 'a' || key === 'ф' || key === 'Ф') {
      handleApprove()
    }
    if (key === 'D' || key === 'd' || key === 'в' || key === 'В') {
      handleModerate('rejected')
    }
    if (key === ',' || key === 'б') {
      handlePrevAd()
    }
    if (key === '.' || key === 'ю') {
      handleNextAd()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleHotkeyPress)

    return () => {
      document.removeEventListener('keydown', handleHotkeyPress)
    }
  }, [handleHotkeyPress])

  if (isLoading) return <div>Идет загрузка пользователя...</div>
  if (error) return <div>{error}</div>
  if (!id) return null

  return (
    <main className={style.main}>
      <div className={style['detailed-wrapper']}>
        <div className={style['section-gallery-history']}>
          <Gallery images={Array(3).fill('/image-placeholder.jpeg')} />
          <section className={style['moderation-history']}>
            <span>История модерации</span>
            <ul>
              {ad?.moderationHistory.map((moderation) => (
                <li key={moderation.id}>
                  {`Модератор: ${moderation.moderatorName} ${new Date(moderation.timestamp).toLocaleDateString('ru-RU')}
                в ${new Date(moderation.timestamp).getHours()}:${new Date(moderation.timestamp).getMinutes()}
            с исходом `}{' '}
                  <span style={{ backgroundColor: STATUS_COLOR_MAP[moderation.action].backgroundColor }}>
                    {AD_STATUS[moderation.action]?.label}
                  </span>
                  {moderation.action !== 'approved' && (
                    <>
                      <br />
                      {`По причине: ${moderation.reason}`}
                    </>
                  )}
                  {moderation.comment && (
                    <>
                      <br />
                      {`Комментарий: ${moderation.comment}`}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <p className={style.description}>{ad?.description}</p>
        <table className={style.features}>
          <caption>Характеристики</caption>
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
        <section className={style['seller-info']}>
          <span>{`Продавец: ${ad?.seller.name} | Рейтинг: ${ad?.seller.rating} `}</span>
          <span>{`Объявлений: ${ad?.seller.totalAds} | На сайте с: ${ad?.seller.registeredAt.split('T')[0]}`}</span>
        </section>
        <menu>
          <ul className={style['menu-list']}>
            <li>
              <Button
                text={'Одобрить'}
                onClick={handleApprove}
                styleClass={clsx(style['button-approve'], style.button)}
                icon={<ApproveIcon />}
                gap={8}
                iconPosition={'left'}
              />
            </li>
            <li>
              <Button
                text={'Отклонить'}
                onClick={() => handleModerate('rejected')}
                styleClass={clsx(style['button-reject'], style.button)}
                iconPosition={'left'}
                gap={8}
                icon={<CloseIcon fill={'#fff'} />}
              />
            </li>
            <li>
              <Button
                text={'Доработка'}
                onClick={() => handleModerate('requestChanges')}
                styleClass={clsx(style['button-request-changes'], style.button)}
                icon={<BackArrowIcon />}
                gap={8}
                iconPosition={'left'}
              />
            </li>
          </ul>
        </menu>
      </div>
      <nav className={style['nav-list']}>
        <Button onClick={handleReturnToList} text={'К списку'} styleClass={'button-primary'} />
        <div className={style['nav-buttons']}>
          <Button
            text={'Пред'}
            onClick={handlePrevAd}
            disabled={parseInt(id) <= 1}
            styleClass={'button-primary'}
            disableClass={style['disabled-button']}
          />
          <Button
            text={'След'}
            onClick={handleNextAd}
            styleClass={'button-primary'}
            disableClass={style['disabled-button']}
          />
        </div>
      </nav>
    </main>
  )
}
