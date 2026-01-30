/**
 * Email Validation Utility
 * A production-ready email validator using a single regex with pre-checks.
 * 
 * DESIGN DECISIONS:
 * -----------------
 * This validator balances RFC 5321/5322 compliance with practical security.
 * It intentionally restricts some technically-valid-but-rarely-used formats
 * to reduce attack surface and improve reliability.
 * 
 * REGEX BREAKDOWN:
 * ----------------
 * ^                          - Start of string
 * [a-zA-Z0-9]                - Local part must START with alphanumeric
 * (?:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]*[a-zA-Z0-9])?
 *                            - Middle: allowed special chars, must END with alphanumeric
 *                            - This prevents leading/trailing dots/specials
 * (?:\+[a-zA-Z0-9._-]+)?     - Optional plus-addressing tag (+tag)
 * @                          - Literal @ separator
 * (?:[a-zA-Z0-9]             - Domain label starts with alphanumeric
 *   (?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?  - Middle can have hyphens, max 63 chars total
 *   \.                       - Dot separator between labels
 * )+                         - One or more subdomain labels
 * [a-zA-Z]{2,}               - TLD: letters only, minimum 2 chars
 * $                          - End of string
 * 
 * WHAT THIS VALIDATOR INTENTIONALLY DOES NOT SUPPORT:
 * ---------------------------------------------------
 * 1. Quoted local parts ("john doe"@example.com) - Rarely used, parsing complexity
 * 2. Comments ((comment)user@example.com) - Obscure, potential injection vector
 * 3. IP literals (user@[192.168.1.1]) - Uncommon, security concerns
 * 4. Non-ASCII/Unicode (IDN) - Requires punycode conversion, out of scope
 * 5. Whitespace anywhere - Never legitimate in practice, security risk
 * 6. Consecutive dots (user..name@example.com) - RFC violation, often typos
 * 
 * These restrictions align with what major email providers actually accept.
 */

/**
 * Validates an email address against practical RFC standards.
 * @param {unknown} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
  // === PRE-REGEX CHECKS ===
  
  // Type check: must be a string
  if (typeof email !== 'string') {
    return false;
  }

  // Empty string check
  if (email.length === 0) {
    return false;
  }

  // Total length check (RFC 5321: max 254 characters)
  if (email.length > 254) {
    return false;
  }

  // Must contain exactly one @
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return false;
  }

  // Split and validate local part length (RFC 5321: max 64 characters)
  const atIndex = email.indexOf('@');
  const localPart = email.substring(0, atIndex);
  if (localPart.length === 0 || localPart.length > 64) {
    return false;
  }

  // Reject whitespace anywhere
  if (/\s/.test(email)) {
    return false;
  }

  // Reject consecutive dots anywhere
  if (/\.\./.test(email)) {
    return false;
  }

  // Reject quoted strings (starts with quote in local part)
  if (localPart.startsWith('"') || localPart.includes('"')) {
    return false;
  }

  // Reject comments (parentheses)
  if (/[()]/.test(email)) {
    return false;
  }

  // Reject IP literals (domain starts with [)
  const domainPart = email.substring(atIndex + 1);
  if (domainPart.startsWith('[')) {
    return false;
  }

  // === MAIN REGEX VALIDATION ===
  const emailRegex = new RegExp(
    '^' +
    // LOCAL PART
    '[a-zA-Z0-9]' +                              // Must start with alphanumeric
    '(?:' +
      "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*" +       // Allowed special characters
      '[a-zA-Z0-9]' +                            // Must end with alphanumeric
    ')?' +                                       // Middle section is optional (single char local)
    '(?:\\+[a-zA-Z0-9._-]+)?' +                  // Optional plus-addressing
    '@' +
    // DOMAIN PART
    '(?:' +
      '[a-zA-Z0-9]' +                            // Label starts with alphanumeric
      '(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +     // Optional middle (max 63 chars per label)
      '\\.' +                                    // Dot separator
    ')+' +                                       // One or more subdomains
    '[a-zA-Z]{2,}' +                             // TLD: 2+ letters only
    '$'
  );

  return emailRegex.test(email);
}


// === TEST SUITE ===

const testCases = {
  // BASIC VALID - Common, everyday email formats
  basicValid: [
    { email: 'user@example.com', desc: 'Simple valid email' },
    { email: 'john.doe@example.com', desc: 'Dot in local part' },
    { email: 'user123@example.com', desc: 'Numbers in local part' },
    { email: 'USER@EXAMPLE.COM', desc: 'Uppercase characters' },
    { email: 'user@example.co.uk', desc: 'Two-part TLD' },
    { email: 'heathercarminati@gmail.com', desc: 'Example from requirements' },
  ],

  // EDGE VALID - Technically valid but unusual formats
  edgeValid: [
    { email: 'a@b.co', desc: 'Minimum length email' },
    { email: 'user+tag@example.com', desc: 'Plus addressing' },
    { email: 'user+newsletter@example.com', desc: 'Plus with descriptive tag' },
    { email: 'user+tag.subtag@example.com', desc: 'Plus tag with dot' },
    { email: 'user@mail.example.com', desc: 'Single subdomain' },
    { email: 'user@a.b.c.example.com', desc: 'Multiple subdomains' },
    { email: 'user@sub-domain.example.com', desc: 'Hyphen in subdomain' },
    { email: "a!b#c$d%e&f'g*h+i/j=k?l^m_n`o{p|q}r~s@example.com", desc: 'All RFC special chars' },
    { email: 'x@example.museum', desc: 'Long TLD' },
    { email: '1234567890@example.com', desc: 'All numeric local part' },
    { email: 'test.email-with+symbol@example.com', desc: 'Mixed separators' },
    { email: 'ab@cd.ef', desc: 'Two-char components' },
  ],

  // BASIC INVALID - Common mistakes and typos
  basicInvalid: [
    { email: 'heathercarminati.com', desc: 'Missing @ symbol (from requirements)' },
    { email: 'plainaddress', desc: 'No @ or domain' },
    { email: '@example.com', desc: 'Missing local part' },
    { email: 'user@', desc: 'Missing domain' },
    { email: 'user@.com', desc: 'Domain starts with dot' },
    { email: 'user@example', desc: 'Missing TLD' },
    { email: 'user@@example.com', desc: 'Double @ symbol' },
    { email: 'user@example..com', desc: 'Consecutive dots in domain' },
    { email: '.user@example.com', desc: 'Local part starts with dot' },
    { email: 'user.@example.com', desc: 'Local part ends with dot' },
    { email: 'user..name@example.com', desc: 'Consecutive dots in local' },
    { email: 'user @example.com', desc: 'Space in local part' },
    { email: 'user@ example.com', desc: 'Space in domain' },
    { email: '', desc: 'Empty string' },
    { email: 'user@example.c', desc: 'Single char TLD' },
  ],

  // SECURITY-RELATED INVALID - Potentially malicious or injection attempts
  securityInvalid: [
    { email: '"john doe"@example.com', desc: 'Quoted local part' },
    { email: '"user@evil.com"@example.com', desc: 'Quoted with embedded @' },
    { email: 'user(comment)@example.com', desc: 'Comment in local part' },
    { email: 'user@(comment)example.com', desc: 'Comment in domain' },
    { email: 'user@[192.168.1.1]', desc: 'IP literal domain' },
    { email: 'user@[IPv6:2001:db8::1]', desc: 'IPv6 literal domain' },
    { email: 'user\t@example.com', desc: 'Tab character' },
    { email: 'user\n@example.com', desc: 'Newline character' },
    { email: 'user\r@example.com', desc: 'Carriage return' },
    { email: '<script>@example.com', desc: 'HTML injection attempt' },
    { email: 'user@example.com<script>', desc: 'HTML injection in domain' },
    { email: "user'; DROP TABLE users;--@example.com", desc: 'SQL injection attempt' },
    { email: 'user@-example.com', desc: 'Domain starts with hyphen' },
    { email: 'user@example-.com', desc: 'Domain ends with hyphen' },
    { email: null, desc: 'Null input' },
    { email: undefined, desc: 'Undefined input' },
    { email: 123, desc: 'Number input' },
    { email: {}, desc: 'Object input' },
    { email: [], desc: 'Array input' },
    { email: 'a'.repeat(65) + '@example.com', desc: 'Local part exceeds 64 chars' },
    { email: 'user@' + 'a'.repeat(250) + '.com', desc: 'Total exceeds 254 chars' },
    { email: '+user@example.com', desc: 'Starts with plus' },
    { email: 'user+@example.com', desc: 'Plus at end of local' },
    { email: 'user@123.456', desc: 'Numeric TLD' },
  ],
};


// === TEST RUNNER ===

function runTests() {
  let totalPassed = 0;
  let totalFailed = 0;
  const results = [];

  console.log('=' .repeat(70));
  console.log('EMAIL VALIDATOR TEST SUITE');
  console.log('='.repeat(70));

  // Test valid emails (should return true)
  for (const category of ['basicValid', 'edgeValid']) {
    const isValid = true;
    console.log(`\n📧 ${category.toUpperCase()} (expecting: VALID)`);
    console.log('-'.repeat(70));

    for (const { email, desc } of testCases[category]) {
      const result = validateEmail(email);
      const passed = result === isValid;
      const status = passed ? '✅ PASS' : '❌ FAIL';
      
      if (passed) totalPassed++; else totalFailed++;
      
      const displayEmail = typeof email === 'string' 
        ? (email.length > 40 ? email.substring(0, 37) + '...' : email)
        : String(email);
      
      console.log(`${status} | ${displayEmail.padEnd(42)} | ${desc}`);
      
      if (!passed) {
        results.push({ category, email, desc, expected: isValid, got: result });
      }
    }
  }

  // Test invalid emails (should return false)
  for (const category of ['basicInvalid', 'securityInvalid']) {
    const isValid = false;
    console.log(`\n🚫 ${category.toUpperCase()} (expecting: INVALID)`);
    console.log('-'.repeat(70));

    for (const { email, desc } of testCases[category]) {
      const result = validateEmail(email);
      const passed = result === isValid;
      const status = passed ? '✅ PASS' : '❌ FAIL';
      
      if (passed) totalPassed++; else totalFailed++;
      
      const displayEmail = typeof email === 'string' 
        ? (email.length > 40 ? email.substring(0, 37) + '...' : email)
        : String(email);
      
      console.log(`${status} | ${displayEmail.padEnd(42)} | ${desc}`);
      
      if (!passed) {
        results.push({ category, email, desc, expected: isValid, got: result });
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total:  ${totalPassed + totalFailed}`);
  console.log(`Passed: ${totalPassed} ✅`);
  console.log(`Failed: ${totalFailed} ${totalFailed > 0 ? '❌' : ''}`);
  
  if (results.length > 0) {
    console.log('\nFailed tests:');
    results.forEach(r => {
      console.log(`  - [${r.category}] "${r.email}": expected ${r.expected}, got ${r.got}`);
    });
  }
  
  console.log('='.repeat(70));
  
  return { passed: totalPassed, failed: totalFailed };
}

// Run the tests
runTests();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateEmail };
}