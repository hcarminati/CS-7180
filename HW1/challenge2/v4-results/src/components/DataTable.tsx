import React, { useState, useMemo, useCallback } from 'react';
import type { Column, SortConfig } from '../types';

// Styles object for inline styling
const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '24px',
    maxWidth: '100%',
  } as React.CSSProperties,
  header: {
    marginBottom: '24px',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  } as React.CSSProperties,
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  } as React.CSSProperties,
  searchContainer: {
    flex: 1,
    minWidth: '200px',
  } as React.CSSProperties,
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  } as React.CSSProperties,
  pageSizeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  label: {
    fontSize: '14px',
    color: '#6b7280',
  } as React.CSSProperties,
  select: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  } as React.CSSProperties,
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  } as React.CSSProperties,
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  thSortable: {
    cursor: 'pointer',
    userSelect: 'none',
  } as React.CSSProperties,
  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    color: '#4b5563',
  } as React.CSSProperties,
  trHover: {
    backgroundColor: '#f9fafb',
  } as React.CSSProperties,
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  } as React.CSSProperties,
  pageInfo: {
    fontSize: '14px',
    color: '#6b7280',
  } as React.CSSProperties,
  pageButtons: {
    display: 'flex',
    gap: '4px',
  } as React.CSSProperties,
  pageButton: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } as React.CSSProperties,
  pageButtonActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6',
  } as React.CSSProperties,
  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: '#6b7280',
  } as React.CSSProperties,
  sortIcon: {
    fontSize: '12px',
    color: '#9ca3af',
  } as React.CSSProperties,
  sortIconActive: {
    color: '#3b82f6',
  } as React.CSSProperties,
};

interface DataTableProps<T extends { id: number | string }> {
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
}: DataTableProps<T>) {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [hoveredRow, setHoveredRow] = useState<number | string | null>(null);

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!filterText.trim()) {
      return data;
    }

    const searchTerm = filterText.toLowerCase().trim();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return String(value).toLowerCase().includes(searchTerm);
      })
    );
  }, [data, columns, filterText]);

  // Sort filtered data (stable sort)
  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      // Handle equal values (stable sort)
      if (aVal === bVal) return 0;

      // Handle null/undefined
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Compare values
      let comparison: number;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safePage, pageSize]);

  // Handle sort
  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(e.target.value));
      setCurrentPage(1);
    },
    []
  );

  // Calculate display info
  const startIndex = sortedData.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, sortedData.length);

  // Sort indicator component
  const SortIndicator = ({ column }: { column: Column<T> }) => {
    if (!column.sortable) return null;

    const isActive = sortConfig.key === column.key;
    const arrow = isActive
      ? sortConfig.direction === 'asc'
        ? '▲'
        : '▼'
      : '⇅';

    return (
      <span
        style={{
          ...styles.sortIcon,
          ...(isActive ? styles.sortIconActive : {}),
        }}
        aria-hidden="true"
      >
        {arrow}
      </span>
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (safePage <= 3) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
    } else if (safePage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = safePage - 2; i <= safePage + 2; i++) pages.push(i);
    }

    return pages;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Employee Directory</h1>
        <p style={styles.subtitle}>Manage and view employee information</p>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search across all columns..."
            value={filterText}
            onChange={handleFilterChange}
            style={styles.searchInput}
            aria-label="Filter table data"
            data-testid="filter-input"
          />
        </div>
        <div style={styles.pageSizeContainer}>
          <label htmlFor="pageSize" style={styles.label}>
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={styles.select}
            aria-label="Rows per page"
            data-testid="page-size-select"
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
      <div style={styles.tableWrapper}>
        <table
          style={styles.table}
          role="grid"
          aria-label="Employee data table"
          data-testid="data-table"
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{
                    ...styles.th,
                    ...(col.sortable ? styles.thSortable : {}),
                  }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  onKeyDown={(e) => {
                    if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(col.key);
                    }
                  }}
                  aria-sort={
                    sortConfig.key === col.key
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                  role={col.sortable ? 'columnheader button' : 'columnheader'}
                  data-testid={`header-${String(col.key)}`}
                >
                  <div style={styles.thContent}>
                    {col.header}
                    <SortIndicator column={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={styles.emptyState}
                  data-testid="empty-state"
                >
                  {filterText
                    ? 'No results match your search criteria.'
                    : 'No data available.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  style={hoveredRow === row.id ? styles.trHover : undefined}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  data-testid={`row-${row.id}`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      style={styles.td}
                      data-testid={`cell-${row.id}-${String(col.key)}`}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <div style={styles.pageInfo} data-testid="page-info">
          Showing {startIndex} to {endIndex} of {sortedData.length} entries
          {filterText && ` (filtered from ${data.length} total)`}
        </div>
        <div style={styles.pageButtons} role="navigation" aria-label="Pagination">
          <button
            style={{
              ...styles.pageButton,
              ...(safePage === 1 ? styles.pageButtonDisabled : {}),
            }}
            onClick={() => setCurrentPage(1)}
            disabled={safePage === 1}
            aria-label="First page"
            data-testid="first-page-btn"
          >
            ««
          </button>
          <button
            style={{
              ...styles.pageButton,
              ...(safePage === 1 ? styles.pageButtonDisabled : {}),
            }}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
            data-testid="prev-page-btn"
          >
            «
          </button>

          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              style={{
                ...styles.pageButton,
                ...(safePage === pageNum ? styles.pageButtonActive : {}),
              }}
              onClick={() => setCurrentPage(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={safePage === pageNum ? 'page' : undefined}
              data-testid={`page-btn-${pageNum}`}
            >
              {pageNum}
            </button>
          ))}

          <button
            style={{
              ...styles.pageButton,
              ...(safePage === totalPages ? styles.pageButtonDisabled : {}),
            }}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            aria-label="Next page"
            data-testid="next-page-btn"
          >
            »
          </button>
          <button
            style={{
              ...styles.pageButton,
              ...(safePage === totalPages ? styles.pageButtonDisabled : {}),
            }}
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage === totalPages}
            aria-label="Last page"
            data-testid="last-page-btn"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;