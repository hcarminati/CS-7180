import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';
import { Column } from './types';

interface TestData {
  id: number;
  name: string;
  age: number;
  city: string;
}

const testData: TestData[] = [
  { id: 1, name: 'Alice', age: 30, city: 'New York' },
  { id: 2, name: 'Bob', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Charlie', age: 35, city: 'Chicago' },
  { id: 4, name: 'Diana', age: 28, city: 'Houston' },
  { id: 5, name: 'Eve', age: 32, city: 'Phoenix' },
  { id: 6, name: 'Frank', age: 40, city: 'Philadelphia' },
  { id: 7, name: 'Grace', age: 22, city: 'San Antonio' },
  { id: 8, name: 'Henry', age: 45, city: 'San Diego' },
  { id: 9, name: 'Ivy', age: 29, city: 'Dallas' },
  { id: 10, name: 'Jack', age: 33, city: 'San Jose' },
  { id: 11, name: 'Karen', age: 27, city: 'Austin' },
  { id: 12, name: 'Leo', age: 38, city: 'Jacksonville' },
];

const testColumns: Column<TestData>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
  { key: 'city', header: 'City', sortable: true },
];

const renderTable = (props: Partial<Parameters<typeof DataTable<TestData>>[0]> = {}) => {
  return render(
    <DataTable
      data={testData}
      columns={testColumns}
      pageSize={5}
      pageSizeOptions={[5, 10, 20]}
      {...props}
    />
  );
};

describe('DataTable', () => {
  describe('Rendering', () => {
    it('renders table with correct headers', () => {
      renderTable();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
    });

    it('renders correct number of rows based on page size', () => {
      renderTable({ pageSize: 5 });
      const rows = screen.getAllByRole('row');
      // Header row + 5 data rows
      expect(rows).toHaveLength(6);
    });

    it('renders filter input', () => {
      renderTable();
      expect(screen.getByPlaceholderText('Search all columns...')).toBeInTheDocument();
    });

    it('renders pagination controls', () => {
      renderTable();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts ascending on first click', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.click(screen.getByRole('button', { name: /sort by name/i }));

      const tbody = screen.getAllByRole('row').slice(1);
      const firstCell = within(tbody[0]).getAllByRole('cell')[0];
      expect(firstCell).toHaveTextContent('Alice');
    });

    it('sorts descending on second click', async () => {
      const user = userEvent.setup();
      renderTable();

      const sortButton = screen.getByRole('button', { name: /sort by name/i });
      await user.click(sortButton);
      await user.click(sortButton);

      const tbody = screen.getAllByRole('row').slice(1);
      const firstCell = within(tbody[0]).getAllByRole('cell')[0];
      expect(firstCell).toHaveTextContent('Leo');
    });

    it('sorts numeric columns correctly', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.click(screen.getByRole('button', { name: /sort by age/i }));

      const tbody = screen.getAllByRole('row').slice(1);
      const firstAgeCell = within(tbody[0]).getAllByRole('cell')[1];
      expect(firstAgeCell).toHaveTextContent('22');
    });

    it('resets to page 1 when sorting', async () => {
      const user = userEvent.setup();
      renderTable();

      // Go to page 2
      await user.click(screen.getByText('Next'));
      expect(screen.getByText(/Page 2/)).toBeInTheDocument();

      // Sort should reset to page 1
      await user.click(screen.getByRole('button', { name: /sort by name/i }));
      expect(screen.getByText(/Page 1/)).toBeInTheDocument();
    });

    it('only one column is sorted at a time', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.click(screen.getByRole('button', { name: /sort by name/i }));
      await user.click(screen.getByRole('button', { name: /sort by age/i }));

      // The table should be sorted by age, not name
      const tbody = screen.getAllByRole('row').slice(1);
      const firstAgeCell = within(tbody[0]).getAllByRole('cell')[1];
      expect(firstAgeCell).toHaveTextContent('22');
    });
  });

  describe('Filtering', () => {
    it('filters rows by partial match', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.type(screen.getByPlaceholderText('Search all columns...'), 'Ali');

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    it('filtering is case-insensitive', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.type(screen.getByPlaceholderText('Search all columns...'), 'ALICE');

      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('filters across all visible columns', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.type(screen.getByPlaceholderText('Search all columns...'), 'Chicago');

      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('resets to page 1 when filtering', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.click(screen.getByText('Next'));
      expect(screen.getByText(/Page 2/)).toBeInTheDocument();

      await user.type(screen.getByPlaceholderText('Search all columns...'), 'a');
      expect(screen.getByText(/Page 1/)).toBeInTheDocument();
    });

    it('shows empty state when no matches', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.type(screen.getByPlaceholderText('Search all columns...'), 'xyz123');

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('shows clear filter button in empty state', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.type(screen.getByPlaceholderText('Search all columns...'), 'xyz123');

      expect(screen.getByText('Clear filter')).toBeInTheDocument();
    });

    it('clears filter when clear button is clicked', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.type(screen.getByPlaceholderText('Search all columns...'), 'xyz123');
      await user.click(screen.getByText('Clear filter'));

      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('navigates to next page', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.click(screen.getByText('Next'));

      expect(screen.getByText(/Page 2/)).toBeInTheDocument();
      expect(screen.getByText('Frank')).toBeInTheDocument();
    });

    it('navigates to previous page', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.click(screen.getByText('Next'));
      await user.click(screen.getByText('Previous'));

      expect(screen.getByText(/Page 1/)).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      renderTable();
      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('disables next button on last page', async () => {
      const user = userEvent.setup();
      renderTable();

      // Navigate to last page (12 items, 5 per page = 3 pages)
      await user.click(screen.getByText('Next'));
      await user.click(screen.getByText('Next'));

      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('displays correct item range', () => {
      renderTable();
      expect(screen.getByText(/Showing 1–5 of 12/)).toBeInTheDocument();
    });

    it('changes page size', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.selectOptions(screen.getByLabelText('Rows per page'), '10');

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(11); // Header + 10 data rows
    });

    it('resets to page 1 when page size changes', async () => {
      const user = userEvent.setup();
      renderTable();

      await user.click(screen.getByText('Next'));
      expect(screen.getByText(/Page 2/)).toBeInTheDocument();

      await user.selectOptions(screen.getByLabelText('Rows per page'), '10');
      expect(screen.getByText(/Page 1/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data array', () => {
      renderTable({ data: [] });
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('handles single row of data', () => {
      renderTable({ data: [testData[0]] });
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText(/Showing 1–1 of 1/)).toBeInTheDocument();
    });

    it('handles data equal to page size', () => {
      renderTable({ data: testData.slice(0, 5), pageSize: 5 });
      expect(screen.getByText('Previous')).toBeDisabled();
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('handles column without sortable flag', () => {
      const columnsWithoutSort: Column<TestData>[] = [
        { key: 'name', header: 'Name' }, // No sortable flag
        { key: 'age', header: 'Age', sortable: true },
      ];

      renderTable({ columns: columnsWithoutSort });

      // Name column should not have a sort button
      expect(screen.queryByRole('button', { name: /sort by name/i })).not.toBeInTheDocument();
      // Age column should have a sort button
      expect(screen.getByRole('button', { name: /sort by age/i })).toBeInTheDocument();
    });

    it('handles custom render function', () => {
      const columnsWithRender: Column<TestData>[] = [
        { key: 'name', header: 'Name', sortable: true },
        {
          key: 'age',
          header: 'Age',
          sortable: true,
          render: (value) => `${value} years old`,
        },
      ];

      renderTable({ columns: columnsWithRender });
      expect(screen.getByText('30 years old')).toBeInTheDocument();
    });

    it('adjusts current page when filtered results reduce total pages', async () => {
      const user = userEvent.setup();
      renderTable();

      // Go to page 3
      await user.click(screen.getByText('Next'));
      await user.click(screen.getByText('Next'));
      expect(screen.getByText(/Page 3/)).toBeInTheDocument();

      // Filter to show only 2 results (less than 1 page)
      await user.type(screen.getByPlaceholderText('Search all columns...'), 'Alice');

      // Should be on page 1 since there's only 1 result
      expect(screen.getByText(/Page 1/)).toBeInTheDocument();
    });

    it('maintains sort after filter', async () => {
      const user = userEvent.setup();
      renderTable();

      // Sort by age ascending
      await user.click(screen.getByRole('button', { name: /sort by age/i }));

      // Filter
      await user.type(screen.getByPlaceholderText('Search all columns...'), 'a');

      // First visible row should still be youngest person matching filter
      const tbody = screen.getAllByRole('row').slice(1);
      const ages = tbody.map((row) => within(row).getAllByRole('cell')[1].textContent);

      // Verify ages are sorted ascending
      const numericAges = ages.map(Number);
      const sortedAges = [...numericAges].sort((a, b) => a - b);
      expect(numericAges).toEqual(sortedAges);
    });
  });
});