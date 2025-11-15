import { Button } from '../../widgets/button/button.tsx'
import { ArrowIcon } from '../icons/arrow-icon/arrow-icon.tsx'
import style from './paginator.module.css'

interface PaginatorProps {
  onNextPageClick: () => void
  onPrevPageClick: () => void
  paginator: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export const Paginator = (props: PaginatorProps) => {
  const { paginator, onNextPageClick, onPrevPageClick } = props
  const isLeftButtonDisabled = paginator.currentPage === 1
  const isRightButtonDisabled = paginator.currentPage === paginator.totalPages
  const handleNextPageClick = () => {
    onNextPageClick()
  }
  const handlePrevPageClick = () => {
    onPrevPageClick()
  }

  return (
    <div className={style.paginator}>
      <div className={style.main}>
        <Button
          type='button'
          onClick={handlePrevPageClick}
          disabled={isLeftButtonDisabled}
          icon={<ArrowIcon rotateAngle={90} />}
          styleClass={style.button}
          disableClass={style['disabled-button']}
        />

        <span className={style['page-counter']}>
          {paginator.currentPage} / {paginator.totalPages}
        </span>

        <Button
          type='button'
          onClick={handleNextPageClick}
          disabled={isRightButtonDisabled}
          icon={<ArrowIcon rotateAngle={-90} />}
          styleClass={style.button}
          disableClass={style['disabled-button']}
        />
      </div>
      <span className={style['ads-counter']}>{`Всего: ${paginator.totalItems} объявлений`}</span>
    </div>
  )
}
