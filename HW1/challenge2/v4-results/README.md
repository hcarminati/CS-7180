# DataTable Component

A production-quality, reusable React + TypeScript data table component with sorting, filtering, and pagination capabilities.

## Features

- **Sorting**: Click column headers to sort ascending/descending
- **Filtering**: Case-insensitive search across all columns
- **Pagination**: Configurable page sizes with full navigation controls
- **Accessible**: Semantic HTML with ARIA attributes
- **Type-safe**: Full TypeScript support with generics
- **Zero dependencies**: No external table libraries required

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn 1.22+)

## Setup Instructions
```bash
# 1. Create the project directory
mkdir datatable-project
cd datatable-project

# 2. Copy all project files to their respective locations
# (Follow the project structure below)

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Run tests
npm test

# 6. Build for production
npm run build

# 7. Preview production build
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server at http://localhost:5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure
```
datatable-project/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
├── index.html            # HTML entry point
├── src/
│   ├── main.tsx          # React entry point
│   ├── App.tsx           # Main application component
│   ├── components/
│   │   └── DataTable.tsx # Reusable DataTable component
│   ├── types/
│   │   └── index.ts      # TypeScript interfaces
│   ├── data/
│   │   └── mockData.ts   # Sample dataset
│   └── __tests__/
│       └── DataTable.test.tsx # Component tests
└── README.md
```

## Usage
```tsx
import { DataTable } from './components/DataTable';
import { mockData, columns } from './data/mockData';

function App() {
  return (
    <DataTable
      data={mockData}
      columns={columns}
      pageSizeOptions={[5, 10, 20]}
      defaultPageSize={10}
    />
  );
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of data objects |
| `columns` | `Column<T>[]` | required | Column configuration |
| `pageSizeOptions` | `number[]` | `[5, 10, 20]` | Available page sizes |
| `defaultPageSize` | `number` | `10` | Initial page size |

## Column Configuration
```tsx
interface Column<T> {
  key: keyof T;           // Property name in data object
  header: string;         // Display name in header
  sortable?: boolean;     // Enable sorting (default: false)
  render?: (value, row) => ReactNode; // Custom cell renderer
}
```

## License

MIT