/**
 * Validates an email address using regex
 * Supports: plus addressing, subdomains, common TLDs, ASCII only
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  
  // Additional constraints
  if (email.length > 254) return false; // Max email length per RFC 5321
  
  const [local, domain] = email.split('@');
  if (!local || !domain) return false;
  if (local.length > 64) return false; // Max local part length
  if (local.includes('..')) return false; // No consecutive dots
  
  return emailRegex.test(email);
}

// ============== TEST SUITE ==============

const testCases = [
  // VALID EMAILS
  { email: "user@example.com", expected: true, desc: "Basic valid email" },
  { email: "heathercarminati@gmail.com", expected: true, desc: "Standard gmail" },
  { email: "user.name@example.com", expected: true, desc: "Dot in local part" },
  { email: "user+tag@example.com", expected: true, desc: "Plus addressing" },
  { email: "user+newsletter@gmail.com", expected: true, desc: "Gmail plus addressing" },
  { email: "user@mail.example.com", expected: true, desc: "Subdomain" },
  { email: "user@sub.domain.example.com", expected: true, desc: "Multiple subdomains" },
  { email: "user_name@example.com", expected: true, desc: "Underscore in local" },
  { email: "user-name@example.com", expected: true, desc: "Hyphen in local" },
  { email: "user123@example.com", expected: true, desc: "Numbers in local" },
  { email: "123user@example.com", expected: true, desc: "Starting with number" },
  { email: "user@example-site.com", expected: true, desc: "Hyphen in domain" },
  { email: "user@123.example.com", expected: true, desc: "Numeric subdomain" },
  { email: "a@b.co", expected: true, desc: "Minimal valid email" },
  { email: "user%tag@example.com", expected: true, desc: "Percent in local" },
  { email: "USER@EXAMPLE.COM", expected: true, desc: "Uppercase email" },
  { email: "MixedCase@Example.Com", expected: true, desc: "Mixed case" },
  { email: "user@example.museum", expected: true, desc: "Long TLD" },
  { email: "user@example.co.uk", expected: true, desc: "Country code TLD" },
  
  // INVALID EMAILS
  { email: "heathercarminati.com", expected: false, desc: "Missing @ symbol" },
  { email: "plainaddress", expected: false, desc: "No @ or domain" },
  { email: "@example.com", expected: false, desc: "Missing local part" },
  { email: "user@", expected: false, desc: "Missing domain" },
  { email: "user@.com", expected: false, desc: "Domain starts with dot" },
  { email: "user@example.", expected: false, desc: "Domain ends with dot" },
  { email: "user@example", expected: false, desc: "Missing TLD" },
  { email: "user@example.c", expected: false, desc: "TLD too short" },
  { email: ".user@example.com", expected: false, desc: "Local starts with dot" },
  { email: "user.@example.com", expected: false, desc: "Local ends with dot" },
  { email: "user..name@example.com", expected: false, desc: "Consecutive dots" },
  { email: "user@example..com", expected: false, desc: "Consecutive dots in domain" },
  { email: "user name@example.com", expected: false, desc: "Space in local" },
  { email: "user@exam ple.com", expected: false, desc: "Space in domain" },
  { email: "user@@example.com", expected: false, desc: "Double @ symbol" },
  { email: "user@-example.com", expected: false, desc: "Domain starts with hyphen" },
  { email: "user@example-.com", expected: false, desc: "Domain ends with hyphen" },
  { email: "", expected: false, desc: "Empty string" },
  { email: null, expected: false, desc: "Null input" },
  { email: undefined, expected: false, desc: "Undefined input" },
  { email: 12345, expected: false, desc: "Number input" },
  { email: "user<script>@example.com", expected: false, desc: "Script injection attempt" },
  { email: "user@example.com\n", expected: false, desc: "Newline character" },
  { email: " user@example.com", expected: false, desc: "Leading space" },
  { email: "user@example.com ", expected: false, desc: "Trailing space" },
  { email: "user(comment)@example.com", expected: false, desc: "Parentheses" },
  { email: "user@[127.0.0.1]", expected: false, desc: "IP address (not supported)" },
  { email: '"user name"@example.com', expected: false, desc: "Quoted local (not supported)" },
];

// Run tests
console.log("=== EMAIL VALIDATION TEST RESULTS ===\n");

let passed = 0, failed = 0;

testCases.forEach(({ email, expected, desc }) => {
  const result = validateEmail(email);
  const status = result === expected ? "✓ PASS" : "✗ FAIL";
  
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.log(`${status}: "${email}"`);
    console.log(`  Description: ${desc}`);
    console.log(`  Expected: ${expected}, Got: ${result}\n`);
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Passed: ${passed}/${testCases.length}`);
console.log(`Failed: ${failed}/${testCases.length}`);
console.log(`Success Rate: ${((passed/testCases.length)*100).toFixed(1)}%`);