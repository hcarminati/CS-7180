import React from 'react';
import { DataTable } from './DataTable';
import { mockEmployees, employeeColumns } from './mockData';
import './styles.css';

function App(): React.ReactElement {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Directory</h1>
        <p>Interactive data table with sorting, filtering, and pagination</p>
      </header>

      <main className="app-main">
        <DataTable
          data={mockEmployees}
          columns={employeeColumns}
          pageSize={5}
          pageSizeOptions={[5, 10, 20]}
        />
      </main>

      <footer className="app-footer">
        <div className="usage-tips">
          <h2>Usage Tips</h2>
          <ul>
            <li>Click column headers to sort (ascending/descending)</li>
            <li>Type in the search box to filter across all columns</li>
            <li>Use pagination controls to navigate between pages</li>
            <li>Change rows per page using the dropdown</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;