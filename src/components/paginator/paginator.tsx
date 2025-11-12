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
      <button type='button' onClick={handlePrevPageClick} disabled={isLeftButtonDisabled}>
        {'<'}
      </button>

      <span>
        {paginator.currentPage} / {paginator.totalPages}
      </span>

      <button type='button' onClick={handleNextPageClick} disabled={isRightButtonDisabled}>
        {'>'}
      </button>
    </div>
  )
}
