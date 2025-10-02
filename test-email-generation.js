#!/usr/bin/env node

// Simple test to verify email generation functionality
// Note: This is a demonstration script, not a full Node.js compatible module

console.log("Email Security Test Vector Generator - Demo");
console.log("============================================\n");

const collaborator = "dm3ks06nakiknnszdonci5zfv61xpndc.oastify.com";
const targetDomain = "example.com";

console.log(`Using Collaborator: ${collaborator}`);
console.log(`Using Target Domain: ${targetDomain}\n`);

console.log("📋 Curated RFC-compliant & valid edge case email variants:");
console.log("(These are legitimate email formats suitable for security testing)\n");

// Sample of the new curated variants
const sampleVariants = [
  // Basic RFC-compliant formats
  `user@${collaborator}`,
  `u.ser@${collaborator}`,
  `user+tag@${collaborator}`,
  `user_name@${collaborator}`,
  `user-name@${collaborator}`,
  `"user"@${collaborator}`,
  `"user.name"@${collaborator}`,
  `USER@${collaborator.toUpperCase()}`,
  
  // IP literals and special domains
  `user@[127.0.0.1]`,
  `user@[IPv6:2001:db8::1]`,
  `user@localhost`,
  `user@subdomain.${collaborator}`,
  
  // Quoted local parts with escaping
  `"user\\@name"@${collaborator}`,
  `"user name"@${collaborator}`,
  `"user.test"@${collaborator}`,
  `" "@${collaborator}`,
  
  // Comments (RFC 5322 compliant)
  `user(comment)@${collaborator}`,
  `(foo)user@(bar)${collaborator}`,
  `user@(comment)${collaborator}`,
  
  // Encoded words (RFC 2047)
  `=?UTF-8?B?dXNlcg==?=@${collaborator}`,
  `=?UTF-8?Q?user?=@${collaborator}`,
  
  // International domains
  `user@exämple.${collaborator}`,
  `user@例子.${collaborator}`,
  `user@пример.${collaborator}`,
  `user@xn--e1afmkfd.${collaborator}`, // punycode
  `user@xn--fsqu00a.${collaborator}`,
  
  // Legacy formats (source routing)
  `user%${collaborator}@${targetDomain}`,
  `${targetDomain}!user@${collaborator}`,
  
  // Valid special characters
  `!user@${collaborator}`,
  `#user@${collaborator}`,
  `$user@${collaborator}`,
  `%user@${collaborator}`,
  `'user@${collaborator}`,
  `*user@${collaborator}`,
  `=user@${collaborator}`,
  `?user@${collaborator}`,
  `^user@${collaborator}`,
  `{user@${collaborator}`,
  `|user@${collaborator}`,
  `~user@${collaborator}`,
  
  // Case variations
  `User@${collaborator}`,
  `UsEr@${collaborator}`,
  
  // Edge cases with dots
  `"user."@${collaborator}`,
  `".user"@${collaborator}`,
  `"user..test"@${collaborator}`,
  
  // Whitespace in quoted strings
  `"user test"@${collaborator}`,
  `" user "@${collaborator}`,
  `"\tuser\t"@${collaborator}`
];

sampleVariants.forEach((email, index) => {
  console.log(`  ${index + 1}. ${email}`);
});

console.log(`\n📊 Total sample variants shown: ${sampleVariants.length}`);
console.log("📊 Actual generator produces 150+ comprehensive variants!");
console.log("\n🚀 Run 'npm run dev' and open http://localhost:3000/email-test/ to see all variants!");
