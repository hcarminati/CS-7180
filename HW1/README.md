# HW1: Prompt Engineering Battle

This repository contains my submission for **HW1: Prompt Engineering Battle**.  
The goal of this assignment is to explore how prompt design impacts code quality through iteration, experimentation, and reflection.

## Challenges

### Challenge 1
- **Description:** Create a JavaScript email validator.
- **Prompts:** [prompts.md](challenge1/prompts.md)

### Challenge 2: Sortable Data Table
- **Description:** Create a React component with sortable columns, text filtering, configurable pagination, proper TypeScript types.
- **Prompts:** [prompts.md](challenge2/prompts.md)

### Challenge 3: LRU Cache with TTL
- **Description:** Build an LRU cache with time-to-live expiration, optional localStorage persistence.
- **Prompts:** [prompts.md](challenge3/prompts.md)

## Reflection - What Makes a Great Prompt?
A great prompt provides clear intention and execution. It makes vague ideas into precise specifications while leaving room for AI decision-making if necessary. By going though these three challenges, I learned that prompts share five essential qualities, specificity, structure, testability, iteration, and intentionality. Specificity eliminates interpation gaps where you could risk the LLM creating something you did not want it to. My first prompts worked but were not specific enough and were open to more than one interpretation. I told the LLM what it should generally do but did not give it implementation details. A good prompt does not genralize. For example, instead of jsut saying "handle edge cases," you should list them. Or, instead of "follow real-world email validation rules," specify exactly what to reject (e.g. quoted locals, IP literals, comments, whitespace). Each enumerated constraint is a bug prevented before code is written.

Building off of that, testability forces completeness. Requiring test cases isn't just about making sure the LLM validates that its own code functionally works, it's also about testing that it follows prompt specifications. When I asked for "10 test cases covering basic operations, LRU eviction, TTL expiration, and edge cases," it forced the LLM to think through scenarios I hadn't explicitly stated. Tests are another layer added that makes sure the code not only runs but also follows what was asked. 

Structure improves output and reduces our personal cognitive loads. Like we learned in class, the best prompts follow a consistent architecture, context, task, format, constraints, and examples. When I added "UI/UX Success Criteria" checklists with verifiable outcomes, the quality of generated UIs improved dramatically because the model had clearer goals. Also, having a common structure to our prompts enables us to more easily write, revise, and scale, while also helping the model produce more predictable results. 

Iteration reveals hidden requirements. My v1 prompts generated functional code. My v2 prompts generated well-architected code. But only after actually using the artifacts did I discover critical flaws, like UI overflowing the viewport when clicked. This taught me you cannot specify what you haven't experienced. Great prompts need a feedback loop. Test the output, discover failures, update the specification and iterate.

Lastly, be intentional! The best prompts constrain problems without dictating solutions. When the LRU cache UI needed scrollability, I didn't say "use CSS overflow: auto on div with ID #results." Specify the constraint ("test results must be visible without page scrolling") and offer options (tabs, accordions, columns, grid). Let the LLM think of a better result. If you give it a solution it will take it and won't validate if what you suggested is correct or if there is a better way to do something. Great prompts say "prevent content cutoff" not "set max-height to 400px." Being this specific only works if it is suggested as an example and not as the solution.

I enjoyed experimenting with challenges by at first writing my own prompt and then using the LLM as a meta-prompting tool for the last challenge. By asking Claude to "write me an improved version of this prompt" or "give me a v3 that fixes the UI cutoff," I accelerated iteration. The model identified gaps I'd missed, suggested structured improvements, and even diagnosed bugs from screenshots. Great prompts aren't just instructions for models, they're collaborations with them.

## Personal Prompt Template 
[Personal Prompt Template](personal-prompt-template.md)


