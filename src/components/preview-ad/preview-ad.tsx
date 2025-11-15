import type { IAd } from '../../types/ads-api.ts'
import style from './preview-ad.module.css'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import { AD_STATUS, CATEGORY_COLOR_MAP } from '../../constants/constants.ts'
import { AttentionIcon } from '../icons/attention-icon/attention-icon.tsx'
import { Button } from '../../widgets/button/button.tsx'
import clsx from 'clsx'

interface PreviewAdProps {
  ad: IAd
}

export function PreviewAd({ ad }: PreviewAdProps) {
  const navigate = useNavigate()
  const location = useLocation()

  function handleNavigate() {
    navigate(`/item/${ad.id}`, { state: { from: location } })
  }
  const status = AD_STATUS[ad.status]
  return (
    <article className={style.card}>
      <img className={style.image} alt={ad.title} src={'/public/image-placeholder.jpeg'} />
      <span className={style.category} style={{ backgroundColor: CATEGORY_COLOR_MAP[ad.category] }}>
        {ad.category}
      </span>
      {ad.priority === 'urgent' && (
        <div title={'Срочный приоритет'} className={style.priority}>
          <AttentionIcon />
        </div>
      )}
      <div className={style['info-wrapper']}>
        <section className={style.info}>
          <span className={style.title}>{ad.title.split(':')[1]}</span>
          <span>{ad.price} ₽</span>
          <span>{`Создано: ${ad.createdAt.split('T')[0]}`}</span>
        </section>
        <span className={style.status} style={{ color: status?.color }}>
          {status?.label}
        </span>
      </div>
      <Button onClick={handleNavigate} styleClass={clsx('button-primary', style['open-button'])} text={'Открыть'} />
    </article>
  )
}
