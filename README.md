# Email Security Test Vector Generator

<div align="center">
  <h3>🔒 Generate Comprehensive Email Address Variants for Security Testing</h3>
  <p>A curated collection of RFC-compliant and edge-case email formats for penetration testing, bug bounty hunting, and security assessments.</p>
</div>

## Live Demo

View the HTML email test live:

[Live Link](https://janpreetwazir.github.io/email-test/)

## Features

- ✅ **150+ Email Variants** - Comprehensive test vectors covering all major email format edge cases
- 🎯 **Security-Focused** - Designed specifically for finding email validation bypasses and vulnerabilities
- 📚 **RFC-Compliant** - All variants are based on legitimate email specifications
- 🔄 **Real-time Generation** - Instant generation with your Burp Collaborator or canary domains
- 📋 **Copy-Friendly** - One-click copy for individual emails or bulk copy all variants
- 🌐 **Internationalized** - Includes Unicode, Punycode, and IDN test cases
- ⚡ **No Dependencies** - Pure client-side JavaScript, no API keys required

## Quick Start

**Prerequisites:** Node.js 16+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000/email-test/`

4. **Generate test vectors:**
   - Enter your Burp Collaborator domain (e.g., `xyz.burpcollaborator.net`)
   - Optionally specify a target domain
   - Click "Generate Email Variants"

## Email Variant Categories

This tool generates email addresses in the following categories:

### 🔧 Basic RFC-Compliant
- Standard formats (`user@domain.com`)
- Plus addressing (`user+tag@domain.com`)
- Dots and special characters (`u.ser@domain.com`, `user_name@domain.com`)

### 📝 Quoted Local Parts
- Quoted strings (`"user name"@domain.com`)
- Escaped characters (`"user\\@name"@domain.com`)
- Special characters in quotes (`" "@domain.com`)

### 💬 Comments (RFC 5322)
- Local part comments (`user(comment)@domain.com`)
- Domain part comments (`user@(comment)domain.com`)
- Multiple comments (`(foo)user@(bar)domain.com`)

### 🌍 Internationalized Domains
- Unicode domains (`user@exämple.domain.com`)
- Punycode encoding (`user@xn--e1afmkfd.domain.com`)
- Multiple character sets (Chinese, Cyrillic, etc.)

### 🔀 Legacy Routing
- Percent routing (`user%collaborator@target.com`)
- UUCP bang paths (`target.com!user@collaborator`)

### 🎭 Case Sensitivity Tests
- Mixed case variants
- All uppercase/lowercase combinations

### 🌐 IP Literals
- IPv4 literals (`user@[127.0.0.1]`)
- IPv6 literals (`user@[IPv6:2001:db8::1]`)
- Localhost variants

### 🔤 Special Characters
- All RFC-allowed symbols (`!#$%&'*=?^{|}~`)
- Boundary testing with dots
- Length limit testing

## Security Testing Use Cases

### 🎯 Penetration Testing
- **Email Validation Bypasses** - Test incomplete validation logic
- **Authentication Bypasses** - Case sensitivity and normalization issues
- **Registration Attacks** - Duplicate account creation
- **Password Reset Abuse** - Email routing and spoofing

### 🐛 Bug Bounty Hunting
- **Input Validation** - Registration forms, login pages
- **API Endpoints** - User creation, password reset APIs
- **Email Processing** - Newsletter signups, contact forms
- **SSRF via Email** - IP literals triggering server requests

### 🔍 Security Assessment
- **RFC Compliance Testing** - Verify proper email handling
- **Edge Case Coverage** - Comprehensive format testing
- **Injection Vulnerabilities** - Header and SMTP injection
- **Encoding Attacks** - Unicode and Punycode issues

## Build and Deploy

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Documentation

- 📖 **[Email Variants Explained](./EMAIL_VARIANTS_EXPLAINED.md)** - Detailed explanation of each test vector category
- 🔬 **[Demo Script](./test-email-generation.js)** - Sample output and testing examples

## Technical Details

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (cyberpunk theme)
- **No Backend Required** - Pure client-side application
- **Mobile Responsive** - Works on all device sizes

## Contributing

Contributions welcome! Focus areas:
- Additional RFC-compliant edge cases
- New internationalization test vectors
- Documentation improvements
- UI/UX enhancements

## License

MIT License - Use responsibly for authorized security testing only.

## Disclaimer

⚠️ **For Authorized Testing Only**

This tool is designed for legitimate security testing with proper authorization. Users are responsible for ensuring they have permission to test target systems. Misuse for malicious purposes is prohibited.

## Credits

Inspired by research from:
- [PortSwigger's Email Atom Splitting](https://portswigger.net/research/splitting-the-email-atom)
- RFC specifications for email formatting
- Real-world penetration testing scenarios
