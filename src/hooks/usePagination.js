import { useState, useMemo } from 'react'

const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage)

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, currentPage, itemsPerPage])

  // Go to specific page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // First page
  const firstPage = () => {
    setCurrentPage(1)
  }

  // Last page
  const lastPage = () => {
    setCurrentPage(totalPages)
  }

  // Generate page numbers for pagination UI
  const getPageNumbers = (maxPages = 5) => {
    const pages = []
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    let endPage = startPage + maxPages - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return {
    currentPage,
    totalPages,
    currentItems,
    itemsPerPage,
    totalItems: items.length,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    getPageNumbers,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, items.length)
  }
}

export default usePagination