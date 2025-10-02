// Helper function to simulate Python's btoa for ASCII
const b64encode = (str: string): string => {
    try {
        return btoa(str);
    } catch (e) {
        console.error("Failed to base64 encode:", str, e);
        return "";
    }
};

const encodedWord = (charset: string, encoding: string, encodedText: string): string => {
  return `=?${charset}?${encoding}?${encodedText}?=`;
};

// Simplified Punycode/IDNA encoding based on the examples in the script.
// A full IDNA implementation is complex and out of scope.
const punycode = (domain: string): string => {
    const map: { [key: string]: string } = {
        "exämple": "xn--exmple-cua",
        "例子": "xn--fsqu00a",
        "пример": "xn--e1afmkfd",
        "münchen": "xn--mnchen-3ya"
    };
    return map[domain] || domain; // Return punycode if found, otherwise original
};

const unicodeOverflow = (char: string): string[] => {
    const overflows: string[] = [];
    const bases = [0x100, 0x1000, 0x10000, 0x10ffff]; 
    for (const base of bases) {
        const codepoint = base + char.charCodeAt(0);
        try {
            if (codepoint <= 0x10FFFF) {
                overflows.push(String.fromCodePoint(codepoint));
            }
        } catch (e) {
            // Ignore range errors for invalid code points
        }
    }
    return overflows;
};

// Simple RFC 5322 email regex for basic validation (can swap for more complete validator)
const rfcEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isValidEmail = (email: string): boolean => {
  // Basic check against regex, can expand with full RFC validation libs as needed
  // Strip out comments and whitespace before testing as needed
  const cleaned = email.replace(/\s+/g, '').replace(/\(.*?\)/g, '');
  return rfcEmailRegex.test(cleaned);
};

export const generateEmailVariants = (
  collaborator: string, 
  targetDomain: string
): string[] => {
  const variants: string[] = [];
  const effectiveTarget = targetDomain || 'example.com';

  // --- RFC-compliant basics & common valid cases ---
  variants.push(
    `user@${collaborator}`,
    `u.ser@${collaborator}`,
    `user+tag@${collaborator}`,
    `user_name@${collaborator}`,
    `user-name@${collaborator}`,
    `"user"@${collaborator}`,
    `"user.name"@${collaborator}`,
    `user@${collaborator}`.toUpperCase(),
    `user@[127.0.0.1]`,
    `user@[IPv6:2001:db8::1]`,
    `user@localhost`,
    `user@subdomain.${collaborator}`
  );

  // --- Quoted local parts with valid escaping ---
  variants.push(
    `"user\\@name"@${collaborator}`,
    `"user\\"name"@${collaborator}`,
    `"user name"@${collaborator}`,
    `"user.test"@${collaborator}`,
    `"user@test"@${collaborator}`,
    `" "@${collaborator}`, // space in quoted local part
    `"test\\\\user"@${collaborator}` // escaped backslash
  );

  // --- Comments (RFC 5322 allows comments) ---
  variants.push(
    `user(comment)@${collaborator}`,
    `(foo)user@(bar)${collaborator}`,
    `user@(comment)${collaborator}`,
    `user(work)@${collaborator}`,
    `user@${collaborator}(office)`,
    `(comment)user(comment)@(comment)${collaborator}(comment)`
  );

  // --- RFC 2047 Encoded-word variants (email headers) ---
  variants.push(
    encodedWord("UTF-8", "B", b64encode("user")) + `@${collaborator}`,
    encodedWord("UTF-8", "Q", "user") + `@${collaborator}`,
    encodedWord("UTF-8", "B", b64encode("test")) + `@${collaborator}`,
    encodedWord("UTF-8", "Q", "test=user") + `@${collaborator}`,
    encodedWord("ISO-8859-1", "Q", "user") + `@${collaborator}`,
    encodedWord("UTF-7", "B", b64encode("UserName")) + `@${collaborator}`
  );

  // --- Unicode/Punycode internationalized domains ---
  const unicodeDomains = ["exämple", "例子", "пример", "münchen"];
  for (const dom of unicodeDomains) {
    variants.push(`user@${dom}.${collaborator}`);
    variants.push(`user@${punycode(dom)}.${collaborator}`);
  }

  // --- Valid Punycode/IDN edge cases ---
  variants.push(
    `user@xn--fsq.${collaborator}`, // short punycode
    `user@xn--e1afmkfd.${collaborator}`, // Russian punycode
    `user@xn--fsqu00a.${collaborator}`, // Chinese punycode
    `user@xn--mnchen-3ya.${collaborator}`, // German punycode
    `user@xn--exmple-cua.${collaborator}` // ä character punycode
  );

  // --- Source routes and percent hack (legacy but valid) ---
  variants.push(
    `user%${collaborator}@${effectiveTarget}`,
    `user%${effectiveTarget}@${collaborator}`,
    `"user%${collaborator}"@${effectiveTarget}`,
    `user@${collaborator}`,
    `${effectiveTarget}!user@${collaborator}`, // UUCP style
    `user!${collaborator}@${effectiveTarget}` // UUCP style
  );

  // --- Domain variations and subdomain tests ---
  variants.push(
    `user@mail.${collaborator}`,
    `user@mx.${collaborator}`,
    `user@smtp.${collaborator}`,
    `user@${collaborator}.localdomain`,
    `user@${collaborator}.local`,
    `user@test.${collaborator}`,
    `user@dev.${collaborator}`
  );

  // --- Case sensitivity tests ---
  variants.push(
    `User@${collaborator}`,
    `USER@${collaborator}`,
    `UsEr@${collaborator}`,
    `user@${collaborator.toUpperCase()}`,
    `user@${collaborator.toLowerCase()}`,
    `"User"@${collaborator}`,
    `"USER"@${collaborator}`
  );

  // --- Extended ASCII and special characters in local part ---
  variants.push(
    `user+test@${collaborator}`,
    `user-test@${collaborator}`,
    `user_test@${collaborator}`,
    `user.test@${collaborator}`,
    `test.user@${collaborator}`,
    `user123@${collaborator}`,
    `123user@${collaborator}`,
    `user+123@${collaborator}`,
    `user-123@${collaborator}`,
    `user_123@${collaborator}`,
    `user.123@${collaborator}`
  );

  // --- Valid special characters in local part ---
  variants.push(
    `!user@${collaborator}`,
    `#user@${collaborator}`,
    `$user@${collaborator}`,
    `%user@${collaborator}`,
    `&user@${collaborator}`,
    `'user@${collaborator}`,
    `*user@${collaborator}`,
    `/user@${collaborator}`,
    `=user@${collaborator}`,
    `?user@${collaborator}`,
    `^user@${collaborator}`,
    `\`user@${collaborator}`,
    `{user@${collaborator}`,
    `|user@${collaborator}`,
    `}user@${collaborator}`,
    `~user@${collaborator}`
  );

  // --- IP address literals ---
  variants.push(
    `user@[192.168.1.1]`,
    `user@[10.0.0.1]`,
    `user@[172.16.0.1]`,
    `user@[127.0.0.1]`,
    `user@[::1]`,
    `user@[IPv6:2001:db8::1]`,
    `user@[IPv6:::1]`,
    `user@[IPv6:fe80::1]`
  );

  // --- Long local parts and domain names (within RFC limits) ---
  const longLocal = 'a'.repeat(64); // Max local part length
  const longDomain = 'a'.repeat(63) + '.com'; // Max label length
  variants.push(
    `${longLocal}@${collaborator}`,
    `user@${longDomain}`,
    `test@${'a'.repeat(50)}.${collaborator}`
  );

  // --- Edge cases with dots (properly quoted) ---
  variants.push(
    `"user."@${collaborator}`, // trailing dot in quoted local part
    `".user"@${collaborator}`, // leading dot in quoted local part
    `"user..test"@${collaborator}`, // consecutive dots in quoted local
    `"user.test."@${collaborator}`, // trailing dot in quoted local
    `user@${collaborator}` // remove the domain trailing dot - not useful for testing
  );

  // --- Whitespace handling (in quoted strings) ---
  variants.push(
    `"user test"@${collaborator}`,
    `" user"@${collaborator}`,
    `"user "@${collaborator}`,
    `" user "@${collaborator}`,
    `"\tuser"@${collaborator}`,
    `"user\t"@${collaborator}`,
    `"\tuser\t"@${collaborator}`
  );

  // Remove duplicates and return sorted variants
  return [...new Set(variants)].sort();
};
