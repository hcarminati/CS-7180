import React, { useState, useMemo, useCallback } from 'react';

// Type Definitions
interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  startDate: string;
}

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

interface DataTableProps<T extends { id: number | string }> {
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

// Mock Dataset
const mockEmployees: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', role: 'Senior Developer', salary: 120000, startDate: '2020-03-15' },
  { id: 2, name: 'Bob Smith', department: 'Marketing', role: 'Marketing Manager', salary: 95000, startDate: '2019-07-22' },
  { id: 3, name: 'Carol Williams', department: 'Engineering', role: 'Tech Lead', salary: 140000, startDate: '2018-01-10' },
  { id: 4, name: 'David Brown', department: 'Sales', role: 'Sales Representative', salary: 75000, startDate: '2021-06-01' },
  { id: 5, name: 'Eva Martinez', department: 'HR', role: 'HR Specialist', salary: 65000, startDate: '2022-02-14' },
  { id: 6, name: 'Frank Lee', department: 'Engineering', role: 'Junior Developer', salary: 70000, startDate: '2023-01-03' },
  { id: 7, name: 'Grace Kim', department: 'Finance', role: 'Financial Analyst', salary: 85000, startDate: '2020-11-20' },
  { id: 8, name: 'Henry Chen', department: 'Engineering', role: 'DevOps Engineer', salary: 115000, startDate: '2019-04-08' },
  { id: 9, name: 'Iris Patel', department: 'Marketing', role: 'Content Strategist', salary: 72000, startDate: '2021-09-15' },
  { id: 10, name: 'Jack Wilson', department: 'Sales', role: 'Sales Manager', salary: 105000, startDate: '2017-12-01' },
  { id: 11, name: 'Karen Thompson', department: 'Engineering', role: 'QA Engineer', salary: 88000, startDate: '2020-08-17' },
  { id: 12, name: 'Leo Garcia', department: 'Finance', role: 'Accountant', salary: 68000, startDate: '2022-05-23' },
];

// Utility: Stable sort implementation
function stableSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
  const indexed = arr.map((item, index) => ({ item, index }));
  indexed.sort((a, b) => {
    const result = compareFn(a.item, b.item);
    return result !== 0 ? result : a.index - b.index;
  });
  return indexed.map(({ item }) => item);
}

// Custom Hooks for separation of concerns
function useSorting<T>(initialKey: keyof T | null = null) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: initialKey,
    direction: 'asc',
  });

  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortData = useCallback((data: T[]): T[] => {
    if (!sortConfig.key) return data;
    
    return stableSort(data, (a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [sortConfig]);

  return { sortConfig, handleSort, sortData };
}

function useFiltering<T>(columns: Column<T>[]) {
  const [filterText, setFilterText] = useState('');

  const filterData = useCallback((data: T[]): T[] => {
    if (!filterText.trim()) return data;
    
    const searchTerm = filterText.toLowerCase().trim();
    const filterableKeys = columns.map((col) => col.key);
    
    return data.filter((row) =>
      filterableKeys.some((key) => {
        const value = row[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm);
      })
    );
  }, [filterText, columns]);

  return { filterText, setFilterText, filterData };
}

function usePagination(totalItems: number, defaultPageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginateData = useCallback(<T,>(data: T[]): T[] => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [safeCurrentPage, pageSize]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    paginateData,
    goToPage,
    resetToFirstPage,
    handlePageSizeChange,
  };
}

// Main Component
function DataTable<T extends { id: number | string }>({
  data,
  columns,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
}: DataTableProps<T>) {
  const { sortConfig, handleSort, sortData } = useSorting<T>();
  const { filterText, setFilterText, filterData } = useFiltering(columns);
  
  // Process data: filter first, then sort
  const filteredData = useMemo(() => filterData(data), [filterData, data]);
  const sortedData = useMemo(() => sortData(filteredData), [sortData, filteredData]);
  
  const {
    currentPage,
    pageSize,
    totalPages,
    paginateData,
    goToPage,
    resetToFirstPage,
    handlePageSizeChange,
  } = usePagination(sortedData.length, defaultPageSize);

  // Paginate the sorted and filtered data
  const displayedData = useMemo(() => paginateData(sortedData), [paginateData, sortedData]);

  // Reset pagination when filter or sort changes
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
    resetToFirstPage();
  }, [setFilterText, resetToFirstPage]);

  const handleColumnSort = useCallback((key: keyof T) => {
    handleSort(key);
    resetToFirstPage();
  }, [handleSort, resetToFirstPage]);

  const getSortIndicator = (key: keyof T): string => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Filter Input */}
      <div className="mb-4 flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-64">
          <label htmlFor="table-filter" className="sr-only">Filter table</label>
          <input
            id="table-filter"
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Filter across all columns..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter table data"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-600">Rows per page:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white" role="grid" aria-label="Employee data table">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleColumnSort(column.key)}
                  aria-sort={
                    sortConfig.key === column.key
                      ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                  tabIndex={column.sortable !== false ? 0 : undefined}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && column.sortable !== false) {
                      e.preventDefault();
                      handleColumnSort(column.key);
                    }
                  }}
                >
                  <span className="flex items-center gap-2">
                    {column.header}
                    {column.sortable !== false && (
                      <span className="text-gray-400" aria-hidden="true">
                        {getSortIndicator(column.key)}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  {filterText ? 'No results match your filter.' : 'No data available.'}
                </td>
              </tr>
            ) : (
              displayedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-sm text-gray-600">
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
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-gray-600">
          {sortedData.length === 0 ? (
            'No results'
          ) : (
            <>
              Showing {((currentPage - 1) * pageSize) + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
              {sortedData.length} results
              {filterText && ` (filtered from ${data.length} total)`}
            </>
          )}
        </div>
        <nav className="flex items-center gap-2" aria-label="Table pagination">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="First page"
          >
            ««
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="px-4 py-1.5 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Next page"
          >
            Next ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Last page"
          >
            »»
          </button>
        </nav>
      </div>
    </div>
  );
}

// Column Configuration
const employeeColumns: Column<Employee>[] = [
  { key: 'name', header: 'Name' },
  { key: 'department', header: 'Department' },
  { key: 'role', header: 'Role' },
  { 
    key: 'salary', 
    header: 'Salary',
    render: (value) => `$${(value as number).toLocaleString()}`
  },
  { key: 'startDate', header: 'Start Date' },
];

// App Component
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 px-4">Employee Directory</h1>
        <DataTable
          data={mockEmployees}
          columns={employeeColumns}
          pageSizeOptions={[5, 10, 20]}
          defaultPageSize={5}
        />
      </div>
    </div>
  );
}