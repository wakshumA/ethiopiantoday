# Security Policy

## 🔒 Security Measures Implemented

### 1. Rate Limiting
- **Public APIs**: 100 requests per minute per IP
- **Sensitive APIs**: 10 requests per minute per IP
- Automatic cleanup of rate limit records

### 2. Security Headers
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Strict-Transport-Security` - Forces HTTPS (production only)
- `Content-Security-Policy` - Restricts resource loading
- `Permissions-Policy` - Blocks unnecessary browser features

### 3. Protected Endpoints
The following endpoints require Bearer token authentication:
- `/api/blog/generate` - Blog post generation
- `/api/blog/auto-generate` - Automated blog generation
- `/api/twitter/post-*` - Twitter posting endpoints
- `/api/rates/override` - Rate override admin endpoint
- `/api/cron/*` - Scheduled task endpoints

### 4. Attack Prevention
- **SQL Injection**: Input validation and suspicious pattern detection
- **XSS Protection**: Content Security Policy and script filtering
- **Path Traversal**: Pattern detection and blocking
- **Bot Detection**: User-agent analysis and blocking of known scanners
- **DDoS Protection**: Rate limiting per IP address

### 5. Environment Security
- All sensitive credentials stored in `.env.local` (git-ignored)
- Example configuration provided in `.env.example`
- Strong token generation recommended using `openssl rand -base64 32`

## 🔐 Environment Variables

### Required Secrets
Generate strong tokens for these variables:

```bash
# Generate strong tokens using OpenSSL
openssl rand -base64 32
```

Required environment variables:
- `OPENAI_API_KEY` - OpenAI API key (if using OpenAI)
- `GROQ_API_KEY` - Groq API key for AI content generation
- `TWITTER_API_KEY` - Twitter API key
- `TWITTER_API_SECRET` - Twitter API secret
- `TWITTER_ACCESS_TOKEN` - Twitter access token
- `TWITTER_ACCESS_SECRET` - Twitter access secret
- `TWITTER_BOT_SECRET` - Secret token for Twitter bot endpoints (min 32 chars)
- `CRON_SECRET` - Secret token for cron job endpoints (min 32 chars)
- `BLOG_GENERATION_SECRET` - Secret token for blog generation (min 32 chars)
- `RATES_ADMIN_KEY` - Admin key for rate override endpoint (min 32 chars)

### Optional Settings
- `ALLOWED_ORIGIN` - CORS allowed origin (default: `*`)
- `NODE_ENV` - Environment mode (`development`, `production`)

## 🛡️ Dependency Vulnerabilities

### Current Status
Run regular security audits:

```bash
npm audit
npm audit fix
```

### Known Issues
- **glob**: High severity - Update to >= 10.5.0
- **js-yaml**: Moderate severity - Update to >= 4.1.1
- **tar-fs**: High severity - Update to >= 3.1.1

### Recommended Actions
1. Update vulnerable dependencies:
   ```bash
   npm update glob js-yaml tar-fs
   npm audit fix --force
   ```

2. Review dependency tree:
   ```bash
   npm audit --production
   ```

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email security concerns to: [your-email@domain.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work on a fix immediately.

## ✅ Security Checklist for Deployment

Before deploying to production:

- [ ] All `.env` variables are set with strong, unique values
- [ ] `.env.local` is in `.gitignore` and NOT committed to repository
- [ ] All dependency vulnerabilities are resolved (`npm audit`)
- [ ] HTTPS is enabled (required for HSTS header)
- [ ] `ALLOWED_ORIGIN` is set to your production domain
- [ ] Rate limiting is tested and configured appropriately
- [ ] All API endpoints requiring authentication are properly secured
- [ ] Security headers are verified using [securityheaders.com](https://securityheaders.com)
- [ ] Penetration testing completed (optional but recommended)
- [ ] Monitoring and logging are configured

## 🔄 Regular Security Maintenance

### Weekly
- Review access logs for suspicious activity
- Check rate limit triggers

### Monthly
- Run `npm audit` and update dependencies
- Review and rotate API keys if compromised
- Check for new CVEs affecting dependencies

### Quarterly
- Full security audit
- Penetration testing
- Review and update security policies

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## 🔍 Security Monitoring

### Recommended Tools
- **npm audit** - Dependency vulnerability scanning
- **Snyk** - Continuous security monitoring
- **Dependabot** - Automated dependency updates (GitHub)
- **OWASP ZAP** - Web application security scanner

### Log Monitoring
Monitor these patterns in logs:
- Failed authentication attempts (401 responses)
- Rate limit violations (429 responses)
- Blocked suspicious requests (403 responses)
- Unusual traffic patterns

---

**Last Updated**: December 2025  
**Version**: 1.0.0
