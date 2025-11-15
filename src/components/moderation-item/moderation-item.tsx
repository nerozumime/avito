import { AD_STATUS, STATUS_COLOR_MAP } from '../../constants/constants.ts'
import type { IModerationHistory } from '../../types/ads-api.ts'
import style from './moderation-item.module.css'

interface ModerationItemProps {
  moderation: IModerationHistory
}
export function ModerationItem({ moderation }: ModerationItemProps) {
  const data = new Date(moderation.timestamp)
  return (
    <span className={style.item}>
      {`Модератор: ${moderation.moderatorName} ${data.toLocaleDateString('ru-RU')}
                в ${data.getHours()}:${data.getMinutes()} `}
      <span className={style.status} style={{ backgroundColor: STATUS_COLOR_MAP[moderation.action].backgroundColor }}>
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
    </span>
  )
}
