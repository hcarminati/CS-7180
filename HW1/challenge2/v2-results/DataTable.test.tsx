// DataTable.test.tsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, Employee, Column, mockEmployees } from './DataTable';

// Test configuration
const testColumns: Column<Employee>[] = [
  { key: 'name', header: 'Name' },
  { key: 'department', header: 'Department' },
  { key: 'role', header: 'Role' },
  { key: 'salary', header: 'Salary' },
  { key: 'startDate', header: 'Start Date' },
];

const renderTable = (props: Partial<Parameters<typeof DataTable<Employee>>[0]> = {}) => {
  return render(
    <DataTable
      data={mockEmployees}
      columns={testColumns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      {...props}
    />
  );
};

// Helper to get visible row names
const getVisibleNames = (): string[] => {
  const rows = screen.getAllByRole('row').slice(1); // Skip header
  return rows.map(row => {
    const cells = within(row).getAllByRole('cell');
    return cells[0]?.textContent || '';
  }).filter(Boolean);
};

describe('DataTable Component', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // SORTING TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Sorting Behavior', () => {
    test('clicking a column header sorts ascending first', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader);
      
      const names = getVisibleNames();
      // Should be sorted A-Z
      expect(names[0]).toBe('Alice Johnson');
      expect(names).toEqual([...names].sort());
    });

    test('clicking same column header toggles to descending', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader); // Ascending
      await user.click(nameHeader); // Descending
      
      const names = getVisibleNames();
      // With page size 5 and descending, we should see names starting later alphabetically
      expect(names[0]).toMatch(/^[K-Z]/); // Should start with late alphabet letters
    });

    test('only one column can be sorted at a time', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      const deptHeader = screen.getByRole('columnheader', { name: /department/i });
      
      await user.click(nameHeader);
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      expect(deptHeader).not.toHaveAttribute('aria-sort');
      
      await user.click(deptHeader);
      expect(deptHeader).toHaveAttribute('aria-sort', 'ascending');
      expect(nameHeader).not.toHaveAttribute('aria-sort');
    });

    test('sorting resets pagination to page 1', async () => {
      const user = userEvent.setup();
      renderTable();
      
      // Go to page 2
      const nextBtn = screen.getByRole('button', { name: /next page/i });
      await user.click(nextBtn);
      expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();
      
      // Sort a column
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader);
      
      // Should be back to page 1
      expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    });

    test('stable sort preserves order of equal elements', async () => {
      const user = userEvent.setup();
      // Create data with duplicate department values
      const dataWithDupes: Employee[] = [
        { id: 1, name: 'Zara', department: 'Engineering', role: 'Dev', salary: 100, startDate: '2020-01-01' },
        { id: 2, name: 'Alex', department: 'Engineering', role: 'Dev', salary: 100, startDate: '2020-01-01' },
        { id: 3, name: 'Maya', department: 'Engineering', role: 'Dev', salary: 100, startDate: '2020-01-01' },
      ];
      
      render(
        <DataTable data={dataWithDupes} columns={testColumns} defaultPageSize={10} />
      );
      
      const deptHeader = screen.getByRole('columnheader', { name: /department/i });
      await user.click(deptHeader);
      
      // Original order should be preserved since all departments are equal
      const names = getVisibleNames();
      expect(names).toEqual(['Zara', 'Alex', 'Maya']);
    });

    test('keyboard navigation works for sorting', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      nameHeader.focus();
      await user.keyboard('{Enter}');
      
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // FILTERING TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Filtering Behavior', () => {
    test('filters rows by partial text match', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'Engineer');
      
      // Should only show Engineering department employees
      const names = getVisibleNames();
      expect(names.length).toBeGreaterThan(0);
      expect(names.every(name => 
        mockEmployees.find(e => e.name === name)?.department === 'Engineering' ||
        mockEmployees.find(e => e.name === name)?.role.includes('Engineer')
      )).toBe(true);
    });

    test('filtering is case-insensitive', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'ENGINEERING');
      
      const rowCount1 = getVisibleNames().length;
      
      await user.clear(filterInput);
      await user.type(filterInput, 'engineering');
      
      const rowCount2 = getVisibleNames().length;
      expect(rowCount1).toBe(rowCount2);
      expect(rowCount1).toBeGreaterThan(0);
    });

    test('filtering applies across all visible columns', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const filterInput = screen.getByPlaceholderText(/filter/i);
      
      // Filter by name
      await user.type(filterInput, 'Alice');
      expect(getVisibleNames()).toContain('Alice Johnson');
      
      // Filter by salary (should match partial number)
      await user.clear(filterInput);
      await user.type(filterInput, '120000');
      expect(getVisibleNames()).toContain('Alice Johnson');
      
      // Filter by date
      await user.clear(filterInput);
      await user.type(filterInput, '2020-03');
      expect(getVisibleNames()).toContain('Alice Johnson');
    });

    test('filtering resets pagination to page 1', async () => {
      const user = userEvent.setup();
      renderTable();
      
      // Go to page 2
      const nextBtn = screen.getByRole('button', { name: /next page/i });
      await user.click(nextBtn);
      expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();
      
      // Apply filter
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'a');
      
      // Should be back to page 1
      expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    });

    test('filter is applied before pagination', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 5 });
      
      // Filter to get specific results
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'Engineering');
      
      // Count should reflect filtered, not total
      const countText = screen.getByText(/showing/i);
      expect(countText).toHaveTextContent(/filtered from \d+ total/);
    });

    test('empty filter shows all data', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 20 });
      
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'test');
      await user.clear(filterInput);
      
      expect(getVisibleNames().length).toBe(mockEmployees.length);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGINATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Pagination Behavior', () => {
    test('displays correct number of rows per page', () => {
      renderTable({ defaultPageSize: 5 });
      
      const dataRows = screen.getAllByRole('row').slice(1); // Exclude header
      expect(dataRows.length).toBe(5);
    });

    test('next/previous buttons navigate correctly', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 5 });
      
      const nextBtn = screen.getByRole('button', { name: /next page/i });
      const prevBtn = screen.getByRole('button', { name: /previous page/i });
      
      // Initially on page 1, previous should be disabled
      expect(prevBtn).toBeDisabled();
      
      // Go to page 2
      await user.click(nextBtn);
      expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();
      expect(prevBtn).not.toBeDisabled();
      
      // Go back to page 1
      await user.click(prevBtn);
      expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    });

    test('first/last page buttons work correctly', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 5 });
      
      const firstBtn = screen.getByRole('button', { name: /first page/i });
      const lastBtn = screen.getByRole('button', { name: /last page/i });
      
      // Go to last page
      await user.click(lastBtn);
      const totalPages = Math.ceil(mockEmployees.length / 5);
      expect(screen.getByText(new RegExp(`page ${totalPages} of`, 'i'))).toBeInTheDocument();
      
      // Go to first page
      await user.click(firstBtn);
      expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    });

    test('changing page size resets to page 1', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 5 });
      
      // Go to page 2
      await user.click(screen.getByRole('button', { name: /next page/i }));
      expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();
      
      // Change page size
      const pageSizeSelect = screen.getByLabelText(/rows per page/i);
      await user.selectOptions(pageSizeSelect, '10');
      
      // Should reset to page 1
      expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    });

    test('displays correct row count information', () => {
      renderTable({ defaultPageSize: 5 });
      
      expect(screen.getByText(/showing 1 to 5 of 12 results/i)).toBeInTheDocument();
    });

    test('last page shows remaining rows correctly', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 5 });
      
      await user.click(screen.getByRole('button', { name: /last page/i }));
      
      // 12 items, page size 5, last page should have 2 items
      const dataRows = screen.getAllByRole('row').slice(1);
      expect(dataRows.length).toBe(2);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASES
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Edge Cases', () => {
    test('handles empty data array', () => {
      render(
        <DataTable data={[]} columns={testColumns} defaultPageSize={5} />
      );
      
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
      expect(screen.getByText(/no results/i)).toBeInTheDocument();
    });

    test('handles no filter matches gracefully', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'xyznonexistent123');
      
      expect(screen.getByText(/no results match your filter/i)).toBeInTheDocument();
    });

    test('page size changes update total pages correctly', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 5 });
      
      // With 12 items and page size 5: 3 pages
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
      
      // Change to page size 10: 2 pages
      const pageSizeSelect = screen.getByLabelText(/rows per page/i);
      await user.selectOptions(pageSizeSelect, '10');
      expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
      
      // Change to page size 20: 1 page
      await user.selectOptions(pageSizeSelect, '20');
      expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
    });

    test('combined sorting and filtering works correctly', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 20 });
      
      // Filter first
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'Engineering');
      
      // Then sort
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      await user.click(nameHeader);
      
      const names = getVisibleNames();
      // Verify sorting is applied to filtered results
      expect(names).toEqual([...names].sort());
      // Verify all results are from Engineering
      names.forEach(name => {
        const emp = mockEmployees.find(e => e.name === name);
        expect(emp?.department === 'Engineering' || emp?.role.includes('Engineer')).toBe(true);
      });
    });

    test('handles single row data', () => {
      const singleItem: Employee[] = [
        { id: 1, name: 'Solo User', department: 'IT', role: 'Admin', salary: 50000, startDate: '2023-01-01' }
      ];
      
      render(
        <DataTable data={singleItem} columns={testColumns} defaultPageSize={5} />
      );
      
      expect(screen.getByText('Solo User')).toBeInTheDocument();
      expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
    });

    test('handles null/undefined values in data', async () => {
      const user = userEvent.setup();
      const dataWithNulls = [
        { id: 1, name: 'Test User', department: null as any, role: 'Dev', salary: 100, startDate: '2020-01-01' },
      ];
      
      render(
        <DataTable data={dataWithNulls} columns={testColumns} defaultPageSize={5} />
      );
      
      // Should render without crashing
      expect(screen.getByText('Test User')).toBeInTheDocument();
      
      // Sorting should handle null values
      const deptHeader = screen.getByRole('columnheader', { name: /department/i });
      await user.click(deptHeader);
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    test('maintains correct page when filter reduces results', async () => {
      const user = userEvent.setup();
      renderTable({ defaultPageSize: 5 });
      
      // Go to page 3 (last page with 12 items)
      await user.click(screen.getByRole('button', { name: /last page/i }));
      expect(screen.getByText(/page 3 of 3/i)).toBeInTheDocument();
      
      // Filter to reduce results
      const filterInput = screen.getByPlaceholderText(/filter/i);
      await user.type(filterInput, 'Engineering');
      
      // Should adjust to valid page range
      const pageText = screen.getByText(/page \d+ of \d+/i);
      const match = pageText.textContent?.match(/page (\d+) of (\d+)/i);
      if (match) {
        const current = parseInt(match[1]);
        const total = parseInt(match[2]);
        expect(current).toBeLessThanOrEqual(total);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCESSIBILITY TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Accessibility', () => {
    test('table has proper ARIA attributes', () => {
      renderTable();
      
      expect(screen.getByRole('grid')).toHaveAttribute('aria-label');
    });

    test('sortable columns have aria-sort when sorted', async () => {
      const user = userEvent.setup();
      renderTable();
      
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader).not.toHaveAttribute('aria-sort');
      
      await user.click(nameHeader);
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      
      await user.click(nameHeader);
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    test('filter input has accessible label', () => {
      renderTable();
      
      expect(screen.getByLabelText(/filter table/i)).toBeInTheDocument();
    });

    test('pagination buttons have accessible labels', () => {
      renderTable();
      
      expect(screen.getByRole('button', { name: /first page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /last page/i })).toBeInTheDocument();
    });

    test('pagination navigation is wrapped in nav with aria-label', () => {
      renderTable();
      
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });
  });
});