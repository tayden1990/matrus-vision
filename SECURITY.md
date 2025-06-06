# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **Do NOT create a public GitHub issue**
2. Send an email to: taherakbarisaeed@gmail.com
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Regular Updates**: Weekly until resolved
- **Resolution**: Based on severity (Critical: 7 days, High: 30 days, Medium: 90 days)

### Security Considerations

This application:
- Handles API keys (stored locally)
- Captures screen content
- Makes network requests to OpenAI
- Runs with system-level permissions

### Security Best Practices

When using this application:

1. **API Key Security**
   - Never share your OpenAI API key
   - Regularly rotate your API keys
   - Monitor API usage for unusual activity
   - Store keys securely (the app uses local storage)

2. **Screen Capture Privacy**
   - Be aware that screenshots may contain sensitive information
   - Screenshots are saved locally in your Pictures folder
   - Consider deleting old screenshots regularly
   - Ensure your device is secure when capturing sensitive content

3. **Network Security**
   - All API requests use HTTPS encryption
   - No data is stored on external servers (except OpenAI processing)
   - Screenshots are only sent to OpenAI for analysis

4. **System Permissions**
   - The app requires screen capture permissions
   - Global shortcuts require system-level access
   - Review and approve all permission requests

### Data Handling

- **Local Storage**: Configuration and screenshots stored locally only
- **API Transmission**: Images sent to OpenAI for analysis (encrypted in transit)
- **Data Retention**: Screenshots stored until manually deleted
- **No Telemetry**: No usage data collected or transmitted

### Responsible Disclosure

We follow responsible disclosure practices:
- Security issues handled privately until patched
- Public disclosure only after fixes are available
- Credit given to security researchers (with permission)
- Security advisories published for significant issues

### Contact

For security-related inquiries:
- **Email**: taherakbarisaeed@gmail.com
- **GitHub**: [@tayden1990](https://github.com/tayden1990)
- **Telegram**: https://t.me/tayden2023
- **Response time**: 48 hours maximum
- **Encryption**: PGP key available upon request

### Compliance

This application follows:
- OWASP security guidelines
- Industry standard encryption practices
- Privacy-by-design principles
- Minimal data collection policies

---

**Maintainer**: Taher Akbari Saeed  
*Last updated: June 2025*