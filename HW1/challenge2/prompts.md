# Challenge 2 Prompts

<details>
<summary>v1: (initial prompt)</summary>
<pre>
Context: You are an expert front-end engineer with deep expertise in React.
Task: Create a production-ready sortable/filterable data table React component with pagination.
Steps:
1. Create a React component with click to sort columns
2. Enable filtering by text input 
3. Enable pagination with configurable page size
4. Think about common edge cases 
3. Ensure that the function handles edge cases 
4. Include test cases to ensure that component acts the way it should
Constraints: 
* Proper TypeScript types
* Pull data from a random kaggle dataset
Provide: 
* The TypeScript React artifact
* A brief explanation of the design choice 
* Test cases (valid and invalid) demonstrating edge cases</pre>
</details>


<details>
<summary>v2: (improvements)</summary>
<pre>
Context: You are an senior front-end engineer with deep expertise in React and TypeScript. You are tasked with building a production-quality, reusable data table component.

Task: Create a sortable, filterable, paginated data table as a React and TypeScript component. The component should be designed for real-world use, with clear state management, predictable behavior, and testable logic.

Funtional Requirements: 
    1. Sorting
    - Clicking a column header toggles ascending/descending order
    - Only one column can be actively sorted at a time
    - Sorting must be stable
    - Sorting resets pagination to page 1
    2. Filtering
    - A text input filters rows by partial match
    - Filtering is case-insensitive
    - Filtering applies across all visible columns
    - Filtering is applied before pagination
    - Filtering resets pagination to page 1
    3. Pagination
    - Configurable page size (e.g., 5, 10, 20)
    - Page navigation controls (next, previous)
    - Correct handling of empty states (no results after filtering)
    4. Data
    - Use an inline mock dataset (do not fetch from external sources)
    - Define a clear TypeScript interface for row data
    Constraints:
    - React + TypeScript only
    - Functional components with hooks
    - No external table libraries 
    - Use memoization where appropriate (useMemo, useCallback)
    - Clean separation of concerns (sorting, filtering, pagination logic)
    - Accessible markup (semantic table elements)
    Testing Requirements:
    - Use React Testing Library
    - Include tests for:
        - Sorting behavior
        - Filtering behavior
        - Pagination behavior
        - Edge cases (empty data, no filter matches, page size changes)
    - Tests should simulate real user interactions
Provide:
    - The TypeScript React component
    - A brief explanation of architectural and design decisions
    - The mock dataset and type definitions
    - Test cases demonstrating correct behavior and edge-case handling
</pre>
</details>

[Generated Code (v2)](/HW1/challenge2/v2-results/)

<details>
<summary>v3: (final prompt)</summary>
<pre>Context: You are an senior front-end engineer with deep expertise in React and TypeScript. You are tasked with building a production-quality, reusable data table component.

Task: Generate a complete, IDE-ready implementation AND create a working React artifact that demonstrates the component.

Funtional Requirements: 
    1. Sorting
    - Clicking a column header toggles ascending/descending order
    - Only one column can be actively sorted at a time
    - Sorting must be stable
    - Sorting resets pagination to page 1
    2. Filtering
    - A text input filters rows by partial match
    - Filtering is case-insensitive
    - Filtering applies across all visible columns
    - Filtering is applied before pagination
    - Filtering resets pagination to page 1
    3. Pagination
    - Configurable page size (e.g., 5, 10, 20)
    - Page navigation controls (next, previous)
    - Correct handling of empty states (no results after filtering)
    4. Data
    - Use an inline mock dataset (do not fetch from external sources)
    - Define a clear TypeScript interface for row data
    Constraints:
    - React + TypeScript only
    - Functional components with hooks
    - No external table libraries 
    - Use memoization where appropriate (useMemo, useCallback)
    - Clean separation of concerns (sorting, filtering, pagination logic)
    - Accessible markup (semantic table elements)
    Format:
    Generate these 5 files. Output each file exactly as:
    --- filename.ext ---
    <complete file content>

Files to generate:
    1. types.ts – TypeScript interfaces (Employee, Column, SortConfig, etc.)
    2. mockData.ts – Mock employee dataset (12+ rows)
    3. DataTable.tsx – The reusable component with hooks
    4. DataTable.test.tsx – React Testing Library tests (sorting, filtering, pagination, edge cases)
    5. App.tsx – Example usage

Testing Requirements:
    - Use React Testing Library
    - Include tests for:
        - Sorting behavior
        - Filtering behavior
        - Pagination behavior
        - Edge cases (empty data, no filter matches, page size changes)
    - Tests should simulate real user interactions

Provide:
    - Build a fully working, interactive DataTable component as a React artifact that I can preview and interact with directly.
    - Output the 5 files for IDE copy-paste
    - Do NOT include explanations outside the code files. Ensure all imports reference the correct relative paths.
</pre>
</details>

[Generated Code (v3)](/HW1/challenge2/v3-results/)
    
---
After generating code from v3, I encountered significant issues when importing the files into my IDE:
- **339 TypeScript errors** due to missing dependencies and configuration
- **CSS class references** with no corresponding stylesheets
- **Test files** that required Jest setup not specified in the project
- **No `package.json`** or build configuration

The generated code was *architecturally correct* but *not runnable*. I used Claude to help me craft a v4 prompt that explicitly requires a complete, runnable project structure. This demonstrates an important prompt engineering lesson: **specifying code quality is not the same as specifying project runnability.**

<details>
<summary>v4: (production-ready with setup instructions)</summary>
<pre>
Context: You are a senior front-end engineer with deep expertise in React and TypeScript. You are tasked with building a production-quality, reusable data table component that can be immediately run in any IDE.

Task: Generate a complete, runnable React + TypeScript project with explicit setup instructions. The project should work out-of-the-box after following the setup steps.

Functional Requirements: 
    1. Sorting
    - Clicking a column header toggles ascending/descending order
    - Only one column can be actively sorted at a time
    - Sorting must be stable
    - Sorting resets pagination to page 1
    2. Filtering
    - A text input filters rows by partial match
    - Filtering is case-insensitive
    - Filtering applies across all visible columns
    - Filtering is applied before pagination
    - Filtering resets pagination to page 1
    3. Pagination
    - Configurable page size (e.g., 5, 10, 20)
    - Page navigation controls (first, previous, next, last)
    - Correct handling of empty states (no results after filtering)
    4. Data
    - Use an inline mock dataset (do not fetch from external sources)
    - Define a clear TypeScript interface for row data

Technical Constraints:
    - React 18 + TypeScript
    - Vite as the build tool (fast, simple setup)
    - Functional components with hooks
    - No external table libraries
    - Use useMemo/useCallback for memoization
    - Use inline styles OR Tailwind (no separate CSS files that need configuration)
    - Accessible markup (semantic table elements, ARIA attributes)

Project Structure:
Generate a complete project with this exact structure:
```
datatable-project/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   └── DataTable.tsx
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   └── mockData.ts
│   └── __tests__/
│       └── DataTable.test.tsx
└── README.md
```

Output Format:
For EACH file, output in this exact format:

--- path/to/filename.ext ---
```
<complete file content>
```

README.md Must Include:
    1. Project description
    2. Prerequisites (Node.js version, npm/yarn)
    3. Step-by-step setup instructions:
    ```bash
        # Clone or create folder
        # Install dependencies
        # Run development server
        # Run tests
    ```
    4. Available scripts explanation
    5. Project structure overview

Package.json Must Include:
    - All necessary dependencies with exact versions
    - Scripts for: dev, build, test, preview
    - Proper TypeScript and Vite configuration

Testing Requirements:
    - Use Vitest (works seamlessly with Vite)
    - Use @testing-library/react
    - Include tests for sorting, filtering, pagination, edge cases
    - Tests should run with `npm test`

Final Checklist (ensure all are true):
✅ Running `npm install` installs all dependencies without errors
✅ Running `npm run dev` starts the development server
✅ Running `npm test` executes all tests
✅ No CSS files required (use inline styles or Tailwind CDN)
✅ No additional configuration needed beyond what's in the files
✅ Works on Node.js 18+

Also Provide:
    - A working React artifact demonstrating the DataTable component
    - All project files formatted for direct copy-paste

Do NOT include explanations outside the code files and README. Every file should be complete and ready to use.</pre>
</details>

[Generated Code (v4)](/HW1/challenge2/v4-results/)

<br>

# Reflection
Prompt v1 focused on basic features (sort, filter, paginate) with minimal constraints. Left too many decisions to the model, including vague terms like "production-ready" and a request to pull data from Kaggle, which introduced unnecessary complexity.

Prompt v2 transformed the prompt into a detailed specification with explicit behavioral rules for sorting (stable, single-column, resets pagination), filtering (case-insensitive, applies before pagination), and pagination (configurable size, empty state handling). Added technical constraints including TypeScript types, memoization, and accessibility requirements.

Prompt v3 kept v2's behavioral specifications but added explicit file output formatting. Requested 5 separate files (types.ts, mockData.ts, DataTable.tsx, DataTable.test.tsx, App.tsx) with a specific format for easy copy-paste into an IDE.

Prompt v4 after v3 generated architecturally correct but non-runnable code (339 TypeScript errors, missing dependencies, no build configuration), I used Claude to help craft a comprehensive prompt requiring a complete project structure including package.json, vite.config.ts, tsconfig.json, index.html, and a README with setup instructions. Specified Vite as the build tool and Vitest for testing to ensure seamless integration.

Even after crafting the v4 prompt, the generated project required additional manual fixes before it would fully build and run:
- Unused imports causing build failures: TypeScript's strict mode flagged SortDirection, beforeEach, and fireEvent as unused imports, causing npm run build to fail. These had to be manually removed from DataTable.tsx and DataTable.test.tsx.
- Missing index.html: The initial output didn't include the index.html file in the correct location, causing Vite to fail with "Could not resolve entry module" error. The file had to be manually created at the project root.

This demonstrates that even well-crafted prompts may not produce 100% error-free output. Prompt engineering is iterative not just at the prompt level, but also at the output validation level. The ability to diagnose and fix generated code is as important as writing good prompts.