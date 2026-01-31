Context: [Who is the AI? What expertise does it have?]
- Use "expert software engineer" not "student" for production code
- Specify relevant domains: TypeScript, React, data structures, UI/UX, etc.

Task: [One-sentence summary of what to build]
- Be specific: "Create a production-ready X with Y and Z"
- Include key features upfront

Requirements: [Numbered list of functional specifications]
1. Feature Area 1
   - Explicit behavior (e.g., "GET operations update access time")
   - State transitions (e.g., "Sorting resets pagination to page 1")
   - Expected outcomes (e.g., "Expired entries return undefined")

2. Feature Area 2
   - [Continue pattern]

[Repeat for 3-5 major feature areas]

Steps: [Implementation roadmap]
1. Design data structures with proper types
2. Implement core logic (specify algorithms if needed)
3. Add UI with specific requirements
4. Create test suite
5. Handle edge cases explicitly

[Keep to 5-8 steps maximum]

Constraints:
* Technical stack (React 18, TypeScript, Vite, etc.)
* Performance requirements (O(1) operations, memoization)
* What NOT to use (no external libraries, no separate CSS files)
* Accessibility (semantic HTML, ARIA attributes)
* Browser/environment compatibility

Edge Cases to Handle: [Enumerated list, 8-12 items]
1. Specific scenario (e.g., "Empty string as key")
2. Boundary condition (e.g., "TTL of 0 or negative values")
3. State transitions (e.g., "Setting existing key")
...

[List concrete scenarios, not general statements]

Format/Output Requirements:
- File structure (if multi-file project)
- Output format (artifacts, code blocks, etc.)
- Setup instructions needed? (package.json, README)
- Testing framework and requirements

Provide:
* [Primary deliverable - working artifact/code]
* Architecture explanation covering:
  - [Design decision 1 with "why" question]
  - [Design decision 2 with alternatives considered]
  - [Performance characteristics]
  - [UI/UX rationale if applicable]
* Test suite with at least [N] test cases covering:
  - [Category 1: basic operations]
  - [Category 2: core feature behavior]
  - [Category 3: edge cases]
* [Any additional documentation]

Design Choices to Explain: [Questions to force reasoning]
1. Why [choice A] instead of [choice B]?
2. How do you handle [specific concern]?
3. What tradeoffs did you make for [requirement]?
[4-7 targeted questions]

Success Criteria: [Verifiable checklist if UI/UX involved]
- [Specific, testable outcome]
- [User-facing behavior]
- [Performance benchmark]
- [5-8 checkboxes for major requirements]