import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  showNavigation = true,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>

      {/* Pagination Controls */}
      <div className="join">
        {/* Previous Button */}
        {showNavigation && (
          <button
            className={`join-item btn ${sizeClasses[size]} ${currentPage === 1 ? 'btn-disabled' : ''}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Page Numbers */}
        {showPageNumbers && pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <button key={`ellipsis-${index}`} className="join-item btn btn-disabled">
                <FaEllipsisH />
              </button>
            )
          }

          return (
            <button
              key={page}
              className={`join-item btn ${sizeClasses[size]} ${currentPage === page ? 'btn-active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        })}

        {/* Next Button */}
        {showNavigation && (
          <button
            className={`join-item btn ${sizeClasses[size]} ${currentPage === totalPages ? 'btn-disabled' : ''}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Page Size Selector (Optional) */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm text-gray-600">Show:</span>
        <select className="select select-bordered select-sm">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
    </div>
  )
}

export default Pagination