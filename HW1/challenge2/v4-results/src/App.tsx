import { DataTable } from './components/DataTable';
import { mockData, columns } from './data/mockData';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6',
      padding: '32px 16px'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
      }}>
        <DataTable
          data={mockData}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          defaultPageSize={10}
        />
      </div>
    </div>
  );
}

export default App;