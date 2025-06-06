// filepath: e:\my-final-app\matrus-exam-mind\matrus-vision\CONTRIBUTING.md
# Contributing to Screen AI Analyzer

Thank you for considering contributing to Screen AI Analyzer! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/tayden1990/matrus-vision.git
   cd matrus-vision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## 🛠️ Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Project Structure

- `src/main.ts` - Main Electron process
- `src/capture/` - Screen capture functionality
- `src/api/` - External API integrations
- `src/overlay/` - UI overlay management
- `src/utils/` - Utility functions

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple platforms when possible

## 📝 Making Contributions

### Types of Contributions

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance improvements

### Submission Process

1. **Create an issue** (for new features or major changes)
2. **Fork the repository**
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Test thoroughly**
6. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new screenshot optimization"
   ```
7. **Push to your fork**
8. **Create a Pull Request**

### Commit Message Format

Use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 🐛 Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- System information (OS, Node.js version)
- Error logs

### Feature Requests

Include:
- Clear description of the feature
- Use case or problem it solves
- Potential implementation approach
- Any relevant examples

## 📋 Development Tasks

### Priority Areas

- Cross-platform compatibility
- Performance optimization
- UI/UX improvements
- Error handling
- Documentation

### Good First Issues

Look for issues labeled:
- `good first issue`
- `help wanted`
- `documentation`
- `bug`

## 🔍 Code Review Process

All contributions go through code review:

1. **Automated checks** must pass
2. **Maintainer review** for code quality
3. **Testing** on multiple platforms
4. **Documentation** updates if needed

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/tayden1990/matrus-vision/discussions)
- 🐛 [Issues](https://github.com/tayden1990/matrus-vision/issues)
- 📧 Email: taherakbarisaeed@gmail.com
- 📱 Telegram: https://t.me/tayden2023

## 🙏 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

---

**Maintainer**: Taher Akbari Saeed  
Thank you for contributing to Screen AI Analyzer!