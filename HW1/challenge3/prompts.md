# Challenge 3 Prompts

<details>
<summary>v1: (initial prompt)</summary>
<pre>
Context: You are an expert software engineer with deep expertise in TypeScript and data structures.

Task: Create a caching layer with TTL, LRU eviction, and persistence. Generate a working artifact that demonstrates the cache functionality.

Steps:
    1. Create a cache class that stores key-value pairs
    2. Implement TTL (time-to-live) so entries expire after a set time
    3. Implement LRU (least recently used) eviction when cache is full
    4. Add persistence to localStorage or file
    5. Think about common edge cases
    6. Ensure that the cache handles edge cases
    7. Include test cases to ensure the cache works correctly

Constraints:
    * Proper TypeScript types
    * Configurable max size
    * Configurable default TTL

Provide:
    * A working artifact demonstrating the cache with an interactive UI
    * The TypeScript cache implementation
    * A brief explanation of the design choices
    * Test cases (valid and invalid) demonstrating edge cases
</pre>
</details>

[Claude Artifact Link (v1)](https://claude.ai/artifacts/89760641-6fe4-4fc4-9a5c-cd9baf4c79a8)


<details>
<summary>v2: (improvements)</summary>
<pre>
Context: You are an expert software engineer with deep expertise in TypeScript, data structures, and caching systems.

Task: Create a production-ready LRU Cache with TTL (Time-To-Live) and optional persistence. Generate a working artifact with an interactive UI that demonstrates all cache functionality with visual feedback.

Requirements:
    1. LRU Cache Implementation
    - Implement Least Recently Used eviction policy
    - When cache reaches max size, evict the least recently accessed item
    - GET operations should update access time (move to most recent)
    - SET operations on existing keys should update position without duplication

    2. TTL (Time-To-Live) Implementation
    - Support configurable default TTL (in milliseconds)
    - Allow custom TTL per cache entry (overrides default)
    - Entries should auto-expire after TTL elapses
    - Expired entries should be lazily removed on access or proactively cleaned
    - GET on expired entry should return undefined and remove the entry

    3. Persistence Strategy
    - Implement optional localStorage persistence
    - Serialize cache state including expiry times
    - Restore cache on page reload, respecting TTL
    - Handle corrupted/invalid persisted data gracefully

    4. Interactive UI Requirements
    - Display current cache contents with remaining TTL for each entry
    - Show cache size (current/max)
    - Provide controls for SET, GET, DELETE, CLEAR operations
    - Display operation log with timestamps and results (hit/miss/evicted)
    - Visual indicators for cache hits, misses, evictions, and expirations
    - Configuration panel for max size and default TTL
    - Real-time TTL countdown display for each entry

Steps:
    1. Design the LRU Cache class with proper TypeScript generics
    2. Implement Map-based storage for O(1) operations
    3. Add TTL tracking with expiry timestamps
    4. Implement eviction logic (LRU + TTL-based)
    5. Add persistence layer with serialization/deserialization
    6. Build interactive UI with real-time updates
    7. Create comprehensive test suite
    8. Handle all edge cases explicitly

Constraints:
    * Use TypeScript with strict typing (generics for values)
    * Use Map for O(1) get/set operations
    * No external caching libraries (implement from scratch)
    * Persistence must be optional (configurable on/off)
    * TTL in milliseconds (support values from 100ms to hours)
    * Max size must be configurable (minimum 1, practical maximum ~1000)
    * Handle empty keys (reject or handle gracefully)
    * Memory-efficient implementation

Edge Cases to Handle:
    1. Empty string as key
    2. Undefined or null values
    3. TTL of 0 or negative values
    4. Max size of 1
    5. Setting existing key (should update, not duplicate)
    6. Getting expired entry
    7. Cache at capacity with new insertion
    8. Persisting and restoring with some entries expired
    9. Concurrent operations (though single-threaded)
    10. Very large values (test with objects/arrays)

Provide:
    * Complete TypeScript React artifact with interactive UI
    * LRU Cache class implementation with detailed comments
    * Architecture explanation covering:
    - Why Map is used over Object
    - LRU eviction strategy (how you track "least recently used")
    - TTL implementation approach (lazy vs eager cleanup)
    - Persistence serialization strategy
    - Performance characteristics (time/space complexity)
    * Test suite with at least 10 test cases covering:
    - Basic operations (set, get, delete, clear)
    - LRU eviction behavior
    - TTL expiration
    - Custom TTL per entry
    - Persistence and restoration
    - Edge cases (empty keys, max size 1, etc.)
    * Visual test results in the UI showing pass/fail status
</pre>
</details>

[Claude Artifact Link (v2)](https://claude.ai/artifacts/753f0a81-cf2e-4ea6-83fa-48492b098afc)

<details>
<summary>v3: (final prompt)</summary>
<pre>
Context: You are an expert software engineer with deep expertise in TypeScript, data structures, and caching systems. You also have strong UI/UX design skills.

Task: Create a production-ready LRU Cache with TTL (Time-To-Live) and optional persistence. Generate a working artifact with a polished, responsive interactive UI that demonstrates all cache functionality with visual feedback.

Requirements:
    1. LRU Cache Implementation
    - Implement Least Recently Used eviction policy
    - When cache reaches max size, evict the least recently accessed item
    - GET operations should update access time (move to most recent)
    - SET operations on existing keys should update position without duplication

    2. TTL (Time-To-Live) Implementation
    - Support configurable default TTL (in milliseconds)
    - Allow custom TTL per cache entry (overrides default)
    - Entries should auto-expire after TTL elapses
    - Expired entries should be lazily removed on access or proactively cleaned
    - GET on expired entry should return undefined and remove the entry

    3. Persistence Strategy
    - Implement optional localStorage persistence
    - Serialize cache state including expiry times
    - Restore cache on page reload, respecting TTL
    - Handle corrupted/invalid persisted data gracefully

    4. Interactive UI Requirements
    - **CRITICAL: Use a scrollable, responsive layout that prevents content cutoff**
    - Display current cache contents with remaining TTL for each entry
    - Show cache size (current/max)
    - Provide controls for SET, GET, DELETE, CLEAR operations
    - Display operation log with timestamps and results (hit/miss/evicted)
    - Visual indicators for cache hits, misses, evictions, and expirations
    - Configuration panel for max size and default TTL
    - Real-time TTL countdown display for each entry
    - Test results panel that expands/collapses or scrolls independently

    5. UI/UX Layout Requirements
    - Use a multi-column or tabbed layout to maximize space efficiency
    - Make operation log scrollable with fixed height (max 300-400px)
    - Make test results scrollable with fixed height (max 400px)
    - Make cache contents scrollable when it grows large
    - Add "scroll to bottom" for logs when new entries are added
    - Use collapsible sections for test results (expand/collapse)
    - Ensure entire interface fits within viewport without page scroll
    - Add visual hierarchy with proper spacing and grouping
    - Use a sticky header for controls that stays visible

Steps:
    1. Design the LRU Cache class with proper TypeScript generics
    2. Implement Map-based storage for O(1) operations
    3. Add TTL tracking with expiry timestamps
    4. Implement eviction logic (LRU + TTL-based)
    5. Add persistence layer with serialization/deserialization
    6. Build responsive UI with scrollable sections and proper layout
    7. Create comprehensive test suite with collapsible results
    8. Handle all edge cases explicitly
    9. Test UI at different viewport sizes

Constraints:
    * Use TypeScript with strict typing (generics for values)
    * Use Map for O(1) get/set operations
    * No external caching libraries (implement from scratch)
    * Persistence must be optional (configurable on/off)
    * TTL in milliseconds (support values from 100ms to hours)
    * Max size must be configurable (minimum 1, practical maximum ~1000)
    * Handle empty keys (reject or handle gracefully)
    * Memory-efficient implementation
    * **UI must not overflow viewport - use scrollable containers**
    * **All sections must be accessible without page scrolling**

Edge Cases to Handle:
    1. Empty string as key
    2. Undefined or null values
    3. TTL of 0 or negative values
    4. Max size of 1
    5. Setting existing key (should update, not duplicate)
    6. Getting expired entry
    7. Cache at capacity with new insertion
    8. Persisting and restoring with some entries expired
    9. Concurrent operations (though single-threaded)
    10. Very large values (test with objects/arrays)

UI Layout Suggestions:
    * Option A: Two-column layout (operations + cache | log + tests)
    * Option B: Tabbed interface (Operations, Cache, Logs, Tests)
    * Option C: Single column with collapsible accordions
    * Option D: Grid layout with fixed-height scrollable sections

Choose the layout that best prevents content cutoff while maintaining usability.

Provide:
    * Complete TypeScript React artifact with responsive, scrollable UI
    * LRU Cache class implementation with detailed comments
    * Architecture explanation covering:
    - Why Map is used over Object
    - LRU eviction strategy (how you track "least recently used")
    - TTL implementation approach (lazy vs eager cleanup)
    - Persistence serialization strategy
    - Performance characteristics (time/space complexity)
    - UI layout choice and rationale
    * Test suite with at least 10 test cases covering:
    - Basic operations (set, get, delete, clear)
    - LRU eviction behavior
    - TTL expiration
    - Custom TTL per entry
    - Persistence and restoration
    - Edge cases (empty keys, max size 1, etc.)
    * Visual test results in collapsible/scrollable section showing pass/fail status

Design Choices to Explain:
    1. Why use Map instead of plain object?
    2. How do you maintain LRU order efficiently?
    3. Lazy vs eager TTL cleanup - which did you choose and why?
    4. How do you handle the "most recently used" update on GET?
    5. Persistence format - why JSON? Any alternatives considered?
    6. UI layout choice - why did you choose your particular layout pattern?
    7. How did you ensure no content cutoff in the UI?

UI/UX Success Criteria:
✓ All controls accessible without scrolling the page
✓ Test results visible when "Run Tests" is clicked
✓ Operation log doesn't push other content off-screen
✓ Cache contents display grows gracefully with many entries
✓ Layout works on laptop screens (1366x768 minimum)
✓ Clear visual separation between sections
✓ Professional, clean design aesthetic
</pre>
</details>

[Claude Artifact Link (v3)](https://claude.ai/artifacts/f5c8bf68-a411-49c8-98b9-a67ae42295d4)

# Reflection
In prompt v1, the instruction focused on implementing LRU eviction, TTL expiration, and persistence but left critical behavioral details unspecified. For example, it said "implement LRU" without clarifying that GET operations should update access order, and "add TTL" without specifying lazy vs eager cleanup strategies. It generated a working cache implementation, but the design choices were implicit rather than deliberate.

In prompt v2, I eliminated ambiguity by adding explicit behavioral specifications. Instead of saying "think about common edge cases," I enumerated 10 specific scenarios (empty keys, TTL=0, max size of 1, etc.). I clarified that GET operations must move items to "most recently used," specified O(1) performance requirements, and required explanations for architectural decisions like Map vs Object and serialization strategies. These constraints transformed the task from "build a cache" to "engineer a cache with intentional tradeoffs."

In prompt v3, I addressed a critical UX issue discovered through actual usage: clicking "Run Tests" caused results to overflow the viewport and the UI get cut off. I made scrollable layouts a CRITICAL requirement, specified fixed heights for scrollable sections (max 400px), offered multiple layout pattern options, and added a UI/UX success criteria checklist. This shift from functional correctness (v2) to interaction design (v3) reflects real-world usage revealing requirements that pure specification misses.

I used a different approach for this third challenge. I fed Claude my previous prompts as an example and asked Claude itself to iterate on the challenge 3 designs. After generating v2, I asked Claude to "write me a new prompt" and later requested "give me the second improved version of the first prompt." This meta-prompting approach, using an LLM to refine prompts for LLMs,accelerated the iteration cycle. Claude identified gaps in my v1 prompt, suggested structured improvements (enumerated edge cases, UI requirements, success criteria), and even flagged the UI overflow issue when I shared a screenshot. This collaborative refinement demonstrates that LLMs can be effective tools for prompt engineering itself, not just execution.

Comparing all three versions, v1 produced functional code, v2 produced well-architected code with clear design reasoning, and v3 produced production-ready code with polished UX. The progression demonstrates that effective prompts must address correctness, architecture, and user experience—and that testing the output reveals hidden requirements that should be codified in the next iteration.