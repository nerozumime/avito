import type { IAd } from '../../types/api.ts'
import style from './preview-ad.module.css'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import { AD_STATUS } from '../../constants/ads.ts'
import { AttentionIcon } from '../icons/attention-icon/attention-icon.tsx'
import { Button } from '../../widgets/button/button.tsx'

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
      <section className={style.info}>
        <span className={style.title}>{ad.title.split(':')[1]}</span>
        <span>{ad.price} ₽</span>
        <span>{ad.category}</span>
        <span>{ad.createdAt.split('T')[0]}</span>
      </section>
      <section className={style.statuses}>
        <span style={{ color: status.color }}>{status.label}</span>
        {ad.priority === 'urgent' && (
          <div title={'Срочный приоритет'}>
            <AttentionIcon />
          </div>
        )}
      </section>
      <Button onClick={handleNavigate} styleClass={style.button} text={'Открыть'} />
    </article>
  )
}
