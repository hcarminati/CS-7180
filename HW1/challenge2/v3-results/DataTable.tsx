import React, { useState, useMemo, useCallback } from 'react';
import { Column, SortConfig, SortDirection, DataTableProps } from './types';

// ============== Custom Hooks ==============

function useFilter<T>(data: T[], columns: Column<T>[]) {
  const [filterText, setFilterText] = useState('');

  const filteredData = useMemo(() => {
    if (!filterText.trim()) return data;

    const lowerFilter = filterText.toLowerCase();

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerFilter);
      })
    );
  }, [data, columns, filterText]);

  return { filterText, setFilterText, filteredData };
}

function useSort<T>(data: T[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: 'asc',
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((prev) => {
      const newDirection: SortDirection =
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction: newDirection };
    });
  }, []);

  return { sortConfig, sortedData, handleSort };
}

function usePagination<T>(data: T[], initialPageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.length / pageSize)),
    [data.length, pageSize]
  );

  const safePage = useMemo(
    () => Math.min(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, safePage, pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safePage,
    pageSize,
    totalPages,
    totalItems: data.length,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
    changePageSize,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

// ============== DataTable Component ==============

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20],
}: DataTableProps<T>): React.ReactElement {
  const { filterText, setFilterText, filteredData } = useFilter(data, columns);
  const { sortConfig, sortedData, handleSort } = useSort(filteredData);
  const pagination = usePagination(sortedData, initialPageSize);

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(event.target.value);
      pagination.resetPage();
    },
    [setFilterText, pagination]
  );

  const handleSortClick = useCallback(
    (key: keyof T) => {
      handleSort(key);
      pagination.resetPage();
    },
    [handleSort, pagination]
  );

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      pagination.changePageSize(Number(event.target.value));
    },
    [pagination]
  );

  const getSortIndicator = (key: keyof T): string => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const startItem =
    pagination.paginatedData.length > 0
      ? (pagination.currentPage - 1) * pagination.pageSize + 1
      : 0;
  const endItem = Math.min(
    pagination.currentPage * pagination.pageSize,
    pagination.totalItems
  );

  return (
    <div className="data-table-container">
      {/* Controls */}
      <div className="data-table-controls">
        <div className="filter-container">
          <label htmlFor="table-filter" className="sr-only">
            Filter table
          </label>
          <input
            id="table-filter"
            type="text"
            placeholder="Search all columns..."
            value={filterText}
            onChange={handleFilterChange}
            aria-label="Filter table"
          />
        </div>
        <div className="page-size-container">
          <label htmlFor="page-size">Rows per page:</label>
          <select
            id="page-size"
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <table role="grid" aria-label="Data table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} scope="col">
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSortClick(column.key)}
                    aria-label={`Sort by ${column.header}`}
                    aria-sort={
                      sortConfig.key === column.key
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    {column.header} {getSortIndicator(column.key)}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagination.paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-state">
                No results found
                {filterText && (
                  <button
                    type="button"
                    onClick={() => setFilterText('')}
                    className="clear-filter-btn"
                  >
                    Clear filter
                  </button>
                )}
              </td>
            </tr>
          ) : (
            pagination.paginatedData.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container" role="navigation" aria-label="Pagination">
        <span className="pagination-info">
          Showing {startItem}–{endItem} of {pagination.totalItems}
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            onClick={pagination.goToPreviousPage}
            disabled={!pagination.hasPreviousPage}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="page-indicator">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={pagination.goToNextPage}
            disabled={!pagination.hasNextPage}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;