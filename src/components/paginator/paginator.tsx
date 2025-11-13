import { Button } from '../../widgets/button/button.tsx'
import { ArrowIcon } from '../icons/arrow-icon/arrow-icon.tsx'

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
    <div>
      <div>
        <Button
          type='button'
          onClick={handlePrevPageClick}
          disabled={isLeftButtonDisabled}
          icon={<ArrowIcon rotateAngle={90} />}
        />

        <span>
          {paginator.currentPage} / {paginator.totalPages}
        </span>

        <Button
          type='button'
          onClick={handleNextPageClick}
          disabled={isRightButtonDisabled}
          icon={<ArrowIcon rotateAngle={-90} />}
        />
      </div>
      <div>{`Всего: ${paginator.totalItems} объявлений`}</div>
    </div>
  )
}
