# Contributing to Smart Cookie Selector

Thank you for your interest in contributing to Smart Cookie Selector! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear description** of the problem
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Browser version and OS**
- **Extension version**
- **Website URL** where the issue occurred

### Suggesting Features

Feature suggestions are welcome! Please:

- Check existing feature requests first
- Provide a clear description of the feature
- Explain the use case and benefits
- Consider implementation complexity

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure tests pass**: `npm test`
6. **Follow code style**: `npm run lint`
7. **Commit with clear messages**
8. **Push to your fork**
9. **Create a Pull Request**

## 🏗️ Development Setup

### Prerequisites

- Node.js 16 or higher
- npm 8 or higher
- Chrome browser
- Git

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/niruta25/smart-cookie-selector.git
cd smart-cookie-selector

# Add upstream remote
git remote add upstream https://github.com/originalowner/smart-cookie-selector.git

# Install dependencies
npm install

# Start development mode
npm run dev
```

### Loading Extension in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder
5. Extension should appear in your toolbar

## 📝 Code Style Guidelines

### JavaScript

- Use ES6+ features where appropriate
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Prefer `const` over `let`, avoid `var`

```javascript
/**
 * Finds cookie banner elements on the page
 * @param {Document} document - The document to search
 * @returns {Element|null} The found banner element or null
 */
const findCookieBanner = (document) => {
  // Implementation
};
```

### HTML/CSS

- Use semantic HTML5 elements
- Follow BEM naming convention for CSS classes
- Ensure accessibility (ARIA labels, keyboard navigation)
- Mobile-responsive design

### Commit Messages

Follow conventional commits format:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat: add support for French cookie banners
fix: resolve checkbox selection issue on mobile
docs: update installation instructions
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test specific sites
npm run test:sites
```

### Writing Tests

- Write unit tests for new functions
- Add integration tests for complex workflows
- Include E2E tests for critical user journeys
- Test edge cases and error conditions

### Test Structure

```javascript
describe('CookieBannerProcessor', () => {
  beforeEach(() => {
    // Setup
  });

  test('should detect cookie banner', () => {
    // Test implementation
  });

  test('should handle missing elements gracefully', () => {
    // Test error conditions
  });
});
```

## 🌐 Internationalization

### Adding New Languages

1. Add language option to `popup.html`
2. Update selectors in `content.js`
3. Add test cases for the new language
4. Update documentation

### Language-Specific Selectors

When adding selectors for new languages:

```javascript
// Add to cookieSelectors object
acceptAll: [
  // Existing selectors...
  'button:contains("Your Language Accept Text")',
  '[class*="accept-your-language" i]'
]
```

## 🔍 Debugging

### Extension Debugging

1. **Background Script**: Check `chrome://extensions/` → Details → Inspect views: background page
2. **Content Script**: Use browser DevTools on the target page
3. **Popup**: Right-click extension icon → Inspect popup

### Common Issues

- **Manifest errors**: Check console for syntax errors
- **Permission issues**: Verify `host_permissions` in manifest
- **Content script not loading**: Check `matches` patterns
- **Storage issues**: Test with `chrome.storage` API

### Debug Logging

Use consistent logging throughout the codebase:

```javascript
// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('Cookie banner found:', banner);
}

// Error logging (always enabled)
console.error('Failed to process cookie banner:', error);
```

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No merge conflicts with main branch

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added for new functionality
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by maintainers
3. **Testing** on multiple sites/browsers
4. **Documentation review** if applicable
5. **Final approval** and merge

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Steps

1. Update version in `manifest.json` and `package.json`
2. Update `CHANGELOG.md`
3. Create release PR
4. Tag version after merge
5. GitHub Actions handles Chrome Web Store deployment

## 📚 Resources

### Documentation

- [Chrome Extension Development Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome APIs Reference](https://developer.chrome.com/docs/extensions/reference/)

### Tools

- [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/cgfwxhgdophalkanmcgdehaakdeaankl) - Reload extensions during development
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging
- [WebStore Upload Tool](https://github.com/DrewML/chrome-webstore-upload-cli) - CLI upload tool

### Community

- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-chrome-extension) - Technical questions
- [Chrome Extensions Google Group](https://groups.google.com/a/chromium.org/g/chromium-extensions) - Official support
- [Project Discussions](https://github.com/yourusername/smart-cookie-selector/discussions) - Feature requests and general discussion

## ❓ Questions?

If you have questions about contributing:

1. Check existing [Issues](https://github.com/yourusername/smart-cookie-selector/issues)
2. Search [Discussions](https://github.com/yourusername/smart-cookie-selector/discussions)
3. Create a new discussion or issue
4. Contact maintainers directly

## 🙏 Recognition

Contributors will be:

- Listed in the README contributors section
- Mentioned in release notes
- Given credit in the Chrome Web Store description

Thank you for helping make the web more privacy-friendly! 🍪✨