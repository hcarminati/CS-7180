# Challenge 1 Prompts

## v1: (initial prompt)
    You are a Graduate Computer Science major with deep expertise in JavaScript. You are taking a computer science class and are tasked with your first homework assignment.
    Your first task is to create a function with regex that validates email addresses. 
    Task Description: Create an email validation function with a regex that validates email addresses. Make sure to handle common edge cases, like plus addressing and subdomains. Include test cases that validate if the function works correctly and that all edge cases are caught. 
    Examples:
    1. heathercarminati.com = invalid (missing @)
    2. heathercarminati@gmail.com = valid 
    Constraints: 
    * Follow common real-world email validation rules 
    * ASCII emails only
    * Support subdomains (e.g. user@mail.example.com)
    Steps:
    1. Create a function that validates email addresses 
    2. Think about common edge cases 
    3. Ensure that the function handles edge cases 
    4. Include test cases to ensure that functions handle edge cases 
    Provide: 
    * The JavaScript email validation function 
    * A brief explanation of the regex 
    * Test cases (valid and invalid) demonstrating edge cases

[Generated Code (v1)](v1-results.js)

## v2: (final prompt)
    Context: You are an expert software engineer with deep expertise in JavaScript. You are tasked with creating a production-ready JavaScript email validation utility usign a single regular expression and minimal additional logic.
    Task: Create an email validation function with a regex that validates email addresses. Make sure to handle common edge cases, like plus addressing and subdomains. 
    Steps:
    1. Create a function that validates email addresses 
    2. Think about common edge cases 
    3. Ensure that the function handles edge cases 
    4. Include test cases to ensure that functions handle edge cases
    Format: A functional component with proper a clearly named function: validateEmail(email: unknown): boolean 
    Constraints: 
    * ASCII emails only
    * Support plus addressing (user+tag@domain.com)
    * Support multiple subdomains (e.g. user@mail.example.com)
    * Reject qouted locals, comments, IP literals, and whitespaces
    * Enforce length limits (local <= 64 characters, total <= 254 characters>)
    * Keep the regex readable and commented 
    * Add checks before regex evaluation
    * Provide categorized test cases (basic valid, edge valid, basic invalid, security-related invalid)
    * Include a small test runner that prints pass/fail results
    * A concise explanation of the regex design decisions
    * A short note explaining what this validator intentionally does not support and why
    Examples:
    1. heathercarminati.com = invalid (missing @)
    2. heathercarminati@gmail.com = valid  
    Provide: 
    * The JavaScript email validation function 
    * A brief explanation of the regex 
    * Test cases (valid and invalid) demonstrating edge cases

[Generated Code (v2)](v2-results.js)

# Reflection
In prompt v1, the instruction focused on correctness and edge-case handling but left out design decisions (e.g., which technically valid email formats should be intentionally excluded). It generated a functionally correct solution, but it lacked clear reasoning for why certain emails were rejected. And, because I had Claude role-play as a student, it returned a simpler 

In prompt v2, I narrowed the scope and explicitly defined more constraints. For example, instead of generally telling it to "follow common real-world email validation rules," I provided explicit constraints on what it shouldn't support (e.g., "Reject quoted locals, comments, IP literals, and whitespaces"). These changes reduced ambiguity and guided the model towards a better implementation. 

Comparing both results, v2 prompt output has better structure, clearer separation of validation concerns (pre-checks versus regex validation), and more intentional design decisions. The test suite became more comprehensive and organized, and the explanation demonstrated awareness of real-world email validation practices.