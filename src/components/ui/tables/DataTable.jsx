import { useState } from 'react'
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaEye } from 'react-icons/fa'

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  actions = true,
  selectable = false,
  onSelect,
  selectedRows = [],
  pagination = null,
  emptyMessage = 'No data available',
  className = '',
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0
    
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="text-gray-400" />
    }
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="text-primary" /> : 
      <FaSortDown className="text-primary" />
  }

  const handleSelect = (id) => {
    if (onSelect) {
      onSelect(id)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra w-full" {...props}>
        <thead>
          <tr>
            {selectable && (
              <th className="w-12">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedRows.length === data.length}
                  onChange={() => {
                    if (selectedRows.length === data.length) {
                      onSelect && onSelect([])
                    } else {
                      onSelect && onSelect(data.map(item => item.id || item._id))
                    }
                  }}
                />
              </th>
            )}
            
            {columns.map((column) => (
              <th 
                key={column.key} 
                className={`${column.sortable ? 'cursor-pointer hover:bg-base-200' : ''}`}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
            
            {actions && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        
        <tbody>
          {sortedData.map((row, index) => (
            <tr 
              key={row.id || row._id || index}
              className={onRowClick ? 'hover cursor-pointer' : ''}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedRows.includes(row.id || row._id)}
                    onChange={() => handleSelect(row.id || row._id)}
                  />
                </td>
              )}
              
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              
              {actions && (
                <td>
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          onView(row)
                        }}
                      >
                        <FaEye />
                      </button>
                    )}
                    
                    {onEdit && (
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(row)
                        }}
                      >
                        <FaEdit />
                      </button>
                    )}
                    
                    {onDelete && (
                      <button
                        className="btn btn-xs btn-ghost text-error"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(row)
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
          </div>
          
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={pagination.onPrev}
              disabled={!pagination.hasPrev}
            >
              Previous
            </button>
            
            {pagination.pages.map((page) => (
              <button
                key={page}
                className={`join-item btn btn-sm ${pagination.current === page ? 'btn-active' : ''}`}
                onClick={() => pagination.onPageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="join-item btn btn-sm"
              onClick={pagination.onNext}
              disabled={!pagination.hasNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable