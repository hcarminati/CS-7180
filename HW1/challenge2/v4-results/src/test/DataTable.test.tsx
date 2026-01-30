import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../components/DataTable';
import type { Column } from '../types';

interface TestPerson {
  id: number;
  name: string;
  age: number;
  city: string;
}

const testData: TestPerson[] = [
  { id: 1, name: 'Alice', age: 30, city: 'New York' },
  { id: 2, name: 'Bob', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Charlie', age: 35, city: 'Chicago' },
  { id: 4, name: 'Diana', age: 28, city: 'Houston' },
  { id: 5, name: 'Eve', age: 32, city: 'Phoenix' },
  { id: 6, name: 'Frank', age: 29, city: 'Philadelphia' },
  { id: 7, name: 'Grace', age: 27, city: 'San Antonio' },
  { id: 8, name: 'Henry', age: 33, city: 'San Diego' },
  { id: 9, name: 'Iris', age: 26, city: 'Dallas' },
  { id: 10, name: 'Jack', age: 31, city: 'San Jose' },
  { id: 11, name: 'Karen', age: 34, city: 'Austin' },
  { id: 12, name: 'Leo', age: 24, city: 'Jacksonville' },
];

const testColumns: Column<TestPerson>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
  { key: 'city', header: 'City', sortable: true },
];

describe('DataTable Component', () => {
  describe('Rendering', () => {
    it('renders table with correct headers', () => {
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      expect(screen.getByTestId('header-name')).toHaveTextContent('Name');
      expect(screen.getByTestId('header-age')).toHaveTextContent('Age');
      expect(screen.getByTestId('header-city')).toHaveTextContent('City');
    });

    it('renders correct number of rows based on page size', () => {
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      const table = screen.getByTestId('data-table');
      const rows = within(table).getAllByRole('row');
      // Header row + 5 data rows
      expect(rows).toHaveLength(6);
    });

    it('displays empty state when no data', () => {
      render(
        <DataTable data={[]} columns={testColumns} defaultPageSize={5} />
      );

      expect(screen.getByTestId('empty-state')).toHaveTextContent(
        'No data available.'
      );
    });
  });

  describe('Sorting', () => {
    it('sorts by name ascending when header clicked', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.click(screen.getByTestId('header-name'));

      const firstRow = screen.getByTestId('row-1');
      expect(within(firstRow).getByTestId('cell-1-name')).toHaveTextContent(
        'Alice'
      );
    });

    it('sorts by name descending on second click', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.click(screen.getByTestId('header-name'));
      await user.click(screen.getByTestId('header-name'));

      // After descending sort, first visible should be Leo (last alphabetically in first 12)
      const rows = screen.getAllByRole('row').slice(1); // Skip header
      const firstDataCell = within(rows[0]).getAllByRole('cell')[0];
      expect(firstDataCell).toHaveTextContent('Leo');
    });

    it('sorts numbers correctly', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.click(screen.getByTestId('header-age'));

      const rows = screen.getAllByRole('row').slice(1);
      const firstAgeCell = within(rows[0]).getAllByRole('cell')[1];
      expect(firstAgeCell).toHaveTextContent('24'); // Leo is youngest
    });

    it('resets to page 1 when sorting', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      // Go to page 2
      await user.click(screen.getByTestId('page-btn-2'));
      expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 6 to 10');

      // Sort should reset to page 1
      await user.click(screen.getByTestId('header-name'));
      expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 1 to 5');
    });

    it('has correct aria-sort attribute', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      const nameHeader = screen.getByTestId('header-name');
      expect(nameHeader).not.toHaveAttribute('aria-sort');

      await user.click(nameHeader);
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

      await user.click(nameHeader);
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });
  });

  describe('Filtering', () => {
    it('filters data based on search text', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.type(screen.getByTestId('filter-input'), 'alice');

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(1);
      expect(within(rows[0]).getByTestId('cell-1-name')).toHaveTextContent(
        'Alice'
      );
    });

    it('filters case-insensitively', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.type(screen.getByTestId('filter-input'), 'ALICE');

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(1);
    });

    it('filters across all columns', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.type(screen.getByTestId('filter-input'), 'Chicago');

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(1);
      expect(within(rows[0]).getByTestId('cell-3-city')).toHaveTextContent(
        'Chicago'
      );
    });

    it('shows empty state when filter has no matches', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.type(screen.getByTestId('filter-input'), 'xyz123');

      expect(screen.getByTestId('empty-state')).toHaveTextContent(
        'No results match your search criteria.'
      );
    });

    it('resets to page 1 when filtering', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      // Go to page 2
      await user.click(screen.getByTestId('page-btn-2'));
      expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 6 to 10');

      // Filter should reset to page 1
      await user.type(screen.getByTestId('filter-input'), 'a');
      expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 1 to');
    });

    it('displays filter count in page info', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
      );

      await user.type(screen.getByTestId('filter-input'), 'a');

      expect(screen.getByTestId('page-info')).toHaveTextContent(
        'filtered from 12 total'
      );
    });
  });

  describe('Pagination', () => {
    it('shows correct page info', () => {
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      expect(screen.getByTestId('page-info')).toHaveTextContent(
        'Showing 1 to 5 of 12 entries'
      );
    });

    it('navigates to next page', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      await user.click(screen.getByTestId('next-page-btn'));

      expect(screen.getByTestId('page-info')).toHaveTextContent(
        'Showing 6 to 10 of 12 entries'
      );
    });

    it('navigates to previous page', async () => {
      const user = userEvent.setup();
      render(
        <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
      );

      await user.click(screen.getByTestId('page-btn-2'));
      await user.click(screen.getByTestId('prev-page-btn'));

      expect(screen.getByTestId('page-info')).toHaveTextContent(
        'Showing 1 to 5 of 12 entries'
      );
    });

    it('navigates to first page', async () => {
      const user = userEvent.setup();
render(
<DataTable data={testData} columns={testColumns} defaultPageSize={5} />
);
  await user.click(screen.getByTestId('last-page-btn'));
  await user.click(screen.getByTestId('first-page-btn'));

  expect(screen.getByTestId('page-info')).toHaveTextContent(
    'Showing 1 to 5 of 12 entries'
  );
});

it('navigates to last page', async () => {
  const user = userEvent.setup();
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  await user.click(screen.getByTestId('last-page-btn'));

  expect(screen.getByTestId('page-info')).toHaveTextContent(
    'Showing 11 to 12 of 12 entries'
  );
});

it('disables first/prev buttons on first page', () => {
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  expect(screen.getByTestId('first-page-btn')).toBeDisabled();
  expect(screen.getByTestId('prev-page-btn')).toBeDisabled();
});

it('disables next/last buttons on last page', async () => {
  const user = userEvent.setup();
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  await user.click(screen.getByTestId('last-page-btn'));

  expect(screen.getByTestId('next-page-btn')).toBeDisabled();
  expect(screen.getByTestId('last-page-btn')).toBeDisabled();
});

it('changes page size correctly', async () => {
  const user = userEvent.setup();
  render(
    <DataTable
      data={testData}
      columns={testColumns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
    />
  );

  await user.selectOptions(screen.getByTestId('page-size-select'), '10');

  expect(screen.getByTestId('page-info')).toHaveTextContent(
    'Showing 1 to 10 of 12 entries'
  );
});

it('resets to page 1 when page size changes', async () => {
  const user = userEvent.setup();
  render(
    <DataTable
      data={testData}
      columns={testColumns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
    />
  );

  await user.click(screen.getByTestId('page-btn-2'));
  await user.selectOptions(screen.getByTestId('page-size-select'), '10');

  expect(screen.getByTestId('page-info')).toHaveTextContent('Showing 1 to');
});

it('handles clicking specific page numbers', async () => {
  const user = userEvent.setup();
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  await user.click(screen.getByTestId('page-btn-2'));

  expect(screen.getByTestId('page-info')).toHaveTextContent(
    'Showing 6 to 10 of 12 entries'
  );
});
});
describe('Edge Cases', () => {
it('handles empty data array', () => {
render(
<DataTable data={[]} columns={testColumns} defaultPageSize={5} />
);
  expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  expect(screen.getByTestId('page-info')).toHaveTextContent(
    'Showing 0 to 0 of 0 entries'
  );
});

it('handles single item', () => {
  render(
    <DataTable
      data={[testData[0]]}
      columns={testColumns}
      defaultPageSize={5}
    />
  );

  expect(screen.getByTestId('page-info')).toHaveTextContent(
    'Showing 1 to 1 of 1 entries'
  );
  expect(screen.getByTestId('first-page-btn')).toBeDisabled();
  expect(screen.getByTestId('last-page-btn')).toBeDisabled();
});

it('adjusts current page when filter reduces total pages', async () => {
  const user = userEvent.setup();
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  // Go to page 3
  await user.click(screen.getByTestId('last-page-btn'));

  // Filter to only 2 items
  await user.type(screen.getByTestId('filter-input'), 'Alice');

  // Should be on page 1 now
  expect(screen.getByTestId('page-info')).toHaveTextContent(
    'Showing 1 to 1 of 1 entries'
  );
});

it('handles custom render function', () => {
  const columnsWithRender: Column<TestPerson>[] = [
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'age',
      header: 'Age',
      sortable: true,
      render: (value) => `${value} years old`,
    },
    { key: 'city', header: 'City', sortable: true },
  ];

  render(
    <DataTable
      data={testData}
      columns={columnsWithRender}
      defaultPageSize={5}
    />
  );

  expect(screen.getByTestId('cell-1-age')).toHaveTextContent('30 years old');
});

it('supports keyboard navigation for sorting', async () => {
  const user = userEvent.setup();
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={12} />
  );

  const nameHeader = screen.getByTestId('header-name');
  nameHeader.focus();
  await user.keyboard('{Enter}');

  expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
});
});
describe('Accessibility', () => {
it('has proper table role', () => {
render(
<DataTable data={testData} columns={testColumns} defaultPageSize={5} />
);
  expect(screen.getByRole('grid')).toBeInTheDocument();
});

it('has proper aria-label on table', () => {
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  expect(screen.getByRole('grid')).toHaveAttribute(
    'aria-label',
    'Employee data table'
  );
});

it('has proper aria-label on filter input', () => {
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  expect(screen.getByTestId('filter-input')).toHaveAttribute(
    'aria-label',
    'Filter table data'
  );
});

it('has proper aria-current on active page', async () => {
  const user = userEvent.setup();
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  expect(screen.getByTestId('page-btn-1')).toHaveAttribute(
    'aria-current',
    'page'
  );

  await user.click(screen.getByTestId('page-btn-2'));

  expect(screen.getByTestId('page-btn-1')).not.toHaveAttribute('aria-current');
  expect(screen.getByTestId('page-btn-2')).toHaveAttribute(
    'aria-current',
    'page'
  );
});

it('pagination has navigation role', () => {
  render(
    <DataTable data={testData} columns={testColumns} defaultPageSize={5} />
  );

  expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
});
});
});